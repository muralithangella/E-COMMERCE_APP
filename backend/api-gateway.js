require('dotenv').config();
const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const Redis = require('ioredis');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
const PORT = process.env.GATEWAY_PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Redis client
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: (times) => Math.min(times * 50, 2000)
});

redis.on('connect', () => console.log('✅ Redis connected'));
redis.on('error', (err) => console.log('❌ Redis error:', err.message));

// Service registry
const services = {
  auth: process.env.AUTH_SERVICE_URL || 'https://localhost:5005',
  products: process.env.PRODUCT_SERVICE_URL || 'https://localhost:5001',
  cart: process.env.CART_SERVICE_URL || 'https://localhost:5002',
  orders: process.env.ORDER_SERVICE_URL || 'https://localhost:5003',
  notification: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5004',
  main: process.env.MAIN_SERVICE_URL || 'https://localhost:5000'
};

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://www.localhost:3000', 'https://localhost:3000', 'https://www.localhost:3000'],
  credentials: true
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { success: false, message: 'Too many requests, please try again later' }
});

// Strict rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts, please try again later' }
});

// API rate limiter per user
const createUserLimiter = (maxRequests = 100) => async (req, res, next) => {
  const userId = req.user?.id || req.ip;
  const key = `ratelimit:${userId}`;
  
  try {
    const requests = await redis.incr(key);
    if (requests === 1) {
      await redis.expire(key, 900); // 15 minutes
    }
    
    if (requests > maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Rate limit exceeded'
      });
    }
    
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - requests));
    next();
  } catch (error) {
    next();
  }
};

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.accessToken;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // Check token in Redis cache
    const cachedUser = await redis.get(`auth:${token}`);
    if (cachedUser) {
      req.user = JSON.parse(cachedUser);
      return next();
    }
    
    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    
    // Cache user for 15 minutes
    await redis.setex(`auth:${token}`, 900, JSON.stringify(decoded));
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }
    
    next();
  };
};

// Cache middleware
const cacheMiddleware = (duration = 300) => async (req, res, next) => {
  if (req.method !== 'GET') {
    return next();
  }
  
  const key = `cache:${req.originalUrl}`;
  
  try {
    const cached = await redis.get(key);
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(JSON.parse(cached));
    }
    
    res.setHeader('X-Cache', 'MISS');
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      redis.setex(key, duration, JSON.stringify(data));
      originalJson(data);
    };
    next();
  } catch (error) {
    next();
  }
};

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// Health check
app.get('/health', async (req, res) => {
  const redisStatus = redis.status === 'ready' ? 'Connected' : 'Disconnected';
  res.json({
    status: 'OK',
    gateway: 'API Gateway v1.0',
    protocol: req.protocol,
    encrypted: req.connection.encrypted ? 'Yes' : 'No',
    redis: redisStatus,
    timestamp: new Date().toISOString()
  });
});

// Proxy helper
const proxyRequest = async (req, res, serviceUrl) => {
  try {
    const config = {
      method: req.method,
      url: `${serviceUrl}${req.path}`,
      headers: {
        ...req.headers,
        host: new URL(serviceUrl).host
      },
      data: req.body,
      params: req.query,
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    };
    
    delete config.headers['host'];
    delete config.headers['content-length'];
    
    const response = await axios(config);
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data || { success: false, message: 'Service unavailable' };
    res.status(status).json(message);
  }
};

// Auth routes (public)
app.post('/api/auth/login', authLimiter, (req, res) => proxyRequest(req, res, services.main));
app.post('/api/auth/register', authLimiter, (req, res) => proxyRequest(req, res, services.main));
app.post('/api/auth/forgot-password', authLimiter, (req, res) => proxyRequest(req, res, services.main));
app.post('/api/auth/reset-password', authLimiter, (req, res) => proxyRequest(req, res, services.main));
app.get('/api/auth/google', (req, res) => proxyRequest(req, res, services.main));
app.get('/api/auth/google/callback', (req, res) => proxyRequest(req, res, services.main));

// Auth routes (protected)
app.post('/api/auth/logout', authenticate, (req, res) => proxyRequest(req, res, services.main));
app.post('/api/auth/refresh', (req, res) => proxyRequest(req, res, services.main));

// Product routes (public with cache)
app.get('/api/products', globalLimiter, cacheMiddleware(300), (req, res) => proxyRequest(req, res, services.main));
app.get('/api/products/:id', globalLimiter, cacheMiddleware(600), (req, res) => proxyRequest(req, res, services.main));
app.get('/api/categories', globalLimiter, cacheMiddleware(3600), (req, res) => proxyRequest(req, res, services.main));
app.get('/api/deals', globalLimiter, cacheMiddleware(300), (req, res) => proxyRequest(req, res, services.main));
app.get('/api/recommendations', globalLimiter, cacheMiddleware(300), (req, res) => proxyRequest(req, res, services.main));

// Cart routes (protected)
app.get('/api/cart', authenticate, createUserLimiter(200), (req, res) => proxyRequest(req, res, services.main));
app.post('/api/cart/add', authenticate, createUserLimiter(200), (req, res) => proxyRequest(req, res, services.main));
app.put('/api/cart/items/:id', authenticate, createUserLimiter(200), (req, res) => proxyRequest(req, res, services.main));
app.delete('/api/cart/items/:id', authenticate, createUserLimiter(200), (req, res) => proxyRequest(req, res, services.main));
app.delete('/api/cart/clear', authenticate, createUserLimiter(200), (req, res) => proxyRequest(req, res, services.main));

// Order routes (protected)
app.get('/api/orders', authenticate, createUserLimiter(100), (req, res) => proxyRequest(req, res, services.main));
app.post('/api/orders', authenticate, createUserLimiter(50), (req, res) => proxyRequest(req, res, services.main));
app.get('/api/orders/:id', authenticate, createUserLimiter(100), (req, res) => proxyRequest(req, res, services.main));

// Admin routes (protected + authorized)
app.post('/api/products', authenticate, authorize('admin'), (req, res) => proxyRequest(req, res, services.main));
app.put('/api/products/:id', authenticate, authorize('admin'), (req, res) => proxyRequest(req, res, services.main));
app.delete('/api/products/:id', authenticate, authorize('admin'), (req, res) => proxyRequest(req, res, services.main));

// Cache management endpoints
app.post('/api/cache/clear', authenticate, authorize('admin'), async (req, res) => {
  try {
    const pattern = req.body.pattern || 'cache:*';
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    res.json({ success: true, message: `Cleared ${keys.length} cache entries` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to clear cache' });
  }
});

// Metrics endpoint
app.get('/api/metrics', authenticate, authorize('admin'), async (req, res) => {
  try {
    const info = await redis.info();
    res.json({
      success: true,
      redis: {
        connected: redis.status === 'ready',
        info: info
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch metrics' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Gateway error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal gateway error'
  });
});

// Start server
const certPath = path.join(__dirname, 'certs/cert.pem');
const keyPath = path.join(__dirname, 'certs/key.pem');

if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
  const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  };
  https.createServer(options, app).listen(PORT, () => {
    console.log(`🚀 API Gateway running on https://localhost:${PORT}`);
    console.log(`🔒 HTTPS enabled - All traffic encrypted`);
    console.log(`⚡ Redis caching enabled`);
    console.log(`🛡️  Rate limiting active`);
    console.log(`🔐 Authentication & Authorization enabled`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`🚀 API Gateway running on http://localhost:${PORT}`);
  });
}

module.exports = app;
