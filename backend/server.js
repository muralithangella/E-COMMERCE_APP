require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { morganMiddleware } = require('./middleware/logger');
const { securityHeaders, corsOptions, sanitizeInput, preventNoSQLInjection, validateApiKey } = require('./middleware/security');
const { dynamicCompression, responseCache, queryOptimization, memoryMonitor, responseTime } = require('./middleware/performance');
const { enhancedAuthenticate, deviceFingerprint, suspiciousActivityDetection } = require('./middleware/advancedAuth');
const { apiLimiter } = require('./middleware/rateLimiter');
const { healthCheckMiddleware, readinessCheck, livenessCheck } = require('./middleware/healthCheck');
const DatabaseManager = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Performance monitoring
app.use(responseTime);
app.use(memoryMonitor);

// Security middleware
app.use(securityHeaders);
app.use(corsOptions);
app.use(sanitizeInput);
app.use(preventNoSQLInjection);
app.use(deviceFingerprint);

// Rate limiting
app.use('/api', apiLimiter);

// Compression
app.use(dynamicCompression);

// Logging
app.use(morganMiddleware);

// Body parsing with size limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Query optimization
app.use(queryOptimization);

// Health checks
app.get('/health', healthCheckMiddleware);
app.get('/ready', readinessCheck);
app.get('/live', livenessCheck);

// API routes with caching
app.use('/api', responseCache(300), routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    // Connect to databases
    await DatabaseManager.connectMongoDB();
    await DatabaseManager.connectRedis();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`E-commerce API Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await DatabaseManager.closeConnections();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down server...');
  await DatabaseManager.closeConnections();
  process.exit(0);
});

if (require.main === module) {
  startServer();
}

module.exports = app;