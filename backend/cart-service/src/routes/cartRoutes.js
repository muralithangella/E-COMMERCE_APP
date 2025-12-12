const express = require('express');
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

const router = express.Router();

// Get cart
router.get('/', auth, async (req, res) => {
  try {
    const query = req.userId ? { userId: req.userId } : { sessionId: req.sessionId };
    let cart = await Cart.findOne(query);
    
    if (!cart) {
      cart = new Cart({
        userId: req.userId || 'guest',
        sessionId: req.sessionId,
        items: [],
        total: 0,
        count: 0
      });
      await cart.save();
    }
    
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, name, price, quantity = 1, image } = req.body;
    const query = req.userId ? { userId: req.userId } : { sessionId: req.sessionId };
    
    let cart = await Cart.findOne(query);
    if (!cart) {
      cart = new Cart({
        userId: req.userId || 'guest',
        sessionId: req.sessionId,
        items: []
      });
    }
    
    const existingItem = cart.items.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, name, price, quantity, image });
    }
    
    cart.calculateTotals();
    await cart.save();
    
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update item quantity
router.put('/items/:id', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const query = req.userId ? { userId: req.userId } : { sessionId: req.sessionId };
    
    const cart = await Cart.findOne(query);
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
    
    const item = cart.items.find(item => item.productId === req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    
    if (quantity <= 0) {
      cart.items = cart.items.filter(item => item.productId !== req.params.id);
    } else {
      item.quantity = quantity;
    }
    
    cart.calculateTotals();
    await cart.save();
    
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Remove item from cart
router.delete('/items/:id', auth, async (req, res) => {
  try {
    const query = req.userId ? { userId: req.userId } : { sessionId: req.sessionId };
    
    const cart = await Cart.findOne(query);
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
    
    cart.items = cart.items.filter(item => item.productId !== req.params.id);
    cart.calculateTotals();
    await cart.save();
    
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Clear cart
router.delete('/clear', auth, async (req, res) => {
  try {
    const query = req.userId ? { userId: req.userId } : { sessionId: req.sessionId };
    
    const cart = await Cart.findOne(query);
    if (cart) {
      cart.items = [];
      cart.calculateTotals();
      await cart.save();
    }
    
    res.json({ success: true, data: cart || { items: [], total: 0, count: 0 } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;