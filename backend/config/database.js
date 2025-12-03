const mongoose = require('mongoose');
const redis = require('redis');

class DatabaseManager {
  constructor() {
    this.mongoConnections = {};
    this.redisClient = null;
    this.redisCluster = null;
  }

  // Optimized MongoDB Connection
  async connect() {
    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://muralithangella_db_user:sW6i6ceY2q1W0oTc@fullstack.qnyvzwj.mongodb.net/ecommerce';
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false
      });
      console.log('MongoDB connected with optimized pool');
      return mongoose.connection;
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  // MongoDB Replica Set Connection
  async connectMongoDB() {
    try {
      const baseUri = process.env.MONGODB_URI || 'mongodb+srv://muralithangella_db_user:sW6i6ceY2q1W0oTc@fullstack.qnyvzwj.mongodb.net/ecommerce';
      
      // Main connection with replica set
      const mainConnection = await mongoose.createConnection(baseUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000
      });

      // Use same URI for all services if individual URIs not provided
      this.mongoConnections.products = await mongoose.createConnection(process.env.MONGODB_URI_PRODUCTS || baseUri, {
        maxPoolSize: 5
      });

      this.mongoConnections.orders = await mongoose.createConnection(process.env.MONGODB_URI_ORDERS || baseUri, {
        maxPoolSize: 5
      });

      this.mongoConnections.users = await mongoose.createConnection(process.env.MONGODB_URI_USERS || baseUri, {
        maxPoolSize: 5
      });

      console.log('MongoDB connections established successfully');
      return { main: mainConnection, ...this.mongoConnections };
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }



  // Redis Connection
  async connectRedis() {
    try {
      // Check if Redis is required
      if (process.env.SKIP_REDIS === 'true') {
        console.log('Redis connection skipped');
        return null;
      }
      
      console.log('SKIP_REDIS value:', process.env.SKIP_REDIS);

      const redisUrl = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`;
      
      this.redisClient = redis.createClient({
        url: redisUrl,
        password: process.env.REDIS_PASSWORD || undefined,
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > 10) {
              return new Error('Redis max retries exceeded');
            }
            return Math.min(retries * 100, 3000);
          }
        }
      });

      this.redisClient.on('error', (err) => {
        console.error('Redis Client Error:', err.message);
      });

      this.redisClient.on('connect', () => {
        console.log('Connecting to Redis...');
      });

      this.redisClient.on('ready', () => {
        console.log('Redis connected successfully');
      });

      await this.redisClient.connect();
      return this.redisClient;
    } catch (error) {
      console.error('Redis connection error:', error.message);
      console.log('💡 To skip Redis: set SKIP_REDIS=true in .env');
      throw error;
    }
  }

  // Get database connections
  getMongoConnection(dbName = 'main') {
    return this.mongoConnections[dbName] || mongoose.connection;
  }



  getRedisClient() {
    return this.redisCluster || this.redisClient;
  }

  // Close all connections
  async closeConnections() {
    try {
      // Close MongoDB connections
      for (const [name, connection] of Object.entries(this.mongoConnections)) {
        await connection.close();
        console.log(`MongoDB ${name} connection closed`);
      }



      // Close Redis connections
      if (this.redisCluster) {
        this.redisCluster.disconnect();
        console.log('Redis cluster disconnected');
      } else if (this.redisClient) {
        await this.redisClient.quit();
        console.log('Redis client disconnected');
      }
    } catch (error) {
      console.error('Error closing database connections:', error);
    }
  }
}

module.exports = new DatabaseManager();