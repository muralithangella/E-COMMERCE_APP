require('dotenv').config({ path: '../../.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('../../routes/authRoutes');
const { errorHandler } = require('../../middleware/errorHandler');
const DatabaseManager = require('../../config/database');

const app = express();
const PORT = process.env.AUTH_SERVICE_PORT || 3009;

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4001'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Test endpoint
app.post('/api/auth/test', (req, res) => {
  res.json({ message: 'Auth service is working', body: req.body });
});



// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'auth-service' });
});

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await DatabaseManager.connect();
    console.log('✅ Auth service connected to MongoDB');
    
    app.listen(PORT, () => {
      console.log(`✅ Auth Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start auth service:', error);
    // Start without database if connection fails
    app.listen(PORT, () => {
      console.log(`⚠️ Auth Service running on port ${PORT} (no database)`);
    });
  }
};

startServer();

module.exports = app;