const express = require('express');
const { getProducts, getProduct, getFeaturedProducts, getDeals } = require('../controllers/productController');

const router = express.Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/deals', getDeals);
router.get('/:id', getProduct);

module.exports = router;