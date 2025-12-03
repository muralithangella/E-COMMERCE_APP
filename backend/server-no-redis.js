require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { morganMiddleware } = require('./middleware/logger');
const { securityHeaders, corsOptions } = require('./middleware/security');
const DatabaseManager = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(securityHeaders);
app.use(corsOptions);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(morganMiddleware);

// Health checks
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    redis: 'skipped'
  });
});

app.get('/ready', (req, res) => {
  res.json({ status: 'ready', redis: 'skipped' });
});

// API routes
app.use('/api', routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    // Only connect to MongoDB
    await DatabaseManager.connectMongoDB();
    console.log('✅ MongoDB connected');
    
    app.listen(PORT, () => {
      console.log(`🚀 E-commerce API Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔍 Test endpoints: npm run test:endpoints`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();