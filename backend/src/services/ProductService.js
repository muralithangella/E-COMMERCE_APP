const BaseRepository = require('../repositories/BaseRepository');
const Product = require('../models/Product');
const { ValidationError, NotFoundError } = require('../utils/errors');
const { validateProductFilters } = require('../validators/productValidator');

class ProductService {
  constructor() {
    this.repository = new BaseRepository(Product);
    this.searchEngine = require('../utils/searchEngine');
  }

  async getProducts(filters = {}) {
    const validation = validateProductFilters(filters);
    if (!validation.isValid) {
      throw new ValidationError('Invalid filters', validation.errors);
    }

    const query = this.buildQuery(filters);
    const options = this.buildOptions(filters);
    
    const result = await this.repository.find(query, options);
    
    // Add search relevance scoring
    if (filters.search) {
      result.data = await this.searchEngine.scoreResults(result.data, filters.search);
    }

    return {
      ...result,
      filters: await this.getAvailableFilters(query)
    };
  }

  buildQuery(filters) {
    const query = { isActive: true };

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.brand) {
      query.brand = { $in: Array.isArray(filters.brand) ? filters.brand : [filters.brand] };
    }

    if (filters.minPrice || filters.maxPrice) {
      query['pricing.price'] = {};
      if (filters.minPrice) query['pricing.price'].$gte = Number(filters.minPrice);
      if (filters.maxPrice) query['pricing.price'].$lte = Number(filters.maxPrice);
    }

    if (filters.rating) {
      query['ratings.average'] = { $gte: Number(filters.rating) };
    }

    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    if (filters.inStock) {
      query['inventory.inStock'] = true;
      query['inventory.quantity'] = { $gt: 0 };
    }

    return query;
  }

  buildOptions(filters) {
    const options = {
      page: Number(filters.page) || 1,
      limit: Math.min(Number(filters.limit) || 20, 100),
      populate: ['category', 'seller'],
      select: '-__v -createdAt -updatedAt'
    };

    // Advanced sorting
    const sortMap = {
      'price-low': { 'pricing.price': 1 },
      'price-high': { 'pricing.price': -1 },
      'rating': { 'ratings.average': -1, 'ratings.count': -1 },
      'popularity': { 'ratings.count': -1, 'ratings.average': -1 },
      'newest': { createdAt: -1 },
      'relevance': filters.search ? { score: { $meta: 'textScore' } } : { 'ratings.average': -1 }
    };

    options.sort = sortMap[filters.sort] || sortMap.relevance;
    return options;
  }

  async getAvailableFilters(baseQuery) {
    const pipeline = [
      { $match: baseQuery },
      {
        $group: {
          _id: null,
          brands: { $addToSet: '$brand' },
          categories: { $addToSet: '$category' },
          minPrice: { $min: '$pricing.price' },
          maxPrice: { $max: '$pricing.price' },
          avgRating: { $avg: '$ratings.average' }
        }
      }
    ];

    const [result] = await this.repository.aggregate(pipeline);
    return result || { brands: [], categories: [], minPrice: 0, maxPrice: 0, avgRating: 0 };
  }

  async getProductById(id) {
    const product = await this.repository.findById(id, {
      populate: ['category', 'seller', 'reviews']
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    // Get related products
    const relatedProducts = await this.getRelatedProducts(product);
    
    // Track view for analytics
    await this.trackProductView(id);

    return {
      ...product,
      relatedProducts
    };
  }

  async getRelatedProducts(product) {
    const query = {
      category: product.category,
      _id: { $ne: product._id },
      isActive: true
    };

    const options = {
      limit: 4,
      sort: { 'ratings.average': -1 },
      select: 'name pricing.price images ratings'
    };

    const result = await this.repository.find(query, options);
    return result.data;
  }

  async trackProductView(productId) {
    // Implement analytics tracking
    const analytics = require('../utils/analytics');
    await analytics.trackEvent('product_view', { productId });
  }

  async searchSuggestions(query) {
    if (!query || query.length < 2) return [];

    const pipeline = [
      {
        $match: {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { brand: { $regex: query, $options: 'i' } },
            { tags: { $in: [new RegExp(query, 'i')] } }
          ],
          isActive: true
        }
      },
      {
        $project: {
          name: 1,
          brand: 1,
          category: 1,
          'images.url': { $arrayElemAt: ['$images.url', 0] },
          score: {
            $add: [
              { $cond: [{ $regexMatch: { input: '$name', regex: new RegExp(`^${query}`, 'i') } }, 10, 0] },
              { $cond: [{ $regexMatch: { input: '$brand', regex: new RegExp(`^${query}`, 'i') } }, 5, 0] }
            ]
          }
        }
      },
      { $sort: { score: -1, 'ratings.average': -1 } },
      { $limit: 8 }
    ];

    return this.repository.aggregate(pipeline);
  }
}

module.exports = ProductService;