require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 E-COMMERCE API SERVER - MongoDB Version');

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'],
  credentials: true
}));
app.use(compression());
app.use(limiter);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'session-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || '1234567890-abcdefghijklmnop.apps.googleusercontent.com',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'GOCSPX-abcdefghijklmnop',
  callbackURL: 'http://localhost:5000/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });
    if (!user) {
      user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        password: await bcrypt.hash(Math.random().toString(36), 10),
        googleId: profile.id
      });
      await user.save();
    }
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// MongoDB Connection
const MONGODB_URI = 'mongodb+srv://muralithangella_db_user:sW6i6ceY2q1W0oTc@fullstack.qnyvzwj.mongodb.net/ecommerce';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';

// Generate tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  googleId: { type: String },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  originalPrice: Number,
  category: String,
  brand: String,
  image: String,
  images: [String],
  stock: Number,
  rating: Number,
  reviews: Number,
  discount: Number,
  inStock: Boolean,
  prime: Boolean,
  freeDelivery: Boolean
});

const Product = mongoose.model('Product', productSchema);

// Category Schema
const categorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  image: String
});

const Category = mongoose.model('Category', categorySchema);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// AUTH ROUTES
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required'
      });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      name,
      email,
      password: hashedPassword
    });
    
    await user.save();
    
    const { accessToken, refreshToken } = generateTokens(user._id);
    
    // Set HTTP-only cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', { email });
    console.log('Setting cookies for login...');
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    const { accessToken, refreshToken } = generateTokens(user._id);
    
    // Set HTTP-only cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

app.post('/api/auth/refresh', (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token not found'
      });
    }
    
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId);
    
    // Set new cookies
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000
    });
    
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
});

const resetTokens = new Map();

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const resetToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
    resetTokens.set(email, resetToken);
    res.json({ success: true, message: 'Password reset link sent', resetToken });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process request' });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, JWT_SECRET);
    const storedToken = resetTokens.get(decoded.email);
    if (storedToken !== token) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email: decoded.email }, { password: hashedPassword });
    resetTokens.delete(decoded.email);
    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid or expired token' });
  }
});

app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/api/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const { accessToken, refreshToken } = generateTokens(req.user._id);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.redirect('http://localhost:3000/?sso=success');
  }
);

// PRODUCT ROUTES
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 20, minPrice, maxPrice } = req.query;
    console.log('Products API - Query params:', { category, search, sort, page, limit, minPrice, maxPrice });
    let query = {};
    
    if (category && category !== 'all') {
      query.category = new RegExp(category, 'i');
    }
    
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    console.log('Products API - MongoDB query:', JSON.stringify(query));
    
    // Handle sorting
    let sortOption = {};
    switch(sort) {
      case 'price-asc':
        sortOption = { price: 1 };
        break;
      case 'price-desc':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'newest':
        sortOption = { _id: -1 };
        break;
      case 'name-asc':
        sortOption = { name: 1 };
        break;
      case 'name-desc':
        sortOption = { name: -1 };
        break;
      case 'discount':
        sortOption = { discount: -1 };
        break;
      case 'popularity':
        sortOption = { reviews: -1 };
        break;
      case 'relevance':
      default:
        sortOption = { rating: -1, reviews: -1 };
        break;
    }
    
    const products = await Product.find(query)
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Product.countDocuments(query);
    console.log('Products API - Found products:', products.length, 'Total:', total);
    
    res.json({
      success: true,
      data: products,
      products: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Products error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json({ success: true, data: product });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
});

// CATEGORY ROUTES
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({
      success: true,
      data: categories,
      categories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});

// DEALS ROUTES
app.get('/api/deals', async (req, res) => {
  try {
    const deals = await Product.find({ discount: { $gt: 20 } })
      .sort({ discount: -1 })
      .limit(6);
    res.json({
      success: true,
      data: deals
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch deals' });
  }
});

// RECOMMENDATIONS ROUTES
app.get('/api/recommendations', async (req, res) => {
  try {
    const recommendations = await Product.find({
      $or: [
        { rating: { $gte: 4.0 } },
        { reviews: { $gt: 1000 } }
      ]
    }).limit(8);
    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch recommendations' });
  }
});

// In-memory cart (can be moved to MongoDB later)
let cartItems = [];

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

app.post('/api/cart/add', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    const product = await Product.findById(productId);
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
    
    res.json({
      success: true,
      message: 'Product added to cart'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add to cart' });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'MongoDB E-commerce API is working!',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Cookie test endpoint
app.get('/api/test-cookies', (req, res) => {
  console.log('Received cookies:', req.cookies);
  res.json({
    success: true,
    receivedCookies: req.cookies,
    hasAccessToken: !!req.cookies.accessToken,
    hasRefreshToken: !!req.cookies.refreshToken
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

// Initialize database with sample data
async function initializeDatabase() {
  try {
    // Create admin user if not exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new User({
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Admin user created');
    }
    
    // Add sample products if none exist
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const sampleProducts = [
        {
          name: 'Samsung Galaxy S24 Ultra 5G',
          description: '200MP Camera, S Pen, 5000mAh Battery',
          price: 129999,
          originalPrice: 149999,
          category: 'Mobiles',
          brand: 'Samsung',
          image: 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Samsung+Galaxy+S24',
          rating: 4.5,
          reviews: 1847,
          discount: 13,
          inStock: true,
          prime: true,
          freeDelivery: true
        },
        {
          name: 'iPhone 15 Pro Max',
          description: 'A17 Pro chip, 48MP Main camera, Action button',
          price: 159900,
          category: 'Mobiles',
          brand: 'Apple',
          image: 'https://via.placeholder.com/300x200/000000/FFFFFF?text=iPhone+15+Pro',
          rating: 4.7,
          reviews: 2156,
          discount: 0,
          inStock: true,
          prime: true,
          freeDelivery: true
        }
      ];
      
      await Product.insertMany(sampleProducts);
      console.log('✅ Sample products created');
    }
    
    // Add sample categories if none exist
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      const sampleCategories = [
        {
          name: 'Electronics',
          slug: 'electronics',
          description: 'Mobiles, Laptops, Cameras & more',
          image: 'https://via.placeholder.com/400x200/2C3E50/FFFFFF?text=Electronics'
        },
        {
          name: 'Fashion',
          slug: 'fashion',
          description: 'Clothing, Footwear & Accessories',
          image: 'https://via.placeholder.com/400x200/E74C3C/FFFFFF?text=Fashion'
        }
      ];
      
      await Category.insertMany(sampleCategories);
      console.log('✅ Sample categories created');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`✅ MongoDB Server running on http://localhost:${PORT}`);
  console.log(`🔐 Login: admin@example.com / admin123`);
  initializeDatabase();
});

module.exports = app;