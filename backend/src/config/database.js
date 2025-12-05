const mongoose = require('mongoose');
const Redis = require('ioredis');

class DatabaseManager {
  constructor() {
    this.mongodb = null;
    this.redis = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      this.mongodb = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/amazon-replica', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
        bufferMaxEntries: 0
      });

      this.redis = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD,
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
        lazyConnect: true
      });

      this.isConnected = true;
      console.log('✅ Database connections established');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.mongodb) await mongoose.disconnect();
    if (this.redis) await this.redis.disconnect();
    this.isConnected = false;
  }

  getRedis() { return this.redis; }
  getMongoDB() { return this.mongodb; }
}

module.exports = new DatabaseManager();