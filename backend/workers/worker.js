require('dotenv').config({ path: '../.env' });
const OrderWorker = require('./orderWorker');
const PaymentWorker = require('./paymentWorker');
const InventoryWorker = require('./inventoryWorker');
const NotificationWorker = require('./notificationWorker');
const AnalyticsWorker = require('./analyticsWorker');
const ScheduledTasks = require('./scheduledTasks');
const DatabaseManager = require('../config/database');

class WorkerManager {
  constructor() {
    this.workers = [];
    this.isRunning = false;
  }

  async start() {
    try {
      console.log('Starting Worker Manager...');
      
      // Connect to databases
      await DatabaseManager.connectMongoDB();
      await DatabaseManager.connectRedis();
      
      // Start all workers
      await Promise.all([
        OrderWorker.start(),
        PaymentWorker.start(),
        InventoryWorker.start(),
        NotificationWorker.start(),
        AnalyticsWorker.start()
      ]);

      // Start scheduled tasks
      ScheduledTasks.start();
      
      this.isRunning = true;
      console.log('All workers started successfully');
      
      // Graceful shutdown handlers
      process.on('SIGINT', () => this.shutdown());
      process.on('SIGTERM', () => this.shutdown());
      
    } catch (error) {
      console.error('Failed to start workers:', error);
      process.exit(1);
    }
  }

  async shutdown() {
    if (!this.isRunning) return;
    
    console.log('Shutting down workers...');
    this.isRunning = false;
    
    try {
      // Stop analytics worker
      await AnalyticsWorker.stop();
      
      // Disconnect from Kafka
      const KafkaManager = require('../config/kafka');
      await KafkaManager.disconnect();
      
      // Close database connections
      await DatabaseManager.closeConnections();
      
      console.log('Workers shut down successfully');
      process.exit(0);
      
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      timestamp: new Date()
    };
  }
}

// Start workers if this file is run directly
if (require.main === module) {
  const workerManager = new WorkerManager();
  workerManager.start();
}

module.exports = WorkerManager;