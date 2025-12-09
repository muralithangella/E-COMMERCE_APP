const express = require('express');
const { getProducts, getProduct, getCategories, getDeals, getRecommendations, uploadProductImages, deleteProductImage, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { upload } = require('../utils/imageUpload');

const router = express.Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProduct);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.post('/:id/images', upload.array('images', 5), uploadProductImages);
router.delete('/:id/images/:imageId', deleteProductImage);

module.exports = router;
