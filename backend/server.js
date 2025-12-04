require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 E-COMMERCE API SERVER - Clean Version with Mock Data');

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(limiter);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Mock data
const products = [
  {
    _id: '1',
    id: '1',
    name: 'Wireless Headphones',
    price: 99.99,
    originalPrice: 149.99,
    discount: 33,
    description: 'High-quality wireless headphones with noise cancellation',
    image: 'https://picsum.photos/300/200?random=1',
    images: ['https://picsum.photos/300/200?random=1'],
    category: 'Electronics',
    rating: 4.5,
    reviews: 128,
    inStock: true,
    inventory: { trackQuantity: false, quantity: 100 }
  },
  {
    _id: '2',
    id: '2',
    name: 'Smart Watch',
    price: 199.99,
    originalPrice: 299.99,
    discount: 25,
    description: 'Feature-rich smartwatch with health tracking',
    image: 'https://picsum.photos/300/200?random=2',
    images: ['https://picsum.photos/300/200?random=2'],
    category: 'Electronics',
    rating: 4.8,
    reviews: 89,
    inStock: true
  },
  {
    _id: '3',
    id: '3',
    name: 'Laptop Backpack',
    price: 49.99,
    originalPrice: 79.99,
    discount: 37,
    description: 'Durable laptop backpack with multiple compartments',
    image: 'https://picsum.photos/300/200?random=3',
    images: ['https://picsum.photos/300/200?random=3'],
    category: 'Accessories',
    rating: 4.2,
    reviews: 45,
    inStock: true
  },
  {
    _id: '4',
    id: '4',
    name: 'Gaming Mouse',
    price: 79.99,
    originalPrice: 119.99,
    discount: 33,
    description: 'High-precision gaming mouse with RGB lighting',
    image: 'https://picsum.photos/300/200?random=4',
    images: ['https://picsum.photos/300/200?random=4'],
    category: 'Electronics',
    rating: 4.6,
    reviews: 67,
    inStock: true
  },
  {
    _id: '5',
    id: '5',
    name: 'Coffee Maker',
    price: 129.99,
    originalPrice: 179.99,
    discount: 28,
    description: 'Automatic drip coffee maker with timer',
    image: 'https://picsum.photos/300/200?random=5',
    images: ['https://picsum.photos/300/200?random=5'],
    category: 'Home',
    rating: 4.3,
    reviews: 92,
    inStock: true
  },
  {
    _id: '6',
    id: '6',
    name: 'Bluetooth Speaker',
    price: 59.99,
    originalPrice: 89.99,
    discount: 33,
    description: 'Portable wireless speaker with deep bass',
    image: 'https://picsum.photos/300/200?random=6',
    images: ['https://picsum.photos/300/200?random=6'],
    category: 'Electronics',
    rating: 4.4,
    reviews: 156,
    inStock: true
  }
];

const categories = [
  {
    _id: '1',
    id: '1',
    name: 'Electronics',
    image: 'https://picsum.photos/200/150?random=10',
    description: 'Latest electronic gadgets and devices'
  },
  {
    _id: '2',
    id: '2',
    name: 'Home',
    image: 'https://picsum.photos/200/150?random=11',
    description: 'Home appliances and essentials'
  },
  {
    _id: '3',
    id: '3',
    name: 'Accessories',
    image: 'https://picsum.photos/200/150?random=12',
    description: 'Fashion and tech accessories'
  },
  {
    _id: '4',
    id: '4',
    name: 'Sports',
    image: 'https://picsum.photos/200/150?random=13',
    description: 'Sports and fitness equipment'
  }
];

// Mock users
const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', password: 'password123' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', password: 'password456' },
  { id: '3', name: 'Test User', email: 'test@example.com', password: 'test123' }
];

// In-memory cart storage (reset to empty)
let cartItems = [];

