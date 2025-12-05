require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 AMAZON INDIA REPLICA - Complete E-commerce API');

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// COMPREHENSIVE AMAZON INDIA DATA

// Categories (Amazon India style)
const categories = [
  { id: '1', name: 'Mobiles', slug: 'mobiles', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/img17/Mobile/Jupiter/MSO/B08N5WRWNW-edit._SY232_CB667322346_.jpg' },
  { id: '2', name: 'Electronics', slug: 'electronics', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/img22/Electronics/GW/Desktop/Desktop_Hero_1500x600.jpg' },
  { id: '3', name: 'Fashion', slug: 'fashion', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/img23/Fashion/GW/Desktop_Hero_1500x600.jpg' },
  { id: '4', name: 'Home & Kitchen', slug: 'home-kitchen', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/img22/march/brands/GW/Under_199_Cleaning_supplies_1._SY232_CB667322346_.jpg' },
  { id: '5', name: 'Beauty & Personal Care', slug: 'beauty', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/img23/Beauty/GW/Desktop_Hero_1500x600.jpg' },
  { id: '6', name: 'Books', slug: 'books', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/img23/Books/GW/Desktop_Hero_1500x600.jpg' },
  { id: '7', name: 'Sports, Fitness & Outdoors', slug: 'sports', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/img23/Sports/GW/Desktop_Hero_1500x600.jpg' },
  { id: '8', name: 'Toys & Games', slug: 'toys', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/img22/toys/GW/Desktop_Hero_1500x600.jpg' },
  { id: '9', name: 'Grocery & Gourmet Foods', slug: 'grocery', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/img22/grocery/GW/Desktop_Hero_1500x600.jpg' },
  { id: '10', name: 'Health & Household', slug: 'health', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/img22/health/GW/Desktop_Hero_1500x600.jpg' },
  { id: '11', name: 'Car & Motorbike', slug: 'automotive', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/img22/automotive/GW/Desktop_Hero_1500x600.jpg' },
  { id: '12', name: 'Baby', slug: 'baby', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/img22/baby/GW/Desktop_Hero_1500x600.jpg' }
];

// Comprehensive Products Database
const products = [
  // Mobiles
  {
    id: '1', name: 'Samsung Galaxy S24 Ultra 5G (Titanium Black, 12GB, 256GB Storage)',
    price: 129999, originalPrice: 149999, discount: 13, category: 'Mobiles',
    brand: 'Samsung', model: 'Galaxy S24 Ultra',
    images: [
      'https://m.media-amazon.com/images/I/71Sa5wg2nzL._SX679_.jpg',
      'https://m.media-amazon.com/images/I/71cSV-RTBSL._SX679_.jpg'
    ],
    rating: 4.4, reviews: 2847, inStock: true, prime: true, freeDelivery: true,
    description: '200MP Camera, S Pen, 5000mAh Battery, Snapdragon 8 Gen 3',
    specifications: {
      display: '6.8" Dynamic AMOLED 2X',
      processor: 'Snapdragon 8 Gen 3',
      camera: '200MP + 50MP + 10MP + 12MP',
      battery: '5000mAh',
      os: 'Android 14'
    },
    features: ['5G Ready', 'Wireless Charging', 'Water Resistant', 'S Pen Included'],
    seller: 'Amazon', warranty: '1 Year Manufacturer Warranty'
  },
  {
    id: '2', name: 'iPhone 15 Pro Max (Natural Titanium, 256GB)',
    price: 159900, originalPrice: 159900, discount: 0, category: 'Mobiles',
    brand: 'Apple', model: 'iPhone 15 Pro Max',
    images: [
      'https://m.media-amazon.com/images/I/81dT7CUY6GL._SX679_.jpg',
      'https://m.media-amazon.com/images/I/81Os1SDWpcL._SX679_.jpg'
    ],
    rating: 4.6, reviews: 1234, inStock: true, prime: true, freeDelivery: true,
    description: 'A17 Pro chip, 48MP Main camera, Action button, USB-C',
    specifications: {
      display: '6.7" Super Retina XDR',
      processor: 'A17 Pro chip',
      camera: '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
      battery: 'Up to 29 hours video playback',
      os: 'iOS 17'
    },
    features: ['5G Ready', 'MagSafe', 'Face ID', 'Ceramic Shield'],
    seller: 'Amazon', warranty: '1 Year Limited Warranty'
  },
  // Electronics
  {
    id: '3', name: 'Sony WH-1000XM5 Wireless Industry Leading Noise Canceling Headphones',
    price: 29990, originalPrice: 34990, discount: 14, category: 'Electronics',
    brand: 'Sony', model: 'WH-1000XM5',
    images: [
      'https://m.media-amazon.com/images/I/51QeS0jjsJL._SX679_.jpg',
      'https://m.media-amazon.com/images/I/61SUj2aKoEL._SX679_.jpg'
    ],
    rating: 4.5, reviews: 3421, inStock: true, prime: true, freeDelivery: true,
    description: '30hr battery, Quick Charge, Premium Sound Quality, Call Quality',
    specifications: {
      battery: '30 hours',
      connectivity: 'Bluetooth 5.2, NFC',
      weight: '250g',
      drivers: '30mm'
    },
    features: ['Active Noise Cancellation', 'Quick Charge', 'Multipoint Connection'],
    seller: 'Sony India', warranty: '1 Year Warranty'
  },
  // Fashion
  {
    id: '4', name: 'Levi\'s Men\'s 511 Slim Jeans',
    price: 2999, originalPrice: 4999, discount: 40, category: 'Fashion',
    brand: 'Levi\'s', model: '511 Slim',
    images: [
      'https://m.media-amazon.com/images/I/71YQrw7hVwL._UX679_.jpg',
      'https://m.media-amazon.com/images/I/71nKw+BTJOL._UX679_.jpg'
    ],
    rating: 4.2, reviews: 8934, inStock: true, prime: true, freeDelivery: true,
    description: 'Slim fit jeans with stretch, Dark wash, Classic 5-pocket styling',
    specifications: {
      material: '99% Cotton, 1% Elastane',
      fit: 'Slim',
      rise: 'Mid Rise',
      closure: 'Zip Fly with Button'
    },
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: ['Dark Blue', 'Light Blue', 'Black'],
    seller: 'Levi\'s Store', warranty: 'No Warranty'
  },
  // Home & Kitchen
  {
    id: '5', name: 'Prestige Deluxe Alpha Outer Lid Stainless Steel Pressure Cooker, 6.5 Litres',
    price: 2499, originalPrice: 3995, discount: 37, category: 'Home & Kitchen',
    brand: 'Prestige', model: 'Deluxe Alpha',
    images: [
      'https://m.media-amazon.com/images/I/71QKQ+7EMEL._SX679_.jpg',
      'https://m.media-amazon.com/images/I/71nKw+BTJOL._SX679_.jpg'
    ],
    rating: 4.3, reviews: 12456, inStock: true, prime: true, freeDelivery: true,
    description: 'Outer lid pressure cooker, Stainless steel body, Induction compatible',
    specifications: {
      capacity: '6.5 Litres',
      material: 'Stainless Steel',
      compatibility: 'Gas, Electric, Induction',
      safety: 'Controlled Gasket Release System'
    },
    features: ['Induction Compatible', 'Controlled Gasket Release', 'Alpha Base Technology'],
    seller: 'Prestige Smart Kitchen', warranty: '5 Years Warranty'
  }
];

// Amazon India Banners
const banners = [
  {
    id: '1', title: 'Great Indian Festival', subtitle: 'Up to 80% off on everything',
    image: 'https://images-eu.ssl-images-amazon.com/images/G/31/img22/Wireless/devjyoti/GW/Uber/Nov/D103625178_DesktopTallHero_3000x1200.jpg',
    cta: 'Shop Now', link: '/festival-sale', active: true
  },
  {
    id: '2', title: 'Prime Day Special', subtitle: 'Exclusive deals for Prime members',
    image: 'https://images-eu.ssl-images-amazon.com/images/G/31/prime/PrimeDay/2023/GW/PD23_GW_PC_Hero_NTA_2x._CB595001705_.jpg',
    cta: 'Shop Prime Deals', link: '/prime-deals', active: true
  },
  {
    id: '3', title: 'Electronics Carnival', subtitle: 'Best prices on gadgets',
    image: 'https://images-eu.ssl-images-amazon.com/images/G/31/img22/Electronics/GW/Desktop/Desktop_Hero_1500x600.jpg',
    cta: 'Explore', link: '/electronics', active: true
  }
];

// Deals of the Day
const dealsOfTheDay = [
  { productId: '1', dealPrice: 119999, originalPrice: 129999, discount: 8, timeLeft: '23:45:30' },
  { productId: '3', dealPrice: 24990, originalPrice: 29990, discount: 17, timeLeft: '15:20:45' },
  { productId: '5', dealPrice: 1999, originalPrice: 2499, discount: 20, timeLeft: '08:30:15' }
];

// User accounts
const users = [
  {
    id: '1', name: 'Rajesh Kumar', email: 'rajesh@example.com', password: 'password123',
    phone: '+91-9876543210', addresses: [
      {
        id: '1', type: 'Home', name: 'Rajesh Kumar',
        address: '123, MG Road, Bangalore, Karnataka - 560001',
        phone: '+91-9876543210', isDefault: true
      }
    ],
    orders: [], wishlist: [], prime: true
  },
  { id: '2', name: 'Admin', email: 'admin@example.com', password: 'admin123', phone: '', orders: [], wishlist: [], prime: true }
];

// Cart storage
let cartItems = [];
let wishlistItems = [];

// AUTHENTICATION ROUTES
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
  
  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      prime: user.prime
    },
    token: 'jwt-token-' + Date.now()
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone } = req.body;
  
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
      message: 'User already exists'
    });
  }
  
  const newUser = {
    id: String(users.length + 1),
    name, email, password, phone: phone || '',
    addresses: [], orders: [], wishlist: [], prime: false
  };
  
  users.push(newUser);
  
  res.json({
    success: true,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      prime: newUser.prime
    },
    token: 'jwt-token-' + Date.now()
  });
});

// PRODUCT ROUTES
app.get('/api/products', (req, res) => {
  const { category, search, brand, minPrice, maxPrice, rating, sort, page = 1, limit = 20 } = req.query;
  let filteredProducts = [...products];
  
  // Filter by category
  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter(p => 
      p.category.toLowerCase().includes(category.toLowerCase())
    );
  }
  
  // Search filter
  if (search) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Brand filter
  if (brand) {
    filteredProducts = filteredProducts.filter(p => 
      p.brand.toLowerCase() === brand.toLowerCase()
    );
  }
  
  // Price filter
  if (minPrice) {
    filteredProducts = filteredProducts.filter(p => p.price >= parseInt(minPrice));
  }
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(p => p.price <= parseInt(maxPrice));
  }
  
  // Rating filter
  if (rating) {
    filteredProducts = filteredProducts.filter(p => p.rating >= parseFloat(rating));
  }
  
  // Sorting
  if (sort) {
    switch (sort) {
      case 'price-low':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filteredProducts.sort((a, b) => b.id - a.id);
        break;
      case 'popularity':
        filteredProducts.sort((a, b) => b.reviews - a.reviews);
        break;
    }
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: paginatedProducts,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredProducts.length,
      pages: Math.ceil(filteredProducts.length / limit)
    },
    filters: {
      brands: [...new Set(products.map(p => p.brand))],
      categories: [...new Set(products.map(p => p.category))],
      priceRange: {
        min: Math.min(...products.map(p => p.price)),
        max: Math.max(...products.map(p => p.price))
      }
    }
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  // Related products
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  
  res.json({
    success: true,
    data: {
      ...product,
      relatedProducts
    }
  });
});

// CATEGORY ROUTES
app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    data: categories
  });
});

