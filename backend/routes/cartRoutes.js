const express = require('express');
const Cart = require('../models/Cart');
const { authenticate } = require('../middleware');

const router = express.Router();

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product', 'name price images inventory.quantity');
    res.json(cart || { items: [], totalItems: 0, totalPrice: 0 });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cart', error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, variant } = req.body;
    
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }
    
    const existingItem = cart.items.find(item => 
      item.product.toString() === productId && 
      JSON.stringify(item.variant) === JSON.stringify(variant)
    );
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, variant });
    }
    
    await cart.save();
    await cart.populate('items.product', 'name price images');
    
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: 'Failed to add to cart', error: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    if (quantity <= 0) {
      item.remove();
    } else {
      item.quantity = quantity;
    }
    
    await cart.save();
    await cart.populate('items.product', 'name price images');
    
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update cart item', error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    cart.items.id(req.params.itemId).remove();
    await cart.save();
    
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove item', error: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [], totalItems: 0, totalPrice: 0 });
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to clear cart', error: error.message });
  }
};

router.get('/', authenticate, getCart);
router.post('/add', authenticate, addToCart);
router.put('/items/:itemId', authenticate, updateCartItem);
router.delete('/items/:itemId', authenticate, removeFromCart);
router.delete('/clear', authenticate, clearCart);

module.exports = router;