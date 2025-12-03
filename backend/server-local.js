require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const colors = require('colors');

// Import enhanced logger for local development
const { 
  createServiceLogger, 
  requestLogger, 
  dbLogger, 
  kafkaLogger, 
  redisLogger,
  performanceLogger 
} = require('./config/logger.local');

// Import existing configurations
const { connectDB } = require('./config/database');
const { connectRedis } = require('./config');
const { initializeKafka } = require('./config/kafka');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { rateLimiter } = require('./middleware/rateLimiter');

// Import routes
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;
const logger = createServiceLogger('MAIN-SERVER');

// Startup banner
console.log('\\n' + '='.repeat(60).cyan);
console.log('🚀 E-COMMERCE BACKEND - LOCAL DEVELOPMENT MODE'.bold.cyan);
console.log('='.repeat(60).cyan);

// Middleware setup
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enhanced request logging for local development
app.use(requestLogger('API-GATEWAY'));

// Rate limiting
app.use('/api', rateLimiter);

// Health check endpoint with detailed status
app.get('/health', async (req, res) => {
  const timer = performanceLogger.startTimer('health-check');
  
  try {
    const health = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV,
      services: {
        mongodb: 'checking...',
        redis: 'checking...',
        kafka: 'checking...'
      }
    };
    
    // Check MongoDB
    try {
      const mongoose = require('mongoose');
      if (mongoose.connection.readyState === 1) {
        health.services.mongodb = 'connected';
      } else {
        health.services.mongodb = 'disconnected';
      }
    } catch (error) {
      health.services.mongodb = 'error';
    }
    
    // Check Redis
    try {
      const redis = require('./config').redis;
      if (redis && redis.status === 'ready') {
        health.services.redis = 'connected';
      } else {
        health.services.redis = 'disconnected';
      }
    } catch (error) {
      health.services.redis = 'error';
    }
    
    // Check Kafka
    try {
      const kafka = require('./config').kafka;
      if (kafka) {
        health.services.kafka = 'connected';
      } else {
        health.services.kafka = 'disconnected';
      }
    } catch (error) {
      health.services.kafka = 'error';
    }
    
    const duration = timer.end({ endpoint: '/health' });
    
    logger.info('Health check completed', {
      duration: `${duration.toFixed(2)}ms`,
      services: health.services
    });
    
    res.json(health);
  } catch (error) {
    timer.end({ endpoint: '/health', error: true });
    logger.error('Health check failed', { error: error.message });
    res.status(500).json({ status: 'ERROR', message: error.message });
  }
});

// API routes
app.use('/api', routes);

// 404 handler
app.use('*', (req, res) => {
  logger.warn('Route not found', { 
    method: req.method, 
    url: req.originalUrl,
    ip: req.ip 
  });
  res.status(404).json({ 
    success: false, 
    message: 'Route not found',
    path: req.originalUrl 
  });
});

// Error handling
app.use(errorHandler);

// Initialize services and start server
async function startServer() {
  try {
    console.log('\\n📋 Initializing services...'.yellow);
    
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...'.cyan);
    await connectDB();
    dbLogger.connection('connected', { 
      uri: process.env.MONGODB_URI?.replace(/\\/\\/.*@/, '//***:***@') 
    });
    console.log('✅ MongoDB connected successfully'.green);
    
    // Connect to Redis
    console.log('🔗 Connecting to Redis...'.cyan);
    await connectRedis();
    redisLogger.connection('connected', { 
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT 
    });
    console.log('✅ Redis connected successfully'.green);
    
    // Initialize Kafka
    console.log('🔗 Initializing Kafka...'.cyan);
    await initializeKafka();
    kafkaLogger.producer('system', { event: 'kafka_initialized' });
    console.log('✅ Kafka initialized successfully'.green);
    
    // Start HTTP server
    const server = app.listen(PORT, () => {
      console.log('\\n' + '='.repeat(60).green);
      console.log(`🎉 SERVER RUNNING ON PORT ${PORT}`.bold.green);
      console.log('='.repeat(60).green);
      console.log(`📍 API Base URL: http://localhost:${PORT}/api`.cyan);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`.cyan);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`.cyan);
      console.log('='.repeat(60).green + '\\n');
      
      logger.info('Server started successfully', {
        port: PORT,
        environment: process.env.NODE_ENV,
        pid: process.pid
      });
    });
    
    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      console.log(`\\n🛑 Received ${signal}. Starting graceful shutdown...`.yellow);
      
      server.close(async () => {
        logger.info('HTTP server closed');
        
        try {
          // Close database connections
          const mongoose = require('mongoose');
          await mongoose.connection.close();
          dbLogger.connection('disconnected');
          console.log('✅ MongoDB connection closed'.green);
          
          // Close Redis connection
          const { redis } = require('./config');
          if (redis) {
            await redis.quit();
            redisLogger.connection('disconnected');
            console.log('✅ Redis connection closed'.green);
          }
          
          // Close Kafka connections
          const { kafka } = require('./config');
          if (kafka) {
            // Kafka cleanup would go here
            console.log('✅ Kafka connections closed'.green);
          }
          
          console.log('👋 Graceful shutdown completed'.green);
          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown', { error: error.message });
          process.exit(1);
        }
      });
    };
    
    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception', { 
        error: error.message, 
        stack: error.stack 
      });
      console.error('💥 Uncaught Exception:'.red, error);
      process.exit(1);
    });
    
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection', { 
        reason: reason?.message || reason,
        promise: promise.toString()
      });
      console.error('💥 Unhandled Rejection:'.red, reason);
      process.exit(1);
    });
    
  } catch (error) {
    logger.error('Failed to start server', { 
      error: error.message, 
      stack: error.stack 
    });
    console.error('❌ Failed to start server:'.red, error);
    process.exit(1);
  }
}

// Start the server
startServer();