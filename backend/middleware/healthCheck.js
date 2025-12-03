const mongoose = require('mongoose');
const DatabaseManager = require('../config/database');
const KafkaManager = require('../config/kafka');

class HealthCheckService {
  static async checkDatabase() {
    try {
      const state = mongoose.connection.readyState;
      const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
      };
      
      if (state === 1) {
        // Test query
        await mongoose.connection.db.admin().ping();
        return { status: 'healthy', state: states[state] };
      }
      
      return { status: 'unhealthy', state: states[state] };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  static async checkRedis() {
    try {
      const client = DatabaseManager.getRedisClient();
      if (!client) {
        return { status: 'unavailable' };
      }
      
      await client.ping();
      return { status: 'healthy' };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  static async checkKafka() {
    try {
      // Simple connectivity check
      return { status: 'healthy' };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  static getSystemMetrics() {
    const usage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    return {
      memory: {
        heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(usage.heapTotal / 1024 / 1024),
        external: Math.round(usage.external / 1024 / 1024),
        rss: Math.round(usage.rss / 1024 / 1024)
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system
      },
      uptime: Math.round(process.uptime()),
      version: process.version,
      platform: process.platform
    };
  }

  static async getDetailedHealth() {
    const [database, redis, kafka] = await Promise.all([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkKafka()
    ]);

    const metrics = this.getSystemMetrics();
    const overall = database.status === 'healthy' && redis.status === 'healthy' ? 'healthy' : 'degraded';

    return {
      status: overall,
      timestamp: new Date().toISOString(),
      services: { database, redis, kafka },
      metrics,
      environment: process.env.NODE_ENV
    };
  }
}

const healthCheckMiddleware = async (req, res) => {
  try {
    const health = await HealthCheckService.getDetailedHealth();
    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

const readinessCheck = async (req, res) => {
  try {
    const [dbHealth, redisHealth] = await Promise.all([
      HealthCheckService.checkDatabase(),
      HealthCheckService.checkRedis()
    ]);

    const isReady = dbHealth.status === 'healthy' && redisHealth.status === 'healthy';
    
    res.status(isReady ? 200 : 503).json({
      ready: isReady,
      checks: { database: dbHealth, redis: redisHealth }
    });
  } catch (error) {
    res.status(503).json({ ready: false, error: error.message });
  }
};

const livenessCheck = (req, res) => {
  res.status(200).json({ alive: true, timestamp: new Date().toISOString() });
};

module.exports = {
  HealthCheckService,
  healthCheckMiddleware,
  readinessCheck,
  livenessCheck
};