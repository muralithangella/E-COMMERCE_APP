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

// Amazon-style mock data with category-specific products
const products = [
  // Electronics & Mobiles
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
    _id: '3', id: '3', name: 'OnePlus 12 5G (Flowy Emerald, 12GB RAM, 256GB Storage)',
    price: 64999, originalPrice: 69999, discount: 7, category: 'Mobiles',
    image: 'https://via.placeholder.com/300x200/E74C3C/FFFFFF?text=OnePlus+12',
    rating: 4.4, reviews: 892, inStock: true, prime: true, freeDelivery: true,
    description: 'Snapdragon 8 Gen 3, 50MP Triple Camera, 100W SuperVOOC Charging'
  },
  {
    _id: '4', id: '4', name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    price: 29990, originalPrice: 34990, discount: 14, category: 'Electronics',
    image: 'https://via.placeholder.com/300x200/2C3E50/FFFFFF?text=Sony+Headphones',
    rating: 4.6, reviews: 892, inStock: true, prime: true, freeDelivery: true,
    description: '30hr battery, Quick Charge, Premium Sound Quality'
  },
  {
    _id: '5', id: '5', name: 'MacBook Air M2 Chip (13-inch, 8GB RAM, 256GB SSD)',
    price: 114900, originalPrice: 119900, discount: 4, category: 'Electronics',
    image: 'https://via.placeholder.com/300x200/95A5A6/FFFFFF?text=MacBook+Air',
    rating: 4.8, reviews: 892, inStock: true, prime: true, freeDelivery: true,
    description: 'M2 chip, 18-hour battery, Liquid Retina display'
  },
  {
    _id: '6', id: '6', name: 'Dell XPS 13 Laptop (Intel i7, 16GB RAM, 512GB SSD)',
    price: 89999, originalPrice: 99999, discount: 10, category: 'Electronics',
    image: 'https://via.placeholder.com/300x200/34495E/FFFFFF?text=Dell+XPS+13',
    rating: 4.5, reviews: 654, inStock: true, prime: true, freeDelivery: true,
    description: '13.4" FHD+ Display, Intel Iris Xe Graphics, Windows 11'
  },
  // Fashion
  {
    _id: '7', id: '7', name: 'Levi\'s Men\'s 511 Slim Jeans',
    price: 2999, originalPrice: 4999, discount: 40, category: 'Fashion',
    image: 'https://via.placeholder.com/300x200/3498DB/FFFFFF?text=Levis+Jeans',
    rating: 4.3, reviews: 567, inStock: true, prime: true, freeDelivery: true,
    description: 'Slim fit jeans with stretch, Dark wash, Classic 5-pocket styling'
  },
  {
    _id: '8', id: '8', name: 'Nike Air Max 270 Running Shoes',
    price: 7999, originalPrice: 12995, discount: 38, category: 'Fashion',
    image: 'https://via.placeholder.com/300x200/E67E22/FFFFFF?text=Nike+Air+Max',
    rating: 4.4, reviews: 3421, inStock: true, prime: true, freeDelivery: true,
    description: 'Max Air unit, Breathable mesh upper, Comfortable cushioning'
  },
  {
    _id: '9', id: '9', name: 'Adidas Ultraboost 22 Running Shoes',
    price: 8999, originalPrice: 11999, discount: 25, category: 'Fashion',
    image: 'https://via.placeholder.com/300x200/27AE60/FFFFFF?text=Adidas+Ultraboost',
    rating: 4.6, reviews: 2134, inStock: true, prime: true, freeDelivery: true,
    description: 'Boost midsole, Primeknit upper, Continental rubber outsole'
  },
  {
    _id: '10', id: '10', name: 'H&M Cotton T-Shirt (Pack of 3)',
    price: 1499, originalPrice: 1999, discount: 25, category: 'Fashion',
    image: 'https://via.placeholder.com/300x200/9B59B6/FFFFFF?text=H%26M+T-Shirt',
    rating: 4.2, reviews: 892, inStock: true, prime: true, freeDelivery: true,
    description: '100% Cotton, Regular fit, Crew neck, Machine washable'
  },
  // Home & Kitchen
  {
    _id: '11', id: '11', name: 'Prestige Deluxe Alpha Pressure Cooker, 6.5 Litres',
    price: 2499, originalPrice: 3995, discount: 37, category: 'Home & Kitchen',
    image: 'https://via.placeholder.com/300x200/F39C12/FFFFFF?text=Pressure+Cooker',
    rating: 4.4, reviews: 1234, inStock: true, prime: true, freeDelivery: true,
    description: 'Outer lid pressure cooker, Stainless steel body, Induction compatible'
  },
  {
    _id: '12', id: '12', name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker',
    price: 8990, originalPrice: 12900, discount: 30, category: 'Home & Kitchen',
    image: 'https://via.placeholder.com/300x200/8E44AD/FFFFFF?text=Instant+Pot',
    rating: 4.5, reviews: 1567, inStock: true, prime: true, freeDelivery: true,
    description: '7-in-1 functionality, Smart programs, Stainless steel cooking pot'
  },
  {
    _id: '13', id: '13', name: 'Philips Air Fryer HD9200/90 (4.1 Liter)',
    price: 7999, originalPrice: 9999, discount: 20, category: 'Home & Kitchen',
    image: 'https://via.placeholder.com/300x200/E74C3C/FFFFFF?text=Air+Fryer',
    rating: 4.3, reviews: 987, inStock: true, prime: true, freeDelivery: true,
    description: 'Rapid Air Technology, 90% less fat, Digital display'
  },
  {
    _id: '14', id: '14', name: 'IKEA HEMNES Bed Frame (Queen Size)',
    price: 15999, originalPrice: 18999, discount: 16, category: 'Home & Kitchen',
    image: 'https://via.placeholder.com/300x200/16A085/FFFFFF?text=IKEA+Bed',
    rating: 4.4, reviews: 456, inStock: true, prime: true, freeDelivery: true,
    description: 'Solid wood, White stain, Adjustable bed sides'
  },
  // Books
  {
    _id: '15', id: '15', name: 'Atomic Habits by James Clear',
    price: 399, originalPrice: 599, discount: 33, category: 'Books',
    image: 'https://via.placeholder.com/300x200/2980B9/FFFFFF?text=Atomic+Habits',
    rating: 4.8, reviews: 5432, inStock: true, prime: true, freeDelivery: true,
    description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones'
  },
  {
    _id: '16', id: '16', name: 'The Psychology of Money by Morgan Housel',
    price: 299, originalPrice: 450, discount: 34, category: 'Books',
    image: 'https://via.placeholder.com/300x200/27AE60/FFFFFF?text=Psychology+Money',
    rating: 4.7, reviews: 3210, inStock: true, prime: true, freeDelivery: true,
    description: 'Timeless lessons on wealth, greed, and happiness'
  },
  {
    _id: '17', id: '17', name: 'Rich Dad Poor Dad by Robert Kiyosaki',
    price: 249, originalPrice: 399, discount: 38, category: 'Books',
    image: 'https://via.placeholder.com/300x200/F39C12/FFFFFF?text=Rich+Dad+Poor+Dad',
    rating: 4.5, reviews: 8765, inStock: true, prime: true, freeDelivery: true,
    description: 'What the Rich Teach Their Kids About Money'
  },
  // Prime Exclusive
  {
    _id: '18', id: '18', name: 'Echo Dot (5th Gen) Smart Speaker with Alexa',
    price: 3999, originalPrice: 5499, discount: 27, category: 'Prime',
    image: 'https://via.placeholder.com/300x200/34495E/FFFFFF?text=Echo+Dot',
    rating: 4.4, reviews: 12456, inStock: true, prime: true, freeDelivery: true,
    description: 'Voice control, Smart home hub, Premium sound'
  },
  {
    _id: '19', id: '19', name: 'Fire TV Stick 4K Max Streaming Device',
    price: 4999, originalPrice: 6999, discount: 29, category: 'Prime',
    image: 'https://via.placeholder.com/300x200/E67E22/FFFFFF?text=Fire+TV+Stick',
    rating: 4.3, reviews: 8901, inStock: true, prime: true, freeDelivery: true,
    description: '4K Ultra HD, Alexa Voice Remote, Wi-Fi 6 support'
  },
  // Today's Deals (High discount items)
  {
    _id: '20', id: '20', name: 'Boat Airdopes 141 Bluetooth Earbuds',
    price: 1299, originalPrice: 2999, discount: 57, category: 'Today\'s Deals',
    image: 'https://via.placeholder.com/300x200/3498DB/FFFFFF?text=Boat+Airdopes',
    rating: 4.1, reviews: 15678, inStock: true, prime: true, freeDelivery: true,
    description: 'True wireless, 42H playback, IPX4 water resistance'
  },
  {
    _id: '21', id: '21', name: 'Xiaomi Mi Band 7 Fitness Tracker',
    price: 2299, originalPrice: 3999, discount: 43, category: 'Today\'s Deals',
    image: 'https://via.placeholder.com/300x200/9B59B6/FFFFFF?text=Mi+Band+7',
    rating: 4.2, reviews: 9876, inStock: true, prime: true, freeDelivery: true,
    description: '1.62" AMOLED display, 14-day battery, 110+ workout modes'
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
  },
  {
    _id: '5', id: '5', name: 'Sports',
    image: 'https://via.placeholder.com/400x200/9B59B6/FFFFFF?text=Sports',
    description: 'Sports, Fitness & Outdoors'
  }
];

