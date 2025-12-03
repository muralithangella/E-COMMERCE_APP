const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');
const KafkaManager = require('../config/kafka');

class ProductService {
  async createProduct(productData, userId) {
    try {
      const slug = this.generateSlug(productData.name);
      
      const product = new Product({
        ...productData,
        slug,
        vendor: userId
      });

      await product.save();

      await KafkaManager.publishEvent('product-events', {
        eventType: 'PRODUCT_CREATED',
        data: {
          productId: product._id,
          name: product.name,
          vendor: userId
        }
      });

      return product;
    } catch (error) {
      console.error('Product creation failed:', error);
      throw error;
    }
  }

  async updateProduct(productId, updateData, userId) {
    try {
      const product = await Product.findOneAndUpdate(
        { _id: productId, vendor: userId },
        updateData,
        { new: true, runValidators: true }
      );

      if (!product) {
        throw new Error('Product not found or unauthorized');
      }

      await KafkaManager.publishEvent('product-events', {
        eventType: 'PRODUCT_UPDATED',
        data: {
          productId: product._id,
          name: product.name
        }
      });

      return product;
    } catch (error) {
      console.error('Product update failed:', error);
      throw error;
    }
  }

  async searchProducts(query, filters = {}) {
    try {
      const searchFilter = {
        status: 'published',
        ...filters
      };

      if (query) {
        searchFilter.$text = { $search: query };
      }

      if (filters.category) {
        searchFilter.category = filters.category;
      }

      if (filters.minPrice || filters.maxPrice) {
        searchFilter['price.regular'] = {};
        if (filters.minPrice) searchFilter['price.regular'].$gte = parseFloat(filters.minPrice);
        if (filters.maxPrice) searchFilter['price.regular'].$lte = parseFloat(filters.maxPrice);
      }

      if (filters.inStock) {
        searchFilter['inventory.quantity'] = { $gt: 0 };
      }

      const products = await Product.find(searchFilter)
        .populate('category', 'name slug')
        .sort(this.getSortOptions(filters.sort))
        .limit(filters.limit || 20)
        .skip(filters.skip || 0);

      const total = await Product.countDocuments(searchFilter);

      return { products, total };
    } catch (error) {
      console.error('Product search failed:', error);
      throw error;
    }
  }

  async getProductWithReviews(productId) {
    try {
      const [product, reviews, reviewStats] = await Promise.all([
        Product.findById(productId).populate('category', 'name slug'),
        Review.find({ product: productId, status: 'approved' })
          .populate('user', 'firstName lastName')
          .sort({ createdAt: -1 })
          .limit(10),
        Review.aggregate([
          { $match: { product: productId, status: 'approved' } },
          {
            $group: {
              _id: null,
              averageRating: { $avg: '$rating' },
              totalReviews: { $sum: 1 },
              ratingDistribution: {
                $push: '$rating'
              }
            }
          }
        ])
      ]);

      if (!product) {
        throw new Error('Product not found');
      }

      const stats = reviewStats[0] || { averageRating: 0, totalReviews: 0 };
      
      return {
        product,
        reviews,
        reviewStats: stats
      };
    } catch (error) {
      console.error('Failed to get product with reviews:', error);
      throw error;
    }
  }

  async getFeaturedProducts(limit = 10) {
    try {
      return await Product.find({
        featured: true,
        status: 'published',
        'inventory.quantity': { $gt: 0 }
      })
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .limit(limit);
    } catch (error) {
      console.error('Failed to get featured products:', error);
      throw error;
    }
  }

  async getRelatedProducts(productId, limit = 5) {
    try {
      const product = await Product.findById(productId);
      if (!product) return [];

      return await Product.find({
        _id: { $ne: productId },
        category: product.category,
        status: 'published',
        'inventory.quantity': { $gt: 0 }
      })
        .limit(limit)
        .select('name slug price images');
    } catch (error) {
      console.error('Failed to get related products:', error);
      throw error;
    }
  }

  generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  getSortOptions(sortBy) {
    const sortOptions = {
      'price-asc': { 'price.regular': 1 },
      'price-desc': { 'price.regular': -1 },
      'name-asc': { name: 1 },
      'name-desc': { name: -1 },
      'rating': { 'ratings.average': -1 },
      'newest': { createdAt: -1 },
      'oldest': { createdAt: 1 }
    };

    return sortOptions[sortBy] || { createdAt: -1 };
  }

  async updateProductRating(productId) {
    try {
      const stats = await Review.aggregate([
        { $match: { product: productId, status: 'approved' } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 }
          }
        }
      ]);

      const { averageRating = 0, totalReviews = 0 } = stats[0] || {};

      await Product.findByIdAndUpdate(productId, {
        'ratings.average': Math.round(averageRating * 10) / 10,
        'ratings.count': totalReviews
      });
    } catch (error) {
      console.error('Failed to update product rating:', error);
    }
  }
}

module.exports = new ProductService();