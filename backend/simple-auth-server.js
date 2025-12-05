require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 AMAZON INDIA REPLICA - Simple Auth Server');

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

// Simple in-memory users for testing
const users = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123', // In production, this would be hashed
    role: 'admin',
    isActive: true
  },
  {
    id: '2',
    name: 'Test User',
    email: 'test@example.com',
    password: 'test123',
    role: 'user',
    isActive: true
  }
];

// Simple JWT token generation (for demo purposes)
function generateToken(userId) {
  return `token_${userId}_${Date.now()}`;
}

// Authentication endpoints
app.post('/api/auth/login', (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password required' 
      });
    }

    const user = users.find(u => u.email === email && u.isActive);
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    if (user.password !== password) {
      console.log('Invalid password for:', email);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const token = generateToken(user.id);
    console.log('Login successful for:', email);

    res.json({
      success: true,
      message: 'Login successful',
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        role: user.role 
      },
      token,
      accessToken: token,
      refreshToken: token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed', 
      error: error.message 
    });
  }
});

app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email and password required' 
      });
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists' 
      });
    }

    const newUser = {
      id: String(users.length + 1),
      name,
      email,
      password, // In production, this would be hashed
      role: 'user',
      isActive: true
    };

    users.push(newUser);
    const token = generateToken(newUser.id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: { 
        id: newUser.id, 
        email: newUser.email, 
        name: newUser.name,
        role: newUser.role 
      },
      token,
      accessToken: token,
      refreshToken: token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed', 
      error: error.message 
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    users: users.length
  });
});

// Test endpoint to list users (for development only)
app.get('/api/auth/users', (req, res) => {
  res.json({
    success: true,
    users: users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role }))
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`👥 Test users: http://localhost:${PORT}/api/auth/users`);
  console.log('\n🔐 Test Credentials:');
  console.log('Email: admin@example.com | Password: admin123');
  console.log('Email: test@example.com | Password: test123');
});