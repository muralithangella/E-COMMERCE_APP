const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const CacheService = require('../services/cacheService');

class AnalyticsWorker {
  constructor() {
    this.isRunning = false;
  }

  async start() {
    console.log('Starting Analytics Worker...');
    this.isRunning = true;
    
    // Run analytics updates every 15 minutes
    setInterval(async () => {
      if (this.isRunning) {
        await this.updateDashboardStats();
        await this.updateProductAnalytics();
      }
    }, 15 * 60 * 1000);

    // Initial run
    await this.updateDashboardStats();
  }

  async stop() {
    this.isRunning = false;
    console.log('Analytics Worker stopped');
  }

  async updateDashboardStats() {
    try {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      const [
        totalUsers,
        totalOrders,
        totalProducts,
        todayOrders,
        monthlyRevenue,
        recentOrders
      ] = await Promise.all([
        User.countDocuments({ role: 'customer' }),
        Order.countDocuments(),
        Product.countDocuments({ status: 'published' }),
        Order.countDocuments({ createdAt: { $gte: startOfDay } }),
        this.calculateMonthlyRevenue(startOfMonth),
        Order.find()
          .populate('customer', 'firstName lastName email')
          .sort({ createdAt: -1 })
          .limit(5)
      ]);

      const stats = {
        totalUsers,
        totalOrders,
        totalProducts,
        todayOrders,
        monthlyRevenue,
        recentOrders,
        lastUpdated: new Date()
      };

      await CacheService.cacheDashboardStats(stats, 900); // Cache for 15 minutes
      console.log('Dashboard stats updated');
      
    } catch (error) {
      console.error('Error updating dashboard stats:', error);
    }
  }

  async calculateMonthlyRevenue(startOfMonth) {
    try {
      const result = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfMonth },
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
      ]);

      return result[0] || { totalRevenue: 0, orderCount: 0, averageOrderValue: 0 };
    } catch (error) {
      console.error('Error calculating monthly revenue:', error);
      return { totalRevenue: 0, orderCount: 0, averageOrderValue: 0 };
    }
  }

  async updateProductAnalytics() {
    try {
      // Update top selling products
      const topProducts = await Order.aggregate([
        { $match: { 'payment.status': 'completed' } },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.product',
            totalSold: { $sum: '$items.quantity' },
            totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
          }
        },
        { $sort: { totalSold: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product'
          }
        }
      ]);

      await CacheService.set('analytics:top-products', topProducts, 3600); // Cache for 1 hour
      
      // Update low stock products
      const lowStockProducts = await Product.find({
        $expr: { $lte: ['$inventory.quantity', '$inventory.lowStockThreshold'] },
        status: 'published'
      }).select('name sku inventory.quantity inventory.lowStockThreshold');

      await CacheService.set('analytics:low-stock', lowStockProducts, 1800); // Cache for 30 minutes
      
      console.log('Product analytics updated');
      
    } catch (error) {
      console.error('Error updating product analytics:', error);
    }
  }

  async generateSalesReport(startDate, endDate) {
    try {
      const salesData = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
            'payment.status': 'completed'
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            dailyRevenue: { $sum: '$pricing.total' },
            orderCount: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]);

      return salesData;
    } catch (error) {
      console.error('Error generating sales report:', error);
      return [];
    }
  }

  async updateUserAnalytics() {
    try {
      const userStats = await User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ]);

      const newUsersThisMonth = await User.countDocuments({
        createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
      });

      const analytics = {
        userStats,
        newUsersThisMonth,
        lastUpdated: new Date()
      };

      await CacheService.set('analytics:users', analytics, 3600);
      console.log('User analytics updated');
      
    } catch (error) {
      console.error('Error updating user analytics:', error);
    }
  }
}

module.exports = new AnalyticsWorker();