// DEALS ROUTES
app.get('/api/deals', (req, res) => {
  const deals = dealsOfTheDay.map(deal => {
    const product = products.find(p => p.id === deal.productId);
    return {
      ...product,
      dealPrice: deal.dealPrice,
      dealDiscount: deal.discount,
      timeLeft: deal.timeLeft
    };
  });
  
  res.json({
    success: true,
    data: deals
  });
});

// BANNER ROUTES
app.get('/api/banners', (req, res) => {
  res.json({
    success: true,
    data: banners.filter(b => b.active)
  });
});

// RECOMMENDATIONS ROUTES
app.get('/api/recommendations', (req, res) => {
  // Get a mix of high-rated and popular products
  const recommendations = products
    .filter(p => p.rating >= 4.0 || p.reviews > 1000)
    .sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews))
    .slice(0, 8);
  
  res.json({
    success: true,
    data: recommendations
  });
});

// SEARCH ROUTES
app.get('/api/search/suggestions', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.json({ success: true, data: [] });
  }
  
  const suggestions = products
    .filter(p => p.name.toLowerCase().includes(q.toLowerCase()))
    .slice(0, 8)
    .map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      image: p.images[0]
    }));
  
  res.json({
    success: true,
    data: suggestions
  });
});

// CART ROUTES
app.get('/api/cart', (req, res) => {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    if (product && product.originalPrice > product.price) {
      return sum + ((product.originalPrice - product.price) * item.quantity);
    }
    return sum;
  }, 0);
  
  res.json({
    success: true,
    data: {
      items: cartItems,
      total: parseFloat(total.toFixed(2)),
      savings: parseFloat(savings.toFixed(2)),
      count: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      deliveryFee: total > 499 ? 0 : 40
    }
  });
});

