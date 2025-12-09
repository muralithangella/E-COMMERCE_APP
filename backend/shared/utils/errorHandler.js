/**
 * Standardized Error Handling Utility
 * Used across all microservices for consistent error responses
 */

class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, 400);
    this.errors = errors;
    this.type = 'validation';
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
    this.type = 'not_found';
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
    this.type = 'unauthorized';
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden access') {
    super(message, 403);
    this.type = 'forbidden';
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
    this.type = 'conflict';
  }
}

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Send error response
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
      ...(err.type && { type: err.type }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  } else {
    // Programming or unknown error
    res.status(500).json({
      success: false,
      status: 'error',
      message: process.env.NODE_ENV === 'production' 
        ? 'Something went wrong' 
        : err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }
};

/**
 * Async handler wrapper to catch errors
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 handler
 */
const notFoundHandler = (req, res, next) => {
  const err = new NotFoundError(`Route ${req.originalUrl}`);
  next(err);
};

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  errorHandler,
  asyncHandler,
  notFoundHandler
};

