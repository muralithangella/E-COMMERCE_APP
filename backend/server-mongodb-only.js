require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🚀 E-COMMERCE BACKEND - MongoDB Only Mode');

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      bufferCommands: false,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('Continuing without database...');
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Basic auth routes
const User = require('./models/User');

// Add timeout middleware
app.use((req, res, next) => {
  res.setTimeout(10000, () => {
    console.log('Request timeout');
    res.status(408).json({ message: 'Request timeout' });
  });
  next();
});

app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login attempt for:', req.body.email);
    console.log('MongoDB state:', mongoose.connection.readyState);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Fallback for testing
    if (email === 'admin@example.com' && password === 'admin123') {
      const token = jwt.sign(
        { userId: 'test-admin-id' }, 
        process.env.JWT_SECRET || 'fallback-secret', 
        { expiresIn: '24h' }
      );
      return res.json({
        message: 'Login successful (fallback)',
        user: { id: 'test-admin-id', email: 'admin@example.com', name: 'Admin User' },
        token
      });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    console.log('Searching for user...');
    const user = await User.findOne({ email, isActive: true }).select('+password').maxTimeMS(3000);
    
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Comparing passwords...');
    const isValid = await user.comparePassword(password);
    console.log('Password valid:', isValid);
    
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'fallback-secret', 
      { expiresIn: '24h' }
    );

    console.log('Login successful for:', email);
    res.json({
      message: 'Login successful',
      user: { id: user._id, email: user.email, name: user.name },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Registration attempt for:', req.body.email);
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password });
    await user.save();
    console.log('User created successfully:', email);
    
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'fallback-secret', 
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Registration successful',
      user: { id: user._id, email: user.email, name: user.name },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Test endpoint to check users
app.get('/api/auth/test-users', async (req, res) => {
  try {
    const users = await User.find({}).select('email name isActive');
    res.json({ users, count: users.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/db-test', async (req, res) => {
  try {
    const result = await mongoose.connection.db.admin().ping();
    res.json({ message: 'Database ping successful', result });
  } catch (error) {
    res.status(500).json({ message: 'Database ping failed', error: error.message });
  }
});

// Create admin user endpoint
app.post('/api/auth/create-admin', async (req, res) => {
  try {
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();
    res.json({ message: 'Admin user created', email: 'admin@example.com', password: 'admin123' });
  } catch (error) {
    if (error.code === 11000) {
      res.json({ message: 'Admin user already exists', email: 'admin@example.com', password: 'admin123' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Start server
async function startServer() {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`🎉 Server running on http://localhost:${PORT}`);
    console.log(`📍 API: http://localhost:${PORT}/api/test`);
    console.log(`🏥 Health: http://localhost:${PORT}/health`);
  });
}

startServer();