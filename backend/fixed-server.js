require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 E-COMMERCE API SERVER - Fixed Version');

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

// Users (working format)
const users = [
  { email: 'admin@example.com', password: 'admin123', name: 'Admin', id: '1' },
  { email: 'test@example.com', password: 'test123', name: 'Test User', id: '2' }
];

// Products with proper data
const products = [
  {
    _id: '1', id: '1', name: 'Samsung Galaxy S24 Ultra 5G (Titanium Black, 12GB, 256GB Storage)',
    price: 129999, originalPrice: 149999, discount: 13, category: 'Mobiles',
    image: 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Samsung+Galaxy+S24',
    rating: 4.5, reviews: 1847, inStock: true, prime: true, freeDelivery: true,
    description: '200MP Camera, S Pen, 5000mAh Battery, Snapdragon 8 Gen 3'
  },
  {
    _id: '2', id: '2', name: 'iPhone 15 Pro Max (Natural Titanium, 256GB)',
    price: 159900, originalPrice: null, discount: 0, category: 'Mobiles',
    image: 'https://via.placeholder.com/300x200/000000/FFFFFF?text=iPhone+15+Pro',
    rating: 4.7, reviews: 2156, inStock: true, prime: true, freeDelivery: true,
    description: 'A17 Pro chip, 48MP Main camera, Action button, USB-C'
  },
  {
    _id: '3', id: '3', name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    price: 29990, originalPrice: 34990, discount: 14, category: 'Electronics',
    image: 'https://via.placeholder.com/300x200/2C3E50/FFFFFF?text=Sony+Headphones',
    rating: 4.6, reviews: 892, inStock: true, prime: true, freeDelivery: true,
    description: '30hr battery, Quick Charge, Premium Sound Quality'
  },
  {
    _id: '4', id: '4', name: 'MacBook Air M2 Chip (13-inch, 8GB RAM, 256GB SSD)',
    price: 114900, originalPrice: 119900, discount: 4, category: 'Electronics',
    image: 'https://via.placeholder.com/300x200/95A5A6/FFFFFF?text=MacBook+Air',
    rating: 4.8, reviews: 892, inStock: true, prime: true, freeDelivery: true,
    description: 'M2 chip, 18-hour battery, Liquid Retina display'
  },
  {
    _id: '5', id: '5', name: 'Levi\'s Men\'s 511 Slim Jeans',
    price: 2999, originalPrice: 4999, discount: 40, category: 'Fashion',
    image: 'https://via.placeholder.com/300x200/3498DB/FFFFFF?text=Levis+Jeans',
    rating: 4.3, reviews: 567, inStock: true, prime: true, freeDelivery: true,
    description: 'Slim fit jeans with stretch, Dark wash, Classic 5-pocket styling'
  },
  {
    _id: '6', id: '6', name: 'Prestige Deluxe Alpha Pressure Cooker, 6.5 Litres',
    price: 2499, originalPrice: 3995, discount: 37, category: 'Home & Kitchen',
    image: 'https://via.placeholder.com/300x200/F39C12/FFFFFF?text=Pressure+Cooker',
    rating: 4.4, reviews: 1234, inStock: true, prime: true, freeDelivery: true,
    description: 'Outer lid pressure cooker, Stainless steel body, Induction compatible'
  },
  {
    _id: '7', id: '7', name: 'Nike Air Max 270 Running Shoes',
    price: 7999, originalPrice: 12995, discount: 38, category: 'Fashion',
    image: 'https://via.placeholder.com/300x200/E67E22/FFFFFF?text=Nike+Air+Max',
    rating: 4.4, reviews: 3421, inStock: true, prime: true, freeDelivery: true,
    description: 'Max Air unit, Breathable mesh upper, Comfortable cushioning'
  },
  {
    _id: '8', id: '8', name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker',
    price: 8990, originalPrice: 12900, discount: 30, category: 'Home & Kitchen',
    image: 'https://via.placeholder.com/300x200/8E44AD/FFFFFF?text=Instant+Pot',
    rating: 4.5, reviews: 1567, inStock: true, prime: true, freeDelivery: true,
    description: '7-in-1 functionality, Smart programs, Stainless steel cooking pot'
  }
];

const categories = [
  {
    _id: '1', id: '1', name: 'Electronics',
    image: 'https://via.placeholder.com/400x200/2C3E50/FFFFFF?text=Electronics',
    description: 'Mobiles, Laptops, Cameras & more'
  },
  {
    _id: '2', id: '2', name: 'Fashion',
    image: 'https://via.placeholder.com/400x200/E74C3C/FFFFFF?text=Fashion',
    description: 'Clothing, Footwear & Accessories'
  },
  {
    _id: '3', id: '3', name: 'Home & Kitchen',
    image: 'https://via.placeholder.com/400x200/27AE60/FFFFFF?text=Home+Kitchen',
    description: 'Home Decor, Kitchen & Dining'
  },
  {
    _id: '4', id: '4', name: 'Books',
    image: 'https://via.placeholder.com/400x200/F39C12/FFFFFF?text=Books',
    description: 'Books, eBooks & Audiobooks'
  }
];

// In-memory cart storage
let cartItems = [];

// AUTH ROUTES (working format)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
      token: 'test-token'
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Name, email and password are required' 
    });
  }
  
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'User with this email already exists'
    });
  }
  
  const newUser = {
    id: String(users.length + 1),
    name,
    email,
    password
  };
  users.push(newUser);
  
  res.json({
    success: true,
    user: { id: newUser.id, name: newUser.name, email: newUser.email },
    token: 'test-token'
  });
});

// PRODUCT ROUTES
app.get('/api/products', (req, res) => {
  const { category, search, page = 1, limit = 20 } = req.query;
  let filteredProducts = [...products];
  
  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter(p => 
      p.category.toLowerCase().includes(category.toLowerCase())
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

// DEALS ROUTES
app.get('/api/deals', (req, res) => {
  const deals = products
    .filter(p => p.discount > 20)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 6);
  res.json({ 
    success: true, 
    data: deals 
  });
});

// RECOMMENDATIONS ROUTES
app.get('/api/recommendations', (req, res) => {
  const recommendations = products
    .filter(p => p.rating >= 4.0 || p.reviews > 1000)
    .sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews))
    .slice(0, 8);
  res.json({ 
    success: true, 
    data: recommendations 
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
      image: product.image,
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

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'Fixed E-commerce API is working!',
    timestamp: new Date().toISOString(),
    endpoints: {
      products: '/api/products',
      categories: '/api/categories',
      cart: '/api/cart',
      deals: '/api/deals',
      recommendations: '/api/recommendations'
    }
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
  console.log(`✅ Fixed Server running on http://localhost:${PORT}`);
  console.log(`📍 API Test: http://localhost:${PORT}/api/test`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`🛍️  Products: http://localhost:${PORT}/api/products`);
  console.log(`🛒 Cart: http://localhost:${PORT}/api/cart`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth/login`);
  console.log('✅ Login: admin@example.com / admin123');
});

module.exports = app;