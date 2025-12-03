const KafkaManager = require('../config/kafka');
const Order = require('../models/Order');
const User = require('../models/User');
const NotificationService = require('../services/notificationService');
const EmailService = require('../services/emailService');
const InventoryService = require('../services/inventoryService');

class OrderWorker {
  async start() {
    console.log('Starting Order Worker...');
    
    await KafkaManager.consumeEvents(
      'order-worker-group',
      ['order-events'],
      this.handleOrderEvent.bind(this)
    );
  }

  async handleOrderEvent(topic, message) {
    const { eventType, data } = message;
    
    try {
      switch (eventType) {
        case 'ORDER_CREATED':
          await this.handleOrderCreated(data);
          break;
        case 'ORDER_STATUS_UPDATED':
          await this.handleOrderStatusUpdated(data);
          break;
        case 'ORDER_CANCELLED':
          await this.handleOrderCancelled(data);
          break;
        default:
          console.log(`Unhandled order event: ${eventType}`);
      }
    } catch (error) {
      console.error(`Error processing order event ${eventType}:`, error);
    }
  }

  async handleOrderCreated(data) {
    const { orderId, customerId } = data;
    
    const [order, user] = await Promise.all([
      Order.findById(orderId).populate('items.product'),
      User.findById(customerId)
    ]);

    if (order && user) {
      // Send order confirmation email
      await EmailService.sendOrderConfirmation(order, user);
      
      // Create notification
      await NotificationService.sendOrderNotification(order, user, 'order_confirmation');
      
      console.log(`Order confirmation sent for order ${order.orderNumber}`);
    }
  }

  async handleOrderStatusUpdated(data) {
    const { orderId, status } = data;
    
    const order = await Order.findById(orderId).populate('customer');
    
    if (order && order.customer) {
      if (status === 'shipped') {
        await NotificationService.sendOrderNotification(order, order.customer, 'order_shipped');
      } else if (status === 'delivered') {
        await NotificationService.sendOrderNotification(order, order.customer, 'order_delivered');
      }
      
      console.log(`Order status notification sent for order ${order.orderNumber}: ${status}`);
    }
  }

  async handleOrderCancelled(data) {
    const { orderId } = data;
    
    const order = await Order.findById(orderId).populate('customer');
    
    if (order && order.customer) {
      // Release inventory
      await InventoryService.releaseStock(order.items, orderId);
      
      console.log(`Order cancelled and inventory released for order ${order.orderNumber}`);
    }
  }
}

module.exports = new OrderWorker();