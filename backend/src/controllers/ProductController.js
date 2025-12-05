const ProductService = require('../services/ProductService');
const { asyncHandler } = require('../middleware/asyncHandler');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { CacheManager } = require('../utils/cacheManager');

class ProductController {
  constructor() {
    this.productService = new ProductService();
    this.cache = new CacheManager();
  }

  getProducts = asyncHandler(async (req, res) => {
    const cacheKey = `products:${JSON.stringify(req.query)}`;
    
    let result = await this.cache.get(cacheKey);
    if (!result) {
      result = await this.productService.getProducts(req.query);
      await this.cache.set(cacheKey, result, 300); // 5 minutes cache
    }

    return successResponse(res, result, 'Products retrieved successfully');
  });

  getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const cacheKey = `product:${id}`;
    
    let product = await this.cache.get(cacheKey);
    if (!product) {
      product = await this.productService.getProductById(id);
      await this.cache.set(cacheKey, product, 600); // 10 minutes cache
    }

    return successResponse(res, product, 'Product retrieved successfully');
  });

  searchSuggestions = asyncHandler(async (req, res) => {
    const { q } = req.query;
    const cacheKey = `suggestions:${q}`;
    
    let suggestions = await this.cache.get(cacheKey);
    if (!suggestions) {
      suggestions = await this.productService.searchSuggestions(q);
      await this.cache.set(cacheKey, suggestions, 180); // 3 minutes cache
    }

    return successResponse(res, suggestions, 'Suggestions retrieved successfully');
  });

  getTrendingProducts = asyncHandler(async (req, res) => {
    const cacheKey = 'trending:products';
    
    let trending = await this.cache.get(cacheKey);
    if (!trending) {
      trending = await this.productService.getProducts({
        sort: 'popularity',
        limit: 20,
        inStock: true
      });
      await this.cache.set(cacheKey, trending, 1800); // 30 minutes cache
    }

    return successResponse(res, trending.data, 'Trending products retrieved successfully');
  });

  getDealsOfTheDay = asyncHandler(async (req, res) => {
    const cacheKey = 'deals:today';
    
    let deals = await this.cache.get(cacheKey);
    if (!deals) {
      deals = await this.productService.getProducts({
        minDiscount: 20,
        sort: 'price-low',
        limit: 12,
        inStock: true
      });
      await this.cache.set(cacheKey, deals, 3600); // 1 hour cache
    }

    return successResponse(res, deals.data, 'Deals retrieved successfully');
  });

  getProductsByCategory = asyncHandler(async (req, res) => {
    const { category } = req.params;
    const filters = { ...req.query, category };
    
    const result = await this.productService.getProducts(filters);
    return successResponse(res, result, `Products in ${category} retrieved successfully`);
  });

  getProductRecommendations = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user || {};
    
    const recommendations = await this.productService.getRecommendations(id, userId);
    return successResponse(res, recommendations, 'Recommendations retrieved successfully');
  });
}

module.exports = new ProductController();