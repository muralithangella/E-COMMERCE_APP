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
  origin: ['http://localhost:3000', 'http://localhost:4001', 'http://localhost:4002', 'http://localhost:4003', 'http://localhost:4004', 'http://localhost:4005'],
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

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

// Auth service proxy
app.use('/api/auth', createProxyMiddleware({
  target: 'http://localhost:3009',
  changeOrigin: true,
  timeout: 5000,
  proxyTimeout: 5000,
  onError: (err, req, res) => {
    console.error('Auth proxy error:', err.message);
    if (!res.headersSent) {
      res.status(503).json({ message: 'Auth service unavailable' });
    }
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying to: http://localhost:3009${req.url}`);
  }
}));

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

app.post('/api/cart/add', (req, res) => {
  console.log('Cart add request:', req.body);
  const { productId, quantity = 1, name, price, image } = req.body;
  
  const existingItem = cartItems.find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cartItems.push({ 
      productId, 
      quantity, 
      name: name || 'Unknown Product',
      price: parseFloat(price) || 0,
      image: image || 'https://via.placeholder.com/300x200',
      addedAt: new Date() 
    });
  }
  
  res.json({ 
    success: true, 
    message: 'Product added to cart successfully',
    cartItems: cartItems.length
  });
});

app.get('/api/cart', (req, res) => {
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  res.json({ 
    items: cartItems,
    totalPrice,
    totalItems,
    total: totalItems
  });
});

app.delete('/api/cart/clear', (req, res) => {
  cartItems.splice(0, cartItems.length);
  res.json({ success: true, message: 'Cart cleared', items: [] });
});

app.delete('/api/cart/:productId', (req, res) => {
  const { productId } = req.params;
  cartItems = cartItems.filter(item => item.productId !== productId);
  res.json({ success: true, items: cartItems });
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