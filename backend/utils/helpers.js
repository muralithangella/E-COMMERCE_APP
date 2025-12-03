const crypto = require('crypto');

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

const generateSKU = (productName, categoryName) => {
  const nameCode = productName.substring(0, 3).toUpperCase();
  const categoryCode = categoryName.substring(0, 2).toUpperCase();
  const randomCode = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${categoryCode}-${nameCode}-${randomCode}`;
};

const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `ORD-${timestamp.slice(-8)}-${random}`;
};

const generateCouponCode = (length = 8) => {
  return crypto.randomBytes(length).toString('hex').toUpperCase().substring(0, length);
};

const formatPrice = (price) => {
  return parseFloat(price).toFixed(2);
};

const calculateDiscount = (originalPrice, discountPercent) => {
  return originalPrice * (discountPercent / 100);
};

const calculateTax = (amount, taxRate = 0.08) => {
  return amount * taxRate;
};

const calculateShipping = (amount, freeShippingThreshold = 50, shippingCost = 10) => {
  return amount >= freeShippingThreshold ? 0 : shippingCost;
};

const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

const generateRandomString = (length = 10) => {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
};

const hashString = (str) => {
  return crypto.createHash('sha256').update(str).digest('hex');
};

const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date);
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const formatDate = (date, locale = 'en-US') => {
  return new Intl.DateTimeFormat(locale).format(new Date(date));
};

const paginate = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null
  };
};

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  generateSlug,
  generateSKU,
  generateOrderNumber,
  generateCouponCode,
  formatPrice,
  calculateDiscount,
  calculateTax,
  calculateShipping,
  formatCurrency,
  generateRandomString,
  hashString,
  isValidDate,
  addDays,
  formatDate,
  paginate,
  debounce,
  asyncHandler
};