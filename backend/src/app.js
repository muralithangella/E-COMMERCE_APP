const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');

const database = require('./config/database');
const logger = require('./utils/logger');
const { errorResponse } = require('./utils/responseHandler');

class Application {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"]
        }
      }
    }));

    // CORS with advanced options
    this.app.use(cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true,
      optionsSuccessStatus: 200
    }));

    // Compression
    this.app.use(compression({
      filter: (req, res) => {
        if (req.headers['x-no-compression']) return false;
        return compression.filter(req, res);
      }
    }));

    // Rate limiting with Redis store
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000,
      message: { error: 'Too many requests, please try again later' },
      standardHeaders: true,
      legacyHeaders: false,
      store: new (require('rate-limit-redis'))({
        client: database.getRedis()
      })
    });
    this.app.use(limiter);

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request ID middleware
    this.app.use((req, res, next) => {
      res.locals.requestId = uuidv4();
      req.requestId = res.locals.requestId;
      next();
    });

    // Request logging
    this.app.use(logger.requestLogger());

    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        requestId: res.locals.requestId
      });
    });
  }

  setupRoutes() {
    // API routes
    this.app.use('/api/products', require('./routes/productRoutes'));
    this.app.use('/api/auth', require('./routes/authRoutes'));
    this.app.use('/api/cart', require('./routes/cartRoutes'));
    this.app.use('/api/orders', require('./routes/orderRoutes'));
    this.app.use('/api/users', require('./routes/userRoutes'));

    // 404 handler
    this.app.use('*', (req, res) => {
      errorResponse(res, `Route ${req.originalUrl} not found`, 404);
    });
  }

  setupErrorHandling() {
    // Global error handler
    this.app.use((error, req, res, next) => {
      logger.error('Unhandled error:', {
        error: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        requestId: req.requestId
      });

      if (res.headersSent) {
        return next(error);
      }

      errorResponse(res, 'Internal server error', 500);
    });

    // Graceful shutdown
    process.on('SIGTERM', this.gracefulShutdown.bind(this));
    process.on('SIGINT', this.gracefulShutdown.bind(this));
  }

  async start(port = process.env.PORT || 5000) {
    try {
      await database.connect();
      
      this.server = this.app.listen(port, () => {
        logger.info(`🚀 Amazon Replica API running on port ${port}`);
      });

      return this.server;
    } catch (error) {
      logger.error('Failed to start application:', error);
      process.exit(1);
    }
  }

  async gracefulShutdown(signal) {
    logger.info(`Received ${signal}, shutting down gracefully`);
    
    if (this.server) {
      this.server.close(async () => {
        await database.disconnect();
        logger.info('Application shut down complete');
        process.exit(0);
      });
    }
  }

  getApp() {
    return this.app;
  }
}

module.exports = Application;