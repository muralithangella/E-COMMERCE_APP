const express = require('express');
const ProductController = require('../controllers/ProductController');
const { validateQuery } = require('../middleware/validation');
const { authenticate, authorize } = require('../middleware/auth');
const { cacheMiddleware } = require('../middleware/cache');

const router = express.Router();

router.get('/', 
  validateQuery(['page', 'limit', 'sort', 'category', 'brand', 'minPrice', 'maxPrice', 'rating']),
  cacheMiddleware(300),
  ProductController.getProducts
);

router.get('/search/suggestions',
  validateQuery(['q']),
  cacheMiddleware(180),
  ProductController.searchSuggestions
);

router.get('/trending',
  cacheMiddleware(1800),
  ProductController.getTrendingProducts
);

router.get('/deals',
  cacheMiddleware(3600),
  ProductController.getDealsOfTheDay
);

router.get('/category/:category',
  validateQuery(['page', 'limit', 'sort']),
  ProductController.getProductsByCategory
);

router.get('/:id',
  cacheMiddleware(600),
  ProductController.getProductById
);

router.get('/:id/recommendations',
  authenticate,
  ProductController.getProductRecommendations
);

module.exports = router;