const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

const validateRegister = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must be 8+ chars with uppercase, lowercase, and number'),
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  handleValidationErrors
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  handleValidationErrors
];

const validateProduct = [
  body('name').trim().isLength({ min: 1, max: 200 }),
  body('price.regular').isFloat({ min: 0 }),
  body('description').trim().isLength({ min: 1, max: 2000 }),
  handleValidationErrors
];

const validateOrder = [
  body('items').isArray({ min: 1 }).withMessage('Order must have at least one item'),
  body('items.*.productId').notEmpty().withMessage('Product ID required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be positive'),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateProduct,
  validateOrder,
  handleValidationErrors
};