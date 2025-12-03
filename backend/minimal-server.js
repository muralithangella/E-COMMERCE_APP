const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Mock auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email && password) {
    res.json({
      success: true,
      data: {
        user: { id: 1, name: 'Test User', email },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      }
    });
  } else {
    res.status(400).json({ message: 'Email and password required' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  if (name && email && password) {
    res.json({
      success: true,
      data: {
        user: { id: 1, name, email },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      }
    });
  } else {
    res.status(400).json({ message: 'Name, email and password required' });
  }
});

// Catch all for other API endpoints
app.use('/api/*', (req, res) => {
  res.json({ message: 'Mock API endpoint', method: req.method, path: req.path });
});

app.listen(PORT, () => {
  console.log(`🎉 Minimal server running on http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth endpoints available at /api/auth/*`);
});