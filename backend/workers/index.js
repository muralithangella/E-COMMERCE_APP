const OrderWorker = require('./orderWorker');
const PaymentWorker = require('./paymentWorker');
const InventoryWorker = require('./inventoryWorker');
const NotificationWorker = require('./notificationWorker');
const AnalyticsWorker = require('./analyticsWorker');
const ScheduledTasks = require('./scheduledTasks');
const WorkerManager = require('./worker');

module.exports = {
  OrderWorker,
  PaymentWorker,
  InventoryWorker,
  NotificationWorker,
  AnalyticsWorker,
  ScheduledTasks,
  WorkerManager
};