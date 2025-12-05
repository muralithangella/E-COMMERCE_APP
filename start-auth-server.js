const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001; // Use different port to avoid conflicts

// Middleware
app.use(cors());
app.use(express.json());

// Simple test users
const users = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: '2', 
    name: 'Test User',
    email: 'test@example.com',
    password: 'test123',
    role: 'user'
  }
];

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  console.log('Login request:', req.body);
  
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    const token = `token_${user.id}_${Date.now()}`;
    console.log('Login successful for:', email);
    
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token,
      accessToken: token
    });
  } else {
    console.log('Login failed for:', email);
    res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }
});

// Register endpoint
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
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
    password,
    role: 'user'
  };
  
  users.push(newUser);
  const token = `token_${newUser.id}_${Date.now()}`;
  
  res.json({
    success: true,
    message: 'Registration successful',
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    },
    token,
    accessToken: token
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', users: users.length });
});

app.listen(PORT, () => {
  console.log(`🔐 Auth Server running on port ${PORT}`);
  console.log('Test credentials: admin@example.com / admin123');
});