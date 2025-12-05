const { errorResponse } = require('../utils/responseHandler');
const logger = require('../utils/logger');

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    logger.error('Async handler error:', {
      error: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Handle different error types
    if (error.name === 'ValidationError') {
      return errorResponse(res, 'Validation failed', 400, error.errors);
    }
    
    if (error.name === 'NotFoundError') {
      return errorResponse(res, error.message, 404);
    }
    
    if (error.name === 'UnauthorizedError') {
      return errorResponse(res, 'Unauthorized access', 401);
    }
    
    if (error.code === 11000) {
      return errorResponse(res, 'Duplicate entry found', 409);
    }

    // Default server error
    return errorResponse(res, 'Internal server error', 500);
  });
};

module.exports = { asyncHandler };