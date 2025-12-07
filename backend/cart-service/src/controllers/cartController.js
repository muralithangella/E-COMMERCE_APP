const Cart = require('../models/cart');
const Product = require('../../product-service/src/models/product');

exports.getCart = async (req, res) => {
  try {
    const userId = req.headers['user-id'] || 'guest';
    let cart = await Cart.findOne({ userId }).populate('items.productId');
    
    if (!cart) {
      cart = { items: [], total: 0, count: 0 };
    } else {
      cart.total = cart.items.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0);
      cart.count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    }
    
    res.json({ success: true, data: cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch cart', error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.headers['user-id'] || 'guest';
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    
    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    
    await cart.save();
    await cart.populate('items.productId');
    
    const total = cart.items.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0);
    const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    
    res.json({ 
      success: true, 
      message: 'Item added to cart',
      data: { items: cart.items, total, count }
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(400).json({ success: false, message: 'Failed to add to cart', error: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.headers['user-id'] || 'guest';
    
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    
    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }
    
    if (quantity <= 0) {
      cart.items.pull(itemId);
    } else {
      item.quantity = quantity;
    }
    
    await cart.save();
    await cart.populate('items.productId');
    
    const total = cart.items.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0);
    const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    
    res.json({ 
      success: true, 
      data: { items: cart.items, total, count }
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(400).json({ success: false, message: 'Failed to update cart item', error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.headers['user-id'] || 'guest';
    
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    
    cart.items.pull(itemId);
    await cart.save();
    await cart.populate('items.productId');
    
    const total = cart.items.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0);
    const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    
    res.json({ 
      success: true, 
      data: { items: cart.items, total, count }
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(400).json({ success: false, message: 'Failed to remove from cart', error: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.headers['user-id'] || 'guest';
    
    await Cart.findOneAndUpdate(
      { userId },
      { items: [] },
      { upsert: true }
    );
    
    res.json({ 
      success: true, 
      message: 'Cart cleared',
      data: { items: [], total: 0, count: 0 }
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ success: false, message: 'Failed to clear cart', error: error.message });
  }
};
