require('dotenv').config({ path: '../../.env' });
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PRODUCTS_SERVICE_PORT || 3002;

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4001', 'http://localhost:4002', 'http://localhost:4003', 'http://localhost:5000'],
  credentials: true
}));
app.use(express.json());

// Mock categories data
const mockCategories = [
  { _id: '1', name: 'Electronics', slug: 'electronics', description: 'Electronic devices and gadgets', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=150&fit=crop' },
  { _id: '2', name: 'Fashion', slug: 'fashion', description: 'Clothing and accessories', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=150&fit=crop' },
  { _id: '3', name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Home appliances and kitchen items', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=150&fit=crop' },
  { _id: '4', name: 'Sports', slug: 'sports', description: 'Sports equipment and gear', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=150&fit=crop' },
  { _id: '5', name: 'Books', slug: 'books', description: 'Books and educational materials', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=150&fit=crop' },
  { _id: '6', name: 'Beauty', slug: 'beauty', description: 'Beauty and personal care products', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=150&fit=crop' }
];

// Mock products data
const mockProducts = [
  {
    _id: '1',
    name: 'MacBook Pro 16-inch M3',
    description: 'Apple MacBook Pro with M3 Pro chip, 18GB RAM, 512GB SSD',
    price: 2399.99,
    originalPrice: 2599.99,
    category: 'Electronics',
    brand: 'Apple',
    rating: 4.8,
    reviewCount: 1247,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    inStock: true,
    stockCount: 15,
    freeShipping: true,
    prime: true,
    createdAt: new Date('2024-01-15')
  },
  {
    _id: '2',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise canceling headphones',
    price: 349.99,
    originalPrice: 399.99,
    category: 'Electronics',
    brand: 'Sony',
    rating: 4.6,
    reviewCount: 892,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    inStock: true,
    stockCount: 8,
    freeShipping: true,
    prime: true,
    createdAt: new Date('2024-01-10')
  },
  {
    _id: '3',
    name: 'Apple Watch Series 9',
    description: 'Advanced health monitoring and fitness tracking',
    price: 429.99,
    originalPrice: 449.99,
    category: 'Electronics',
    brand: 'Apple',
    rating: 4.7,
    reviewCount: 2156,
    image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&h=300&fit=crop',
    inStock: true,
    stockCount: 23,
    freeShipping: true,
    prime: true,
    createdAt: new Date('2024-01-08')
  },
  {
    _id: '4',
    name: 'Nike Air Max Shoes',
    description: 'Comfortable running shoes with air cushioning',
    price: 129.99,
    category: 'Fashion',
    brand: 'Nike',
    rating: 4.7,
    reviewCount: 543,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    inStock: true,
    stockCount: 30,
    freeShipping: true,
    prime: false,
    createdAt: new Date('2024-01-05')
  },
  {
    _id: '5',
    name: 'Coffee Maker',
    description: 'Programmable drip coffee maker',
    price: 79.99,
    category: 'Home & Kitchen',
    brand: 'Cuisinart',
    rating: 4.5,
    reviewCount: 321,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
    inStock: true,
    stockCount: 15,
    freeShipping: true,
    prime: false,
    createdAt: new Date('2024-01-03')
  },
  {
    _id: '6',
    name: 'The Great Gatsby',
    description: 'Classic American novel by F. Scott Fitzgerald',
    price: 12.99,
    category: 'Books',
    brand: 'Scribner',
    rating: 4.3,
    reviewCount: 1205,
    image: 'https://via.placeholder.com/400x300/9b59b6/FFFFFF?text=The+Great+Gatsby',
    inStock: true,
    stockCount: 50,
    freeShipping: false,
    prime: false,
    createdAt: new Date('2024-01-01')
  },
  {
    _id: '7',
    name: 'JavaScript: The Good Parts',
    description: 'Programming book by Douglas Crockford',
    price: 29.99,
    category: 'Books',
    brand: "O'Reilly",
    rating: 4.5,
    reviewCount: 892,
    image: 'https://via.placeholder.com/400x300/34495e/FFFFFF?text=JavaScript+Book',
    inStock: true,
    stockCount: 25,
    freeShipping: true,
    prime: false,
    createdAt: new Date('2023-12-28')
  },
  {
    _id: '8',
    name: 'Basketball',
    description: 'Official size basketball for indoor/outdoor play',
    price: 24.99,
    category: 'Sports',
    brand: 'Spalding',
    rating: 4.4,
    reviewCount: 234,
    image: 'https://via.placeholder.com/400x300/f39c12/FFFFFF?text=Basketball',
    inStock: true,
    stockCount: 40,
    freeShipping: false,
    prime: false,
    createdAt: new Date('2023-12-25')
  },
  {
    _id: '9',
    name: 'Yoga Mat',
    description: 'Non-slip exercise mat for yoga and fitness',
    price: 39.99,
    category: 'Sports',
    brand: 'Gaiam',
    rating: 4.6,
    reviewCount: 567,
    image: 'https://via.placeholder.com/400x300/16a085/FFFFFF?text=Yoga+Mat',
    inStock: true,
    stockCount: 30,
    freeShipping: true,
    prime: false,
    createdAt: new Date('2023-12-20')
  },
  {
    _id: '10',
    name: 'Face Moisturizer',
    description: 'Hydrating daily face moisturizer with SPF',
    price: 18.99,
    category: 'Beauty',
    brand: 'CeraVe',
    rating: 4.7,
    reviewCount: 1432,
    image: 'https://via.placeholder.com/400x300/e91e63/FFFFFF?text=Face+Moisturizer',
    inStock: true,
    stockCount: 60,
    freeShipping: false,
    prime: false,
    createdAt: new Date('2023-12-15')
  },
  {
    _id: '11',
    name: 'Lipstick Set',
    description: 'Matte lipstick collection in 6 shades',
    price: 45.99,
    category: 'Beauty',
    brand: 'MAC',
    rating: 4.5,
    reviewCount: 789,
    image: 'https://via.placeholder.com/400x300/8e44ad/FFFFFF?text=Lipstick+Set',
    inStock: true,
    stockCount: 20,
    freeShipping: true,
    prime: false,
    createdAt: new Date('2023-12-10')
  }
];

// Products endpoints with optimization
app.get('/api/products', (req, res) => {
  const startTime = Date.now();
  console.log('Products endpoint called with query:', req.query);
  
  const {
    page = 1,
    limit = 20,
    category,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  let filteredProducts = [...mockProducts];

  // Filter by category
  if (category) {
    filteredProducts = filteredProducts.filter(
      product => product.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Filter by search
  if (search) {
    const searchTerm = search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
  }

  const response = {
    products: filteredProducts,
    total: filteredProducts.length,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(filteredProducts.length / limit),
    responseTime: Date.now() - startTime
  };
  
  res.set('Cache-Control', 'public, max-age=300');
  res.json(response);
});

app.get('/api/products/featured', (req, res) => {
  console.log('Featured products endpoint called');
  const featured = mockProducts.filter(p => p.prime || p.rating >= 4.5);
  res.json(featured);
});

app.get('/api/products/deals', (req, res) => {
  console.log('Deals endpoint called');
  const deals = mockProducts.filter(p => p.originalPrice > p.price);
  res.json(deals);
});

app.get('/api/products/:id', (req, res) => {
  console.log('Single product endpoint called for ID:', req.params.id);
  const product = mockProducts.find(p => p._id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

// Categories endpoints with caching
const categoriesCache = { data: null, timestamp: 0 };
const CACHE_TTL = 300000; // 5 minutes

app.get('/api/categories', (req, res) => {
  try {
    const now = Date.now();
    
    // Return cached data if valid
    if (categoriesCache.data && (now - categoriesCache.timestamp) < CACHE_TTL) {
      return res.json({ data: categoriesCache.data });
    }
    
    // Update cache
    categoriesCache.data = mockCategories;
    categoriesCache.timestamp = now;
    
    res.json({ data: mockCategories });
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ error: 'Service unavailable' });
  }
});

app.get('/api/categories/:id', (req, res) => {
  console.log('Single category endpoint called for ID:', req.params.id);
  const category = mockCategories.find(c => c._id === req.params.id);
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }
  res.json(category);
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'products-service' });
});

app.listen(PORT, () => {
  console.log(`Products Service running on port ${PORT}`);
});

module.exports = app;