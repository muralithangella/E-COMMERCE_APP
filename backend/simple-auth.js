require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3009;

app.use(cors());
app.use(express.json());

// Simple in-memory user
const testUser = {
  email: 'admin@example.com',
  password: 'admin123',
  name: 'Admin User',
  id: 'admin-123'
};

app.post('/api/auth/login', (req, res) => {
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

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'simple-auth' });
});

app.listen(PORT, () => {
  console.log(`Simple auth server running on port ${PORT}`);
});