app.post('/api/cart/add', (req, res) => {
  const { productId, quantity = 1 } = req.body;
  
  const product = products.find(p => p.id === productId);
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
      originalPrice: product.originalPrice,
      image: product.images[0],
      brand: product.brand,
      inStock: product.inStock
    });
  }
  
  res.json({
    success: true,
    message: 'Added to cart'
  });
});

// WISHLIST ROUTES
app.get('/api/wishlist', (req, res) => {
  const wishlistProducts = wishlistItems.map(item => {
    const product = products.find(p => p.id === item.productId);
    return product;
  }).filter(Boolean);
  
  res.json({
    success: true,
    data: wishlistProducts
  });
});

app.post('/api/wishlist/add', (req, res) => {
  const { productId } = req.body;
  
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  const exists = wishlistItems.find(item => item.productId === productId);
  if (!exists) {
    wishlistItems.push({
      id: Date.now().toString(),
      productId,
      addedAt: new Date().toISOString()
    });
  }
  
  res.json({
    success: true,
    message: 'Added to wishlist'
  });
});

// Additional Routes
const amazonRoutes = require('./routes/amazonRoutes');
app.use('/api', amazonRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Amazon India Replica API running on http://localhost:${PORT}`);
  console.log(`📱 Products: http://localhost:${PORT}/api/products`);
  console.log(`🛒 Cart: http://localhost:${PORT}/api/cart`);
  console.log(`❤️  Wishlist: http://localhost:${PORT}/api/wishlist`);
  console.log(`🏷️  Deals: http://localhost:${PORT}/api/deals`);
  console.log(`📦 Orders: http://localhost:${PORT}/api/orders`);
  console.log(`⭐ Reviews: http://localhost:${PORT}/api/reviews`);
  console.log(`🏠 Addresses: http://localhost:${PORT}/api/addresses`);
  console.log(`💳 Payments: http://localhost:${PORT}/api/payment-methods`);
  console.log(`🎫 Coupons: http://localhost:${PORT}/api/coupons`);
});

module.exports = app;