// AUTH ROUTES
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login attempt:', { email });
  
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email and password are required' 
    });
  }
  
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }
  
  res.json({
    success: true,
    data: {
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        role: 'user'
      },
      accessToken: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now()
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  console.log('Registration attempt:', { name, email });
  
  if (!name || !email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Name, email and password are required' 
    });
  }
  
  const existingUser = mockUsers.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'User with this email already exists'
    });
  }
  
  const newUser = {
    id: String(mockUsers.length + 1),
    name,
    email,
    password
  };
  mockUsers.push(newUser);
  
  res.json({
    success: true,
    data: {
      user: { 
        id: newUser.id, 
        name: newUser.name, 
        email: newUser.email,
        role: 'user'
      },
      accessToken: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now()
    }
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// PRODUCT ROUTES
app.get('/api/products', (req, res) => {
  const { category, search, page = 1, limit = 10 } = req.query;
  let filteredProducts = [...products];
  
  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  if (search) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: paginatedProducts,
    products: paginatedProducts,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredProducts.length,
      pages: Math.ceil(filteredProducts.length / limit)
    }
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id || p._id === req.params.id);
  if (product) {
    res.json({ success: true, data: product });
  } else {
    res.status(404).json({ success: false, message: 'Product not found' });
  }
});

// CATEGORY ROUTES
app.get('/api/categories', (req, res) => {
  res.json({ 
    success: true, 
    data: categories, 
    categories 
  });
});

// CART ROUTES
app.get('/api/cart', (req, res) => {
  const total = cartItems.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);
  res.json({ 
    success: true,
    data: {
      items: cartItems,
      total: parseFloat(total.toFixed(2)),
      count: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    }
  });
});

app.post('/api/cart/add', (req, res) => {
  const { productId, quantity = 1 } = req.body;
  
  if (!productId) {
    return res.status(400).json({ 
      success: false, 
      message: 'Product ID is required' 
    });
  }
  
  const product = products.find(p => p.id === productId || p._id === productId);
  
  if (!product) {
    return res.status(404).json({ 
      success: false, 
      message: 'Product not found' 
    });
  }
  
  const existingItem = cartItems.find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += parseInt(quantity);
  } else {
    cartItems.push({
      id: Date.now().toString(),
      productId,
      quantity: parseInt(quantity),
      name: product.name,
      price: product.price,
      image: product.image || product.images?.[0] || 'https://picsum.photos/300/200?random=1',
      category: product.category
    });
  }
  
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  res.json({ 
    success: true,
    message: 'Product added to cart',
    data: {
      items: cartItems,
      total: parseFloat(total.toFixed(2)),
      count: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    }
  });
});

app.put('/api/cart/items/:id', (req, res) => {
  const { quantity } = req.body;
  const itemId = req.params.id;
  
  const item = cartItems.find(item => item.id === itemId || item.productId === itemId);
  
  if (!item) {
    return res.status(404).json({ 
      success: false, 
      message: 'Cart item not found' 
    });
  }
  
  if (quantity <= 0) {
    cartItems = cartItems.filter(item => item.id !== itemId && item.productId !== itemId);
  } else {
    item.quantity = parseInt(quantity);
  }
  
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  res.json({ 
    success: true,
    message: 'Cart updated',
    data: {
      items: cartItems,
      total: parseFloat(total.toFixed(2)),
      count: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    }
  });
});

app.delete('/api/cart/items/:id', (req, res) => {
  const itemId = req.params.id;
  const initialLength = cartItems.length;
  
  cartItems = cartItems.filter(item => item.id !== itemId && item.productId !== itemId);
  
  if (cartItems.length === initialLength) {
    return res.status(404).json({ 
      success: false, 
      message: 'Cart item not found' 
    });
  }
  
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  res.json({ 
    success: true,
    message: 'Item removed from cart',
    data: {
      items: cartItems,
      total: parseFloat(total.toFixed(2)),
      count: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    }
  });
});

app.delete('/api/cart/clear', (req, res) => {
  cartItems = [];
  res.json({ 
    success: true,
    message: 'Cart cleared',
    data: {
      items: [],
      total: 0,
      count: 0
    }
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'E-commerce API is working!',
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Endpoint not found',
    path: req.path
  });
});

app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    success: false,
    message: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📍 API Test: http://localhost:${PORT}/api/test`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`🛍️  Products: http://localhost:${PORT}/api/products`);
  console.log(`🛒 Cart: http://localhost:${PORT}/api/cart`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth/login`);
  console.log('🧹 Cart cleared - ready for fresh data');
});

module.exports = app;