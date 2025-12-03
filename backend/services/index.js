const BaseService = require('./baseService');
const AuthService = require('./authService');
const EmailService = require('./emailService');
const PaymentService = require('./paymentService');
const InventoryService = require('./inventoryService');
const OrderService = require('./orderService');
const ProductService = require('./productService');
const NotificationService = require('./notificationService');
const CacheService = require('./cacheService');

module.exports = {
  BaseService,
  AuthService,
  EmailService,
  PaymentService,
  InventoryService,
  OrderService,
  ProductService,
  NotificationService,
  CacheService
};