const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
const PORT = 5000;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false
}));
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'https://images.unsplash.com', 'https://picsum.photos', 'https://via.placeholder.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(compression());
app.use(express.json());

// Add headers for image loading
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Sample data with real product images
const productImages = {
  'Electronics': [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop'
  ],
  'Fashion': [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=300&h=300&fit=crop'
  ],
  'Home & Kitchen': [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop'
  ],
  'Books': [
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=300&fit=crop'
  ],
  'Sports': [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop'
  ],
  'Beauty': [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=300&fit=crop'
  ]
};

const productNames = {
  'Electronics': [
    'Wireless Headphones', 'Smart Watch', 'Bluetooth Speaker', 'Smartphone', 'Laptop', 'Tablet', 'Camera', 'Gaming Console'
  ],
  'Fashion': [
    'Designer Sneakers', 'Casual T-Shirt', 'Denim Jacket', 'Summer Dress', 'Leather Boots', 'Sunglasses', 'Handbag', 'Wrist Watch'
  ],
  'Home & Kitchen': [
    'Coffee Maker', 'Blender', 'Air Fryer', 'Kitchen Knife Set', 'Cookware Set', 'Food Processor', 'Toaster', 'Microwave'
  ],
  'Books': [
    'Fiction Novel', 'Self-Help Book', 'Cookbook', 'Biography', 'Science Fiction', 'Mystery Thriller', 'Educational Guide', 'Art Book'
  ],
  'Sports': [
    'Running Shoes', 'Yoga Mat', 'Fitness Tracker', 'Dumbbells', 'Tennis Racket', 'Basketball', 'Cycling Helmet', 'Workout Gear'
  ],
  'Beauty': [
    'Skincare Set', 'Makeup Palette', 'Hair Dryer', 'Perfume', 'Face Cream', 'Lipstick', 'Foundation', 'Beauty Tools'
  ]
};

const categories = ['Electronics', 'Fashion', 'Home & Kitchen', 'Books', 'Sports', 'Beauty'];

const products = Array.from({length: 50}, (_, i) => {
  const category = categories[i % categories.length];
  const imageIndex = Math.floor(i / categories.length) % productImages[category].length;
  const nameIndex = Math.floor(i / categories.length) % productNames[category].length;
  
  const basePrice = Math.floor(Math.random() * 4000) + 1000;
  const originalPrice = basePrice + Math.floor(Math.random() * 2000) + 500;
  
  return {
    id: String(i + 1),
    name: productNames[category][nameIndex],
    price: basePrice,
    originalPrice: originalPrice,
    image: productImages[category][imageIndex],
    images: [{ url: productImages[category][imageIndex] }], // Array with url property for compatibility
    rating: (Math.random() * 2 + 3).toFixed(1),
    reviews: Math.floor(Math.random() * 5000) + 100,
    inStock: Math.random() > 0.2,
    prime: Math.random() > 0.3,
    category: category,
    featured: Math.random() > 0.7,
    description: `High-quality ${productNames[category][nameIndex].toLowerCase()} with excellent features and great value for money.`,
    brand: ['Amazon', 'Samsung', 'Apple', 'Sony', 'Nike', 'Adidas'][Math.floor(Math.random() * 6)]
  };
});

const categoriesData = [
  { id: '1', name: 'Electronics', slug: 'electronics', icon: '📱' },
  { id: '2', name: 'Fashion', slug: 'fashion', icon: '👕' },
  { id: '3', name: 'Home & Kitchen', slug: 'home-kitchen', icon: '🏠' },
  { id: '4', name: 'Books', slug: 'books', icon: '📚' },
  { id: '5', name: 'Sports', slug: 'sports', icon: '⚽' },
  { id: '6', name: 'Beauty', slug: 'beauty', icon: '💄' }
];

// API endpoints
app.get('/api/products', (req, res) => {
  const { 
    page = 1, 
    limit = 20, 
    minPrice, 
    maxPrice, 
    sort, 
    category, 
    featured 
  } = req.query;
  
  let filtered = [...products];
  
  // Apply filters
  if (minPrice) filtered = filtered.filter(p => p.price >= Number(minPrice));
  if (maxPrice) filtered = filtered.filter(p => p.price <= Number(maxPrice));
  if (category) filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  if (featured === 'true') filtered = filtered.filter(p => p.featured);
  
  // Apply sorting
  if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
  else if (sort === 'name-asc') filtered.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === 'name-desc') filtered.sort((a, b) => b.name.localeCompare(a.name));
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedProducts = filtered.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: paginatedProducts,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filtered.length,
      pages: Math.ceil(filtered.length / limit)
    }
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (product) {
    res.json({ success: true, data: product });
  } else {
    res.status(404).json({ success: false, message: 'Product not found' });
  }
});

app.get('/api/categories', (req, res) => {
  res.json({ success: true, data: categoriesData });
});

app.get('/api/deals', (req, res) => {
  const deals = products
    .slice(0, 8)
    .map(p => ({
      ...p, 
      discount: Math.floor(Math.random() * 50) + 10
    }));
  res.json({ success: true, data: deals });
});

app.get('/api/recommendations', (req, res) => {
  const recommendations = products
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);
  res.json({ success: true, data: recommendations });
});

// Cart endpoints (simple in-memory storage)
let cart = [];

app.get('/api/cart', (req, res) => {
  res.json({ success: true, data: cart });
});

app.post('/api/cart/add', (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  
  const existingItem = cart.find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: Date.now().toString(),
      productId,
      product,
      quantity
    });
  }
  
  res.json({ success: true, message: 'Item added to cart', data: cart });
});

app.put('/api/cart/items/:id', (req, res) => {
  const { quantity } = req.body;
  const item = cart.find(item => item.id === req.params.id);
  
  if (item) {
    item.quantity = quantity;
    res.json({ success: true, message: 'Cart updated', data: cart });
  } else {
    res.status(404).json({ success: false, message: 'Cart item not found' });
  }
});

app.delete('/api/cart/items/:id', (req, res) => {
  cart = cart.filter(item => item.id !== req.params.id);
  res.json({ success: true, message: 'Item removed from cart', data: cart });
});

app.delete('/api/cart/clear', (req, res) => {
  cart = [];
  res.json({ success: true, message: 'Cart cleared', data: cart });
});

// Image proxy endpoint (fallback)
app.get('/api/image-proxy', (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'URL parameter required' });
  }
  
  // Simple redirect to the image URL with proper headers
  res.redirect(url);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Main API Server',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`✅ Main API Server running on http://localhost:${PORT}`);
  console.log(`🛍️  Products API: http://localhost:${PORT}/api/products`);
  console.log(`📦 Categories API: http://localhost:${PORT}/api/categories`);
  console.log(`🛒 Cart API: http://localhost:${PORT}/api/cart`);
});

module.exports = app;