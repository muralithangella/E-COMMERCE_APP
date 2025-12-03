const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const DatabaseManager = require('../config/database');

const createRateLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      return req.ip + ':' + (req.user?.id || 'anonymous');
    },
    skip: (req) => {
      // Skip rate limiting for health checks
      return req.path === '/health' || req.path === '/api/health';
    },
    handler: (req, res) => {
      console.warn('Rate limit exceeded:', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        userId: req.user?.id
      });
      res.status(429).json({ error: 'Too many requests, please try again later' });
    }
  };

  const redisClient = DatabaseManager.getRedisClient();
  if (redisClient) {
    defaultOptions.store = new RedisStore({
      sendCommand: (...args) => redisClient.call(...args),
    });
  }

  return rateLimit({ ...defaultOptions, ...options });
};

const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts, please try again later',
  skipSuccessfulRequests: true
});

const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 1000
});

const strictLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Rate limit exceeded for this endpoint'
});

const paymentLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: 'Too many payment attempts, please try again later'
});

module.exports = {
  createRateLimiter,
  authLimiter,
  apiLimiter,
  strictLimiter,
  paymentLimiter
};