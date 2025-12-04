const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

const app = express();
const PORT = process.env.GATEWAY_PORT || 5000;

// Performance Middleware
app.use(compression());
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002', 'http://localhost:4001', 'http://localhost:4002', 'http://localhost:4003', 'http://localhost:4004', 'http://localhost:4005'],
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Request timeout (only for non-proxy routes)
app.use((req, res, next) => {
  if (!req.url.startsWith('/api/')) {
    res.setTimeout(30000, () => {
      res.status(408).json({ error: 'Request timeout' });
    });
  }
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000
});
app.use(limiter);

// Service routes
const services = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3009',
  products: process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3002',
  cart: process.env.CART_SERVICE_URL || 'http://localhost:3003',
  orders: process.env.ORDERS_SERVICE_URL || 'http://localhost:3008',
  payments: process.env.PAYMENTS_SERVICE_URL || 'http://localhost:3004',
  inventory: process.env.INVENTORY_SERVICE_URL || 'http://localhost:3005',
  notifications: process.env.NOTIFICATIONS_SERVICE_URL || 'http://localhost:3006',
  users: process.env.USERS_SERVICE_URL || 'http://localhost:3007'
};

// Direct service routes (for frontend compatibility)
app.use('/auth', createProxyMiddleware({
  target: services.auth,
  changeOrigin: true,
  pathRewrite: {
    '^/auth': '/api/auth'
  }
}));

// Categories route (handled by products service)
app.use('/api/categories', createProxyMiddleware({
  target: services.products,
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Proxy error for categories:', err.message);
    res.status(503).json({ 
      message: 'Categories service unavailable',
      error: 'Service temporarily unavailable'
    });
  }
}));

// Direct auth implementation (bypass proxy)
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://muralithangella_db_user:sW6i6ceY2q1W0oTc@fullstack.qnyvzwj.mongodb.net/ecommerce');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: 'user' },
  isActive: { type: Boolean, default: true }
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, isActive: true }).select('+password');
    
    if (!user || !await user.comparePassword(password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '24h' });
    res.json({ 
      message: 'Login successful',
      user: { id: user._id, email: user.email, name: user.name },
      accessToken: token
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

// Other API routes
['products', 'orders', 'payments', 'inventory', 'notifications', 'users'].forEach(service => {
  app.use(`/api/${service}`, createProxyMiddleware({
    target: services[service],
    changeOrigin: true,
    timeout: 5000,
    pathRewrite: {
      [`^/api/${service}`]: `/api/${service}`
    },
    onError: (err, req, res) => {
      console.error(`Proxy error for ${service}:`, err.message);
      if (!res.headersSent) {
        res.status(503).json({ message: `${service} service unavailable` });
      }
    }
  }));
});

// Test auth service connection
app.post('/test-auth', async (req, res) => {
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Direct auth test
app.post('/api/auth/test-direct', (req, res) => {
  res.json({ message: 'Gateway auth test working', body: req.body });
});

// Simple cart implementation (no auth required)
let cartItems = [];
console.log('Gateway started - cart initialized as empty array');

// Debug function to log cart state
const logCartState = () => {
  console.log('Current cart items:', cartItems.map(item => ({ id: item.productId, name: item.name, qty: item.quantity })));
};

// Test endpoint to debug request body
app.post('/api/test', (req, res) => {
  console.log('TEST ENDPOINT - Raw body:', req.body);
  console.log('TEST ENDPOINT - Headers:', req.headers);
  res.json({ received: req.body, success: true });
});

app.post('/api/cart/add', (req, res) => {
  const { productId, quantity = 1, name, price, image } = req.body;
  
  const existingItemIndex = cartItems.findIndex(item => item.productId === productId);
  
  if (existingItemIndex !== -1) {
    cartItems[existingItemIndex].quantity += 1;
  } else {
    cartItems.push({ 
      productId,
      quantity: 1,
      name,
      price: parseFloat(price),
      image: image || 'https://via.placeholder.com/300x200'
    });
  }
  
  res.json({ success: true, message: 'Added to cart', items: cartItems });
});

app.get('/api/cart', (req, res) => {
  logCartState();
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  res.json({ 
    items: cartItems,
    totalPrice,
    totalItems,
    total: totalItems
  });
});

app.get('/api/cart/debug', (req, res) => {
  res.json({
    cartItems: cartItems.map(item => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    })),
    uniqueProducts: [...new Set(cartItems.map(item => item.productId))].length,
    totalItems: cartItems.length
  });
});

app.delete('/api/cart/clear', (req, res) => {
  cartItems.length = 0;
  console.log('Cart cleared, length:', cartItems.length);
  res.json({ success: true, message: 'Cart cleared', items: [] });
});

app.delete('/api/cart/:productId', (req, res) => {
  const { productId } = req.params;
  cartItems = cartItems.filter(item => item.productId !== productId);
  res.json({ success: true, items: cartItems });
});

app.delete('/api/cart/cleanup', (req, res) => {
  // Remove duplicates and invalid items
  const seen = new Set();
  cartItems = cartItems.filter(item => {
    if (!item.productId || item.productId === 'undefined' || seen.has(item.productId)) {
      return false;
    }
    seen.add(item.productId);
    return true;
  });
  res.json({ success: true, message: 'Duplicates and invalid items removed', items: cartItems });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'api-gateway',
    services: Object.keys(services)
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log('Registered services:', Object.keys(services));
});

module.exports = app;