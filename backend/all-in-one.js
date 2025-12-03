require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Simple in-memory user
const testUser = {
  email: 'admin@example.com',
  password: 'admin123',
  name: 'Admin User',
  id: 'admin-123'
};

// Sample products data
const products = [
  // Electronics
  { 
    id: 1, 
    name: 'Laptop', 
    price: 999.99,
    originalPrice: 1299.99,
    discount: 23,
    category: 'Electronics', 
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop', 
    description: 'High-performance laptop',
    rating: 4,
    reviews: 125,
    inStock: true
  },
  { 
    id: 2, 
    name: 'Smartphone', 
    price: 699.99,
    originalPrice: 899.99,
    discount: 22,
    category: 'Electronics', 
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop', 
    description: 'Latest smartphone',
    rating: 4,
    reviews: 89,
    inStock: true
  },
  { 
    id: 3, 
    name: 'Headphones', 
    price: 199.99,
    originalPrice: 299.99,
    discount: 33,
    category: 'Electronics', 
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop', 
    description: 'Wireless headphones',
    rating: 4,
    reviews: 67,
    inStock: true
  },
  {
    id: 6,
    name: 'Tablet',
    price: 399.99,
    originalPrice: 499.99,
    discount: 20,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=200&fit=crop',
    description: '10-inch tablet with high resolution',
    rating: 4,
    reviews: 78,
    inStock: true
  },
  {
    id: 7,
    name: 'Smart Watch',
    price: 299.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop',
    description: 'Fitness tracking smartwatch',
    rating: 4,
    reviews: 156,
    inStock: true
  },
  // Clothing
  { 
    id: 4, 
    name: 'T-Shirt', 
    price: 29.99, 
    category: 'Clothing', 
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=200&fit=crop', 
    description: 'Cotton t-shirt',
    rating: 4,
    reviews: 45,
    inStock: true
  },
  { 
    id: 5, 
    name: 'Jeans', 
    price: 79.99,
    originalPrice: 99.99,
    discount: 20,
    category: 'Clothing', 
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=200&fit=crop', 
    description: 'Denim jeans',
    rating: 4,
    reviews: 32,
    inStock: true
  },
  {
    id: 8,
    name: 'Hoodie',
    price: 59.99,
    originalPrice: 79.99,
    discount: 25,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1556821840-3a9c6dcb0e78?w=300&h=200&fit=crop',
    description: 'Comfortable cotton hoodie',
    rating: 4,
    reviews: 67,
    inStock: true
  },
  {
    id: 9,
    name: 'Sneakers',
    price: 89.99,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=200&fit=crop',
    description: 'Comfortable running sneakers',
    rating: 4,
    reviews: 234,
    inStock: true
  },
  // Books
  {
    id: 10,
    name: 'JavaScript Guide',
    price: 39.99,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=200&fit=crop',
    description: 'Complete guide to JavaScript programming',
    rating: 5,
    reviews: 89,
    inStock: true
  },
  {
    id: 11,
    name: 'React Handbook',
    price: 49.99,
    originalPrice: 59.99,
    discount: 17,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
    description: 'Learn React from basics to advanced',
    rating: 5,
    reviews: 156,
    inStock: true
  },
  {
    id: 12,
    name: 'Design Patterns',
    price: 44.99,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
    description: 'Software design patterns explained',
    rating: 4,
    reviews: 78,
    inStock: true
  },
  // Home & Garden
  {
    id: 13,
    name: 'Coffee Maker',
    price: 89.99,
    originalPrice: 119.99,
    discount: 25,
    category: 'Home Garden',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop',
    description: 'Automatic drip coffee maker',
    rating: 4,
    reviews: 145,
    inStock: true
  },
  {
    id: 14,
    name: 'Plant Pot',
    price: 24.99,
    category: 'Home Garden',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=300&h=200&fit=crop',
    description: 'Ceramic plant pot with drainage',
    rating: 4,
    reviews: 67,
    inStock: true
  },
  {
    id: 15,
    name: 'Table Lamp',
    price: 69.99,
    category: 'Home Garden',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=200&fit=crop',
    description: 'Modern LED table lamp',
    rating: 4,
    reviews: 89,
    inStock: true
  }
];

