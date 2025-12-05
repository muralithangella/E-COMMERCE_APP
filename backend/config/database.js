const mongoose = require('mongoose');

class DatabaseManager {
  constructor() {
    this.connection = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
        bufferMaxEntries: 0
      };

      this.connection = await mongoose.connect(
        process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce',
        options
      );

      this.isConnected = true;
      console.log('✅ Database connected successfully');
      
      // Handle connection events
      mongoose.connection.on('error', this.handleError.bind(this));
      mongoose.connection.on('disconnected', this.handleDisconnect.bind(this));
      
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  handleError(error) {
    console.error('Database error:', error);
    this.isConnected = false;
  }

  handleDisconnect() {
    console.warn('Database disconnected');
    this.isConnected = false;
  }

  async disconnect() {
    if (this.connection) {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('Database disconnected');
    }
  }

  getHealthStatus() {
    return {
      connected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name
    };
  }
}

module.exports = new DatabaseManager();