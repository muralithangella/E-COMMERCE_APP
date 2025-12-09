const express = require('express');
const router = express.Router();
const {
  getWishlists,
  getWishlist,
  createWishlist,
  addItem,
  removeItem,
  updateWishlist,
  deleteWishlist,
  generateShareToken
} = require('../controllers/wishlistController');

// Routes
router.get('/', getWishlists);
router.get('/:wishlistId', getWishlist);
router.post('/', createWishlist);
router.post('/:wishlistId/items', addItem);
router.delete('/:wishlistId/items/:itemId', removeItem);
router.put('/:wishlistId', updateWishlist);
router.delete('/:wishlistId', deleteWishlist);
router.post('/:wishlistId/share', generateShareToken);

module.exports = router;

