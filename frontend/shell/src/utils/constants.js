// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
};

// Application Constants
export const APP_CONFIG = {
  NAME: 'Amazon-Style E-Commerce',
  VERSION: '1.0.0',
  CURRENCY: 'INR',
  CURRENCY_SYMBOL: '₹',
  FREE_SHIPPING_THRESHOLD: 499,
  SHIPPING_COST: 40,
  TAX_RATE: 0.08
};

// Product Categories
export const CATEGORIES = {
  MOBILES: 'Mobiles',
  ELECTRONICS: 'Electronics',
  FASHION: 'Fashion',
  HOME_KITCHEN: 'Home & Kitchen',
  BOOKS: 'Books',
  SPORTS: 'Sports, Fitness & Outdoors',
  BEAUTY: 'Beauty & Personal Care',
  TOYS: 'Toys & Games',
  GROCERY: 'Grocery & Gourmet Foods',
  HEALTH: 'Health & Household',
  AUTOMOTIVE: 'Car & Motorbike',
  BABY: 'Baby'
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Payment Methods
export const PAYMENT_METHODS = {
  CARD: 'card',
  UPI: 'upi',
  NET_BANKING: 'net_banking',
  COD: 'cod'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  CART: 'cart',
  USER: 'user',
  TOKEN: 'token',
  LAST_ORDER: 'lastOrder',
  PREFERENCES: 'userPreferences'
};

// Category Colors for UI
export const CATEGORY_COLORS = {
  [CATEGORIES.MOBILES]: '#4A90E2',
  [CATEGORIES.ELECTRONICS]: '#6C5CE7',
  [CATEGORIES.FASHION]: '#E74C3C',
  [CATEGORIES.HOME_KITCHEN]: '#F39C12',
  [CATEGORIES.BOOKS]: '#27AE60',
  [CATEGORIES.SPORTS]: '#BD10E0',
  [CATEGORIES.BEAUTY]: '#FF69B4',
  [CATEGORIES.TOYS]: '#FFD700',
  [CATEGORIES.GROCERY]: '#45B7D1',
  [CATEGORIES.HEALTH]: '#4ECDC4',
  [CATEGORIES.AUTOMOTIVE]: '#96CEB4',
  [CATEGORIES.BABY]: '#FF6B6B'
};

export default {
  API_CONFIG,
  APP_CONFIG,
  CATEGORIES,
  ORDER_STATUS,
  PAYMENT_METHODS,
  STORAGE_KEYS,
  CATEGORY_COLORS
};