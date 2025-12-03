const cron = require('node-cron');
const InventoryWorker = require('./inventoryWorker');
const NotificationWorker = require('./notificationWorker');
const AnalyticsWorker = require('./analyticsWorker');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

class ScheduledTasks {
  start() {
    console.log('Starting Scheduled Tasks...');

    // Check low stock every hour
    cron.schedule('0 * * * *', async () => {
      console.log('Running low stock check...');
      await InventoryWorker.checkLowStockProducts();
    });

    // Process email queue every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      await NotificationWorker.processEmailQueue();
    });

    // Clean up expired notifications daily at 2 AM
    cron.schedule('0 2 * * *', async () => {
      console.log('Running notification cleanup...');
      await NotificationWorker.cleanupExpiredNotifications();
    });

    // Clean up abandoned carts weekly on Sunday at 3 AM
    cron.schedule('0 3 * * 0', async () => {
      console.log('Running cart cleanup...');
      await this.cleanupAbandonedCarts();
    });

    // Update analytics every 30 minutes
    cron.schedule('*/30 * * * *', async () => {
      await AnalyticsWorker.updateDashboardStats();
    });

    // Cancel expired pending orders daily at 1 AM
    cron.schedule('0 1 * * *', async () => {
      console.log('Running order cleanup...');
      await this.cancelExpiredOrders();
    });

    // Generate daily reports at midnight
    cron.schedule('0 0 * * *', async () => {
      console.log('Generating daily reports...');
      await this.generateDailyReports();
    });

    console.log('Scheduled tasks initialized');
  }

  async cleanupAbandonedCarts() {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const result = await Cart.deleteMany({
        lastModified: { $lt: sevenDaysAgo },
        totalItems: 0
      });

      console.log(`Cleaned up ${result.deletedCount} abandoned carts`);
    } catch (error) {
      console.error('Error cleaning up abandoned carts:', error);
    }
  }

  async cancelExpiredOrders() {
    try {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const expiredOrders = await Order.find({
        status: 'pending',
        'payment.status': 'pending',
        createdAt: { $lt: oneDayAgo }
      });

      for (const order of expiredOrders) {
        order.status = 'cancelled';
        await order.save();
        
        // Release inventory
        const InventoryService = require('../services/inventoryService');
        await InventoryService.releaseStock(order.items, order._id);
      }

      console.log(`Cancelled ${expiredOrders.length} expired orders`);
    } catch (error) {
      console.error('Error cancelling expired orders:', error);
    }
  }

  async generateDailyReports() {
    try {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const startOfDay = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);

      const [orderStats, revenueStats] = await Promise.all([
        Order.aggregate([
          {
            $match: {
              createdAt: { $gte: startOfDay, $lt: endOfDay }
            }
          },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ]),
        Order.aggregate([
          {
            $match: {
              createdAt: { $gte: startOfDay, $lt: endOfDay },
              'payment.status': 'completed'
            }
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: '$pricing.total' },
              orderCount: { $sum: 1 },
              averageOrderValue: { $avg: '$pricing.total' }
            }
          }
        ])
      ]);

      const report = {
        date: yesterday.toISOString().split('T')[0],
        orderStats,
        revenue: revenueStats[0] || { totalRevenue: 0, orderCount: 0, averageOrderValue: 0 },
        generatedAt: new Date()
      };

      // Store report in cache or database
      const CacheService = require('../services/cacheService');
      await CacheService.set(`daily-report:${report.date}`, report, 7 * 24 * 60 * 60); // Keep for 7 days

      console.log(`Daily report generated for ${report.date}`);
    } catch (error) {
      console.error('Error generating daily reports:', error);
    }
  }

  async backupDatabase() {
    try {
      // This would typically integrate with your backup solution
      console.log('Database backup initiated...');
      
      // Example: MongoDB dump command
      // const { exec } = require('child_process');
      // exec('mongodump --db ecommerce --out /backups/', (error, stdout, stderr) => {
      //   if (error) {
      //     console.error('Backup failed:', error);
      //   } else {
      //     console.log('Database backup completed');
      //   }
      // });
      
    } catch (error) {
      console.error('Error during database backup:', error);
    }
  }

  async healthCheck() {
    try {
      // Check database connections
      const mongoose = require('mongoose');
      const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
      
      // Check Redis connection
      const DatabaseManager = require('../config/database');
      const redisClient = DatabaseManager.getRedisClient();
      let redisStatus = 'disconnected';
      
      if (redisClient) {
        try {
          await redisClient.ping();
          redisStatus = 'connected';
        } catch (error) {
          redisStatus = 'error';
        }
      }

      const healthStatus = {
        timestamp: new Date(),
        database: dbStatus,
        redis: redisStatus,
        uptime: process.uptime()
      };

      console.log('Health check completed:', healthStatus);
      return healthStatus;
      
    } catch (error) {
      console.error('Error during health check:', error);
    }
  }
}

module.exports = new ScheduledTasks();