const categories = [
  { id: 1, name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop', productCount: 150 },
  { id: 2, name: 'Clothing', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop', productCount: 89 },
  { id: 3, name: 'Books', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop', productCount: 67 },
  { id: 4, name: 'Home Garden', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop', productCount: 45 }
];

const deals = [
  { id: 1, name: 'Gaming Laptop', originalPrice: 1299.99, salePrice: 999.99, discount: 23, image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=300&h=200&fit=crop', timeLeft: '2h 15m' },
  { id: 2, name: 'Wireless Earbuds', originalPrice: 149.99, salePrice: 89.99, discount: 40, image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=200&fit=crop', timeLeft: '4h 32m' },
  { id: 3, name: 'Smart Watch', originalPrice: 299.99, salePrice: 199.99, discount: 33, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop', timeLeft: '1h 45m' }
];

app.post('/api/auth/login', (req, res) => {
  console.log('Login request:', req.body);
  const { email, password } = req.body;
  
  if (email === testUser.email && password === testUser.password) {
    const token = jwt.sign(
      { userId: testUser.id }, 
      'fallback-secret', 
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      user: { id: testUser.id, email: testUser.email, name: testUser.name },
      token
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Products endpoints
app.get('/api/products', (req, res) => {
  const { category } = req.query;
  console.log('Products request - category filter:', JSON.stringify(category));
  console.log('Available categories:', [...new Set(products.map(p => p.category))]);
  
  let filteredProducts = products;
  
  if (category) {
    // Decode URL encoding and normalize
    const decodedCategory = decodeURIComponent(category);
    console.log('Decoded category:', JSON.stringify(decodedCategory));
    
    filteredProducts = products.filter(p => {
      const match = p.category.toLowerCase() === decodedCategory.toLowerCase();
      if (!match) {
        console.log(`No match: '${p.category}' !== '${decodedCategory}'`);
      }
      return match;
    });
    console.log(`Filtered products for category '${decodedCategory}':`, filteredProducts.length);
  }
  
  console.log('Sending products:', filteredProducts.length);
  
  res.json({ 
    products: filteredProducts, 
    total: filteredProducts.length,
    deals,
    lightningDeals: deals,
    flashDeals: deals
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

app.get('/api/categories', (req, res) => {
  console.log('Categories endpoint hit - sending:', categories.length, 'categories');
  res.json({ 
    data: categories, 
    success: true, 
    categories,
    deals,
    lightningDeals: deals,
    flashDeals: deals
  });
});

app.get('/api/deals', (req, res) => {
  console.log('Deals endpoint hit - sending:', deals.length, 'deals');
  res.json({ data: deals, success: true, deals });
});

app.get('/api/deals/lightning', (req, res) => {
  res.json({ deals });
});

// Additional endpoint variations for deals
app.get('/api/deals/flash', (req, res) => {
  console.log('Flash deals endpoint hit');
  res.json(deals);
});

app.get('/api/flash-deals', (req, res) => {
  console.log('Flash deals endpoint hit');
  res.json(deals);
});

app.get('/api/offers', (req, res) => {
  console.log('Offers endpoint hit');
  res.json(deals);
});

app.get('/api/promotions', (req, res) => {
  console.log('Promotions endpoint hit');
  res.json(deals);
});

// Additional endpoint variations
app.get('/categories', (req, res) => {
  res.json({ categories });
});

app.get('/deals', (req, res) => {
  res.json({ deals });
});

app.get('/api/featured-categories', (req, res) => {
  res.json({ categories });
});

app.get('/api/lightning-deals', (req, res) => {
  console.log('Lightning deals endpoint hit');
  res.json(deals);
});

// Home page data endpoint
app.get('/api/home', (req, res) => {
  console.log('Home endpoint hit - sending all data');
  res.json({
    categories,
    deals,
    products: products.slice(0, 8),
    lightningDeals: deals,
    featuredCategories: categories,
    banners: [
      { id: 1, title: 'Summer Sale', subtitle: 'Up to 50% off', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop' }
    ]
  });
});

// Featured products
app.get('/api/products/featured', (req, res) => {
  res.json({ products });
});

// Cart endpoints - reset on server start
let cart = [];
console.log('Cart reset on server start');

// Force clear cart on startup
cart = [];

app.get('/api/cart', (req, res) => {
  console.log('Cart requested - current items:', cart.map(item => `${item.name} (qty: ${item.quantity})`));
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  res.json({ items: cart, totalItems, totalPrice });
});

app.post('/api/cart/add', (req, res) => {
  console.log('=== ADD TO CART REQUEST ===');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  console.log('ProductId received:', req.body.productId, 'Type:', typeof req.body.productId);
  
  const { productId, quantity = 1 } = req.body;
  const product = products.find(p => p.id === parseInt(productId));
  
  console.log('Available products:', products.map(p => `${p.id}: ${p.name}`));
  console.log('Looking for product with ID:', parseInt(productId));
  console.log('Found product:', product ? `${product.id}: ${product.name}` : 'NOT FOUND');
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    console.log('EXISTING ITEM - Updating quantity from', existingItem.quantity, 'to', existingItem.quantity + quantity);
    existingItem.quantity += quantity;
  } else {
    console.log('NEW ITEM - Adding to cart:', product.name);
    cart.push({ ...product, quantity, _id: product.id });
  }
  
  console.log('Current cart contents:');
  cart.forEach((item, index) => {
    console.log(`  ${index + 1}. ${item.name} (ID: ${item.id}, Qty: ${item.quantity})`);
  });
  console.log('=== END ADD TO CART ===');
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  res.json({ items: cart, totalItems, totalPrice });
});

app.put('/api/cart/items/:id', (req, res) => {
  const { quantity } = req.body;
  const item = cart.find(item => item.id === parseInt(req.params.id));
  
  if (item) {
    item.quantity = quantity;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    res.json({ items: cart, totalItems, totalPrice });
  } else {
    res.status(404).json({ message: 'Item not found in cart' });
  }
});

app.delete('/api/cart/items/:id', (req, res) => {
  cart = cart.filter(item => item.id !== parseInt(req.params.id));
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  res.json({ items: cart, totalItems, totalPrice });
});

app.delete('/api/cart/clear', (req, res) => {
  cart = [];
  res.json({ items: [], totalItems: 0, totalPrice: 0 });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.get('/api/cart/test', (req, res) => {
  res.json({ message: 'Cart API is working', availableProducts: products.length });
});

// Catch-all for debugging
app.get('*', (req, res) => {
  console.log('Unhandled request:', req.url);
  res.status(404).json({ message: 'Endpoint not found', url: req.url });
});

app.listen(PORT, () => {
  console.log(`All-in-one server running on port ${PORT}`);
  // Clear cart on server start
  cart = [];
  console.log('Cart cleared on server start');
});