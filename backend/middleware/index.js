const { authenticate, authorize } = require('./auth');
const { errorHandler, notFound } = require('./errorHandler');
const { validateRegister, validateLogin, validateProduct, validateOrder } = require('./validation');
const { authLimiter, apiLimiter, strictLimiter, paymentLimiter } = require('./rateLimiter');
const { cache, invalidateCache } = require('./cache');
const { logger, morganMiddleware, requestLogger } = require('./logger');
const { securityHeaders, corsOptions, sanitizeInput } = require('./security');
const { uploadSingle, uploadMultiple, handleUploadError } = require('./upload');
const { pagination } = require('./pagination');

module.exports = {
  // Authentication & Authorization
  authenticate,
  authorize,
  
  // Error Handling
  errorHandler,
  notFound,
  
  // Validation
  validateRegister,
  validateLogin,
  validateProduct,
  validateOrder,
  
  // Rate Limiting
  authLimiter,
  apiLimiter,
  strictLimiter,
  paymentLimiter,
  
  // Caching
  cache,
  invalidateCache,
  
  // Logging
  logger,
  morganMiddleware,
  requestLogger,
  
  // Security
  securityHeaders,
  corsOptions,
  sanitizeInput,
  
  // File Upload
  uploadSingle,
  uploadMultiple,
  handleUploadError,
  
  // Pagination
  pagination
};