module.exports = {
  USER_ROLES: {
    CUSTOMER: 'customer',
    ADMIN: 'admin',
    VENDOR: 'vendor'
  },

  ORDER_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    RETURNED: 'returned'
  },

  PAYMENT_STATUS: {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded'
  },

  PAYMENT_METHODS: {
    CREDIT_CARD: 'credit_card',
    DEBIT_CARD: 'debit_card',
    PAYPAL: 'paypal',
    STRIPE: 'stripe',
    CASH_ON_DELIVERY: 'cash_on_delivery'
  },

  PRODUCT_STATUS: {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    ARCHIVED: 'archived'
  },

  NOTIFICATION_TYPES: {
    ORDER_CONFIRMATION: 'order_confirmation',
    ORDER_SHIPPED: 'order_shipped',
    ORDER_DELIVERED: 'order_delivered',
    PAYMENT_SUCCESS: 'payment_success',
    PAYMENT_FAILED: 'payment_failed',
    LOW_STOCK: 'low_stock',
    WELCOME: 'welcome',
    PROMOTION: 'promotion'
  },

  COUPON_TYPES: {
    PERCENTAGE: 'percentage',
    FIXED_AMOUNT: 'fixed_amount',
    FREE_SHIPPING: 'free_shipping'
  },

  KAFKA_TOPICS: {
    ORDER_EVENTS: 'order-events',
    PAYMENT_EVENTS: 'payment-events',
    INVENTORY_EVENTS: 'inventory-events',
    USER_EVENTS: 'user-events',
    NOTIFICATION_EVENTS: 'notification-events'
  },

  CACHE_KEYS: {
    PRODUCT: 'product:',
    CATEGORY: 'categories:all',
    USER_SESSION: 'session:',
    CART: 'cart:',
    DASHBOARD_STATS: 'dashboard:stats'
  },

  DEFAULT_VALUES: {
    PAGINATION_LIMIT: 20,
    CACHE_TTL: 300,
    JWT_EXPIRE: '15m',
    JWT_REFRESH_EXPIRE: '7d',
    TAX_RATE: 0.08,
    FREE_SHIPPING_THRESHOLD: 50,
    SHIPPING_COST: 10
  }
};