// Amazon-style banners
const banners = [
  {
    id: '1', title: 'Starting ₹1,699', subtitle: 'Deals on kids cycles',
    image: 'https://via.placeholder.com/800x300/3498DB/FFFFFF?text=Kids+Cycles+Deal',
    cta: 'Shop Now', link: '/products?category=Sports'
  },
  {
    id: '2', title: 'Up to 60% off', subtitle: 'Beauty & Personal Care',
    image: 'https://via.placeholder.com/800x300/E91E63/FFFFFF?text=Beauty+Sale',
    cta: 'Shop Now', link: '/products?category=Beauty'
  },
  {
    id: '3', title: 'Up to 70% off', subtitle: 'Electronics & Accessories',
    image: 'https://via.placeholder.com/800x300/FF5722/FFFFFF?text=Electronics+Sale',
    cta: 'Shop Now', link: '/products?category=Electronics'
  }
];

// Home sections data
const homeSections = {
  revampHome: {
    title: 'Revamp your home in style',
    items: [
      { name: 'Cushion covers, bedsheets & more', image: 'https://via.placeholder.com/200x150/8E44AD/FFFFFF?text=Bedsheets' },
      { name: 'Figurines, vases & more', image: 'https://via.placeholder.com/200x150/E67E22/FFFFFF?text=Home+Decor' }
    ]
  },
  dealsUnder499: {
    title: 'Starting ₹49 | Deals on home essentials',
    items: [
      { name: 'Cleaning supplies', image: 'https://via.placeholder.com/200x150/27AE60/FFFFFF?text=Cleaning' },
      { name: 'Bathroom accessories', image: 'https://via.placeholder.com/200x150/3498DB/FFFFFF?text=Bathroom' }
    ]
  },
  bulkOrders: {
    title: 'Bulk order discounts + Up to 18% GST savings',
    items: [
      { name: 'Up to 45% off | Laptops', image: 'https://via.placeholder.com/200x150/34495E/FFFFFF?text=Laptops' },
      { name: 'Up to 60% off | Kitchen appliances', image: 'https://via.placeholder.com/200x150/E74C3C/FFFFFF?text=Kitchen' }
    ]
  },
  appliances: {
    title: 'Appliances for your home | Up to 55% off',
    items: [
      { name: 'Air conditioners', image: 'https://via.placeholder.com/200x150/2980B9/FFFFFF?text=AC' },
      { name: 'Refrigerators', image: 'https://via.placeholder.com/200x150/16A085/FFFFFF?text=Fridge' }
    ]
  }
};

// Mock users
const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', password: 'password123' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', password: 'password456' },
  { id: '3', name: 'Test User', email: 'test@example.com', password: 'test123' },
  { id: '4', name: 'Admin', email: 'admin@example.com', password: 'admin123' }
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
    user: { 
      id: user.id, 
      name: user.name, 
      email: user.email,
      role: 'user'
    },
    token: 'mock-jwt-token-' + Date.now()
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
    user: { 
      id: newUser.id, 
      name: newUser.name, 
      email: newUser.email,
      role: 'user'
    },
    token: 'mock-jwt-token-' + Date.now()
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// PRODUCT ROUTES
app.get('/api/products', (req, res) => {
  const { category, search, page = 1, limit = 20 } = req.query;
  let filteredProducts = [...products];
  
  console.log('API Request - Category:', category, 'Search:', search);
  
  if (category && category !== 'all' && category !== 'All') {
    // Special handling for specific categories
    if (category.toLowerCase().includes('today') || category.toLowerCase().includes('deals')) {
      filteredProducts = filteredProducts.filter(p => p.discount > 25);
    } else if (category.toLowerCase().includes('bestseller')) {
      filteredProducts = filteredProducts.filter(p => p.reviews > 1000).sort((a, b) => b.reviews - a.reviews);
    } else if (category.toLowerCase().includes('home') && category.toLowerCase().includes('kitchen')) {
      filteredProducts = filteredProducts.filter(p => p.category.toLowerCase().includes('home') || p.category.toLowerCase().includes('kitchen'));
    } else {
      // Regular category filtering
      filteredProducts = filteredProducts.filter(p => {
        const productCategory = p.category.toLowerCase().replace(/[^a-z0-9]/g, '');
        const requestCategory = category.toLowerCase().replace(/[^a-z0-9]/g, '');
        return productCategory === requestCategory || 
               productCategory.includes(requestCategory) ||
               requestCategory.includes(productCategory);
      });
    }
    console.log('Filtered products for category:', category, 'Count:', filteredProducts.length);
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

// BANNER ROUTES
app.get('/api/banners', (req, res) => {
  res.json({ 
    success: true, 
    data: banners 
  });
});

// HOME SECTIONS ROUTES
app.get('/api/home-sections', (req, res) => {
  res.json({ 
    success: true, 
    data: homeSections 
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

// SEARCH SUGGESTIONS
app.get('/api/search/suggestions', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.json({ success: true, data: [] });
  }
  
  const suggestions = products
    .filter(p => p.name.toLowerCase().includes(q.toLowerCase()))
    .slice(0, 5)
    .map(p => ({ id: p.id, name: p.name, category: p.category }));
    
  res.json({ 
    success: true, 
    data: suggestions 
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
      image: product.image || product.images?.[0] || 'https://via.placeholder.com/300x200/95A5A6/FFFFFF?text=Product',
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

// ORDER ROUTES
let orders = []; // In-memory storage for demo

app.post('/api/orders', (req, res) => {
  const orderData = req.body;
  
  if (!orderData.items || orderData.items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Order must contain at least one item'
    });
  }
  
  const order = {
    ...orderData,
    id: orderData.id || Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  orders.push(order);
  
  console.log('Order created:', order.id);
  
  res.json({
    success: true,
    data: order,
    message: 'Order created successfully'
  });
});

app.get('/api/orders', (req, res) => {
  res.json({
    success: true,
    data: orders
  });
});

app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }
  
  res.json({
    success: true,
    data: order
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'E-commerce API is working!',
    timestamp: new Date().toISOString(),
    endpoints: {
      products: '/api/products',
      categories: '/api/categories',
      cart: '/api/cart',
      orders: '/api/orders',
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
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📍 API Test: http://localhost:${PORT}/api/test`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`🛍️  Products: http://localhost:${PORT}/api/products`);
  console.log(`🛒 Cart: http://localhost:${PORT}/api/cart`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth/login`);
  console.log('🧹 Cart cleared - ready for fresh data');
});

module.exports = app;