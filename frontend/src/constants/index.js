export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
  RETRY_ATTEMPTS: parseInt(process.env.REACT_APP_RETRY_ATTEMPTS) || 3,
  CACHE_DURATION: parseInt(process.env.REACT_APP_CACHE_DURATION) || 300000,
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: parseInt(process.env.REACT_APP_DEFAULT_LIMIT) || 20,
  MAX_LIMIT: parseInt(process.env.REACT_APP_MAX_LIMIT) || 100,
};

export const FILTERS = {
  PRICE_RANGE: {
    MIN: parseInt(process.env.REACT_APP_MIN_PRICE) || 0,
    MAX: parseInt(process.env.REACT_APP_MAX_PRICE) || 1000000,
  },
  RATING_RANGE: {
    MIN: parseFloat(process.env.REACT_APP_MIN_RATING) || 0,
    MAX: parseFloat(process.env.REACT_APP_MAX_RATING) || 5,
  },
  DEBOUNCE_DELAY: parseInt(process.env.REACT_APP_DEBOUNCE_DELAY) || 300,
};

export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popularity', label: 'Popularity' },
];

export const BREAKPOINTS = {
  MOBILE: parseInt(process.env.REACT_APP_MOBILE_BREAKPOINT) || 768,
  TABLET: parseInt(process.env.REACT_APP_TABLET_BREAKPOINT) || 1024,
  DESKTOP: parseInt(process.env.REACT_APP_DESKTOP_BREAKPOINT) || 1200,
};

export const GRID_CONFIG = {
  ITEM_HEIGHT: parseInt(process.env.REACT_APP_GRID_ITEM_HEIGHT) || 400,
  ITEM_WIDTH: parseInt(process.env.REACT_APP_GRID_ITEM_WIDTH) || 280,
  GAP: parseInt(process.env.REACT_APP_GRID_GAP) || 20,
};

export const CACHE_KEYS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  USER_PROFILE: 'userProfile',
  CART: 'cart',
  WISHLIST: 'wishlist',
  SEARCH_HISTORY: 'searchHistory',
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
};