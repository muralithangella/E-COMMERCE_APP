class ResponseHandler {
  static success(res, data = null, message = 'Success', statusCode = 200, meta = {}) {
    const response = {
      success: true,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: res.locals.requestId,
        ...meta
      }
    };

    return res.status(statusCode).json(response);
  }

  static error(res, message = 'Error', statusCode = 500, errors = null, meta = {}) {
    const response = {
      success: false,
      message,
      errors,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: res.locals.requestId,
        ...meta
      }
    };

    return res.status(statusCode).json(response);
  }

  static paginated(res, data, pagination, message = 'Success') {
    return this.success(res, data, message, 200, { pagination });
  }
}

const successResponse = (res, data, message, statusCode, meta) => 
  ResponseHandler.success(res, data, message, statusCode, meta);

const errorResponse = (res, message, statusCode, errors, meta) => 
  ResponseHandler.error(res, message, statusCode, errors, meta);

const paginatedResponse = (res, data, pagination, message) => 
  ResponseHandler.paginated(res, data, pagination, message);

module.exports = {
  ResponseHandler,
  successResponse,
  errorResponse,
  paginatedResponse
};