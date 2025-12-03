const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

const errorResponse = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString()
  });
};

const paginatedResponse = (res, data, pagination, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination,
    timestamp: new Date().toISOString()
  });
};

const validationErrorResponse = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors: Array.isArray(errors) ? errors : [errors],
    timestamp: new Date().toISOString()
  });
};

const unauthorizedResponse = (res, message = 'Unauthorized access') => {
  return res.status(401).json({
    success: false,
    message,
    timestamp: new Date().toISOString()
  });
};

const forbiddenResponse = (res, message = 'Forbidden access') => {
  return res.status(403).json({
    success: false,
    message,
    timestamp: new Date().toISOString()
  });
};

const notFoundResponse = (res, message = 'Resource not found') => {
  return res.status(404).json({
    success: false,
    message,
    timestamp: new Date().toISOString()
  });
};

const conflictResponse = (res, message = 'Resource conflict') => {
  return res.status(409).json({
    success: false,
    message,
    timestamp: new Date().toISOString()
  });
};

const tooManyRequestsResponse = (res, message = 'Too many requests') => {
  return res.status(429).json({
    success: false,
    message,
    timestamp: new Date().toISOString()
  });
};

const createdResponse = (res, data, message = 'Resource created successfully') => {
  return successResponse(res, data, message, 201);
};

const noContentResponse = (res) => {
  return res.status(204).send();
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
  validationErrorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  conflictResponse,
  tooManyRequestsResponse,
  createdResponse,
  noContentResponse
};