const validator = require('validator');

const validateEmail = (email) => {
  return validator.isEmail(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validatePhoneNumber = (phone) => {
  return validator.isMobilePhone(phone);
};

const validateURL = (url) => {
  return validator.isURL(url);
};

const validateMongoId = (id) => {
  return validator.isMongoId(id);
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return validator.escape(input.trim());
};

const validateProductData = (product) => {
  const errors = [];
  
  if (!product.name || product.name.trim().length < 1) {
    errors.push('Product name is required');
  }
  
  if (!product.price || product.price.regular <= 0) {
    errors.push('Valid price is required');
  }
  
  if (!product.sku || product.sku.trim().length < 1) {
    errors.push('SKU is required');
  }
  
  if (!validateMongoId(product.category)) {
    errors.push('Valid category ID is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateOrderData = (order) => {
  const errors = [];
  
  if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
    errors.push('Order must contain at least one item');
  }
  
  if (order.items) {
    order.items.forEach((item, index) => {
      if (!validateMongoId(item.product)) {
        errors.push(`Item ${index + 1}: Invalid product ID`);
      }
      if (!item.quantity || item.quantity < 1) {
        errors.push(`Item ${index + 1}: Quantity must be at least 1`);
      }
    });
  }
  
  if (!order.shippingAddress || !order.shippingAddress.street) {
    errors.push('Shipping address is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateCouponData = (coupon) => {
  const errors = [];
  
  if (!coupon.code || coupon.code.trim().length < 3) {
    errors.push('Coupon code must be at least 3 characters');
  }
  
  if (!coupon.name || coupon.name.trim().length < 1) {
    errors.push('Coupon name is required');
  }
  
  if (!['percentage', 'fixed_amount', 'free_shipping'].includes(coupon.type)) {
    errors.push('Invalid coupon type');
  }
  
  if (coupon.value === undefined || coupon.value < 0) {
    errors.push('Coupon value must be non-negative');
  }
  
  if (coupon.validFrom && coupon.validUntil && new Date(coupon.validFrom) >= new Date(coupon.validUntil)) {
    errors.push('Valid from date must be before valid until date');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateURL,
  validateMongoId,
  sanitizeInput,
  validateProductData,
  validateOrderData,
  validateCouponData
};