require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 E-COMMERCE BACKEND - Working Server');

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    // Continue without MongoDB for now
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

// Mock user database
const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', password: 'password123' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', password: 'password456' },
  { id: '3', name: 'Test User', email: 'test@example.com', password: 'test123' }
];

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login attempt:', { email });
  
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email and password are required' 
    });
  }
  
  // Find user by email and password
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }
  
  // Successful login
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
  
  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'User with this email already exists'
    });
  }
  
  // Add new user to mock database
  const newUser = {
    id: String(mockUsers.length + 1),
    name,
    email,
    password
  };
  mockUsers.push(newUser);
  
  // Successful registration
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

app.post('/api/auth/refresh-token', (req, res) => {
  res.json({
    success: true,
    data: {
      accessToken: 'new-mock-jwt-token-' + Date.now()
    }
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Catch all for other API endpoints
app.use('/api/*', (req, res) => {
  res.json({ 
    message: 'Endpoint not implemented yet', 
    method: req.method, 
    path: req.path 
  });
});

// Start server
async function startServer() {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`🎉 Server running on http://localhost:${PORT}`);
    console.log(`📍 API: http://localhost:${PORT}/api/test`);
    console.log(`🏥 Health: http://localhost:${PORT}/health`);
    console.log(`🔐 Auth: http://localhost:${PORT}/api/auth/login`);
  });
}

startServer();