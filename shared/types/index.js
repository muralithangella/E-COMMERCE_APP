// Shared type definitions and interfaces

const UserRoles = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  VENDOR: 'vendor'
};

const OrderStatus = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned'
};

const PaymentStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

const ProductStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
};

const NotificationTypes = {
  ORDER_CONFIRMATION: 'order_confirmation',
  ORDER_SHIPPED: 'order_shipped',
  ORDER_DELIVERED: 'order_delivered',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed',
  LOW_STOCK: 'low_stock',
  WELCOME: 'welcome'
};

module.exports = {
  UserRoles,
  OrderStatus,
  PaymentStatus,
  ProductStatus,
  NotificationTypes
};