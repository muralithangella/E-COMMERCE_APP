const express = require('express');
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cartController');

const router = express.Router();

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/items/:itemId', updateCartItem);
router.delete('/items/:itemId', removeFromCart);
router.delete('/clear', clearCart);

module.exports = router;
