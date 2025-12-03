export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  PRODUCTS: '/api/products',
  CATEGORIES: '/api/categories',
  CART: '/api/cart',
  ORDERS: '/api/orders',
  USERS: '/api/users',
  REVIEWS: '/api/reviews',
  PAYMENTS: '/api/payments'
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  VENDOR: 'vendor'
};

export const PRODUCT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
};