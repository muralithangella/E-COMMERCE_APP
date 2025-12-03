const mongoose = require('mongoose');

class QueryOptimizationService {
  // Optimized aggregation pipeline for analytics
  static getOptimizedProductAnalytics() {
    return [
      {
        $match: {
          status: 'published',
          'inventory.quantity': { $gt: 0 }
        }
      },
      {
        $lookup: {
          from: 'orders',
          let: { productId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ['$$productId', '$items.product']
                },
                'payment.status': 'completed'
              }
            },
            {
              $unwind: '$items'
            },
            {
              $match: {
                $expr: { $eq: ['$items.product', '$$productId'] }
              }
            },
            {
              $group: {
                _id: null,
                totalSold: { $sum: '$items.quantity' },
                totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
              }
            }
          ],
          as: 'salesData'
        }
      },
      {
        $addFields: {
          totalSold: { $ifNull: [{ $arrayElemAt: ['$salesData.totalSold', 0] }, 0] },
          totalRevenue: { $ifNull: [{ $arrayElemAt: ['$salesData.totalRevenue', 0] }, 0] }
        }
      },
      {
        $project: {
          name: 1,
          price: 1,
          'inventory.quantity': 1,
          totalSold: 1,
          totalRevenue: 1,
          'ratings.average': 1
        }
      }
    ];
  }

  // Optimized search with text indexing
  static buildOptimizedSearchQuery(searchTerm, filters = {}) {
    const pipeline = [];

    // Text search stage
    if (searchTerm) {
      pipeline.push({
        $match: {
          $text: { $search: searchTerm },
          status: 'published'
        }
      });
      
      // Add text score for relevance sorting
      pipeline.push({
        $addFields: {
          score: { $meta: 'textScore' }
        }
      });
    } else {
      pipeline.push({
        $match: { status: 'published' }
      });
    }

    // Apply filters
    const matchStage = {};
    
    if (filters.category) {
      matchStage.category = new mongoose.Types.ObjectId(filters.category);
    }
    
    if (filters.minPrice || filters.maxPrice) {
      matchStage['price.regular'] = {};
      if (filters.minPrice) matchStage['price.regular'].$gte = parseFloat(filters.minPrice);
      if (filters.maxPrice) matchStage['price.regular'].$lte = parseFloat(filters.maxPrice);
    }
    
    if (filters.inStock) {
      matchStage['inventory.quantity'] = { $gt: 0 };
    }
    
    if (filters.rating) {
      matchStage['ratings.average'] = { $gte: parseFloat(filters.rating) };
    }

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // Lookup category information
    pipeline.push({
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'categoryInfo',
        pipeline: [{ $project: { name: 1, slug: 1 } }]
      }
    });

    // Sort stage
    const sortStage = {};
    if (searchTerm) {
      sortStage.score = { $meta: 'textScore' };
    }
    
    switch (filters.sort) {
      case 'price-asc':
        sortStage['price.regular'] = 1;
        break;
      case 'price-desc':
        sortStage['price.regular'] = -1;
        break;
      case 'rating':
        sortStage['ratings.average'] = -1;
        break;
      case 'popularity':
        sortStage.totalSold = -1;
        break;
      default:
        sortStage.createdAt = -1;
    }
    
    pipeline.push({ $sort: sortStage });

    return pipeline;
  }

  // Batch operations for better performance
  static async batchUpdateInventory(updates) {
    const bulkOps = updates.map(update => ({
      updateOne: {
        filter: { _id: update.productId },
        update: { 
          $inc: { 'inventory.quantity': update.quantityChange },
          $set: { updatedAt: new Date() }
        }
      }
    }));

    const Product = require('../models/Product');
    return await Product.bulkWrite(bulkOps, { ordered: false });
  }

  // Optimized user activity aggregation
  static getUserActivityPipeline(userId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return [
      {
        $match: {
          customer: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          orderCount: { $sum: 1 },
          totalSpent: { $sum: '$pricing.total' },
          avgOrderValue: { $avg: '$pricing.total' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ];
  }

  // Index recommendations
  static getRecommendedIndexes() {
    return {
      products: [
        { 'name': 'text', 'description': 'text', 'tags': 'text' },
        { 'category': 1, 'status': 1 },
        { 'price.regular': 1 },
        { 'inventory.quantity': 1 },
        { 'ratings.average': -1 },
        { 'createdAt': -1 },
        { 'featured': 1, 'status': 1 }
      ],
      orders: [
        { 'customer': 1, 'createdAt': -1 },
        { 'status': 1 },
        { 'payment.status': 1 },
        { 'orderNumber': 1 },
        { 'createdAt': -1 }
      ],
      users: [
        { 'email': 1 },
        { 'role': 1, 'isActive': 1 },
        { 'createdAt': -1 }
      ]
    };
  }
}

module.exports = QueryOptimizationService;