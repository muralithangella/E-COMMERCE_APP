const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Rate limiting configurations
const createRateLimit = (windowMs, max, message) => rateLimit({
  windowMs,
  max,
  message: { error: message },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = createRateLimit(15 * 60 * 1000, 5, 'Too many auth attempts');
const apiLimiter = createRateLimit(15 * 60 * 1000, 100, 'Too many requests');
const strictLimiter = createRateLimit(15 * 60 * 1000, 10, 'Rate limit exceeded');

// Security middleware
const securityMiddleware = [
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }),
  mongoSanitize(),
  xss(),
  hpp(),
];

module.exports = {
  authLimiter,
  apiLimiter,
  strictLimiter,
  securityMiddleware
};