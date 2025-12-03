const KafkaManager = require('../config/kafka');
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const User = require('../models/User');
const NotificationService = require('../services/notificationService');

class PaymentWorker {
  async start() {
    console.log('Starting Payment Worker...');
    
    await KafkaManager.consumeEvents(
      'payment-worker-group',
      ['payment-events'],
      this.handlePaymentEvent.bind(this)
    );
  }

  async handlePaymentEvent(topic, message) {
    const { eventType, data } = message;
    
    try {
      switch (eventType) {
        case 'PAYMENT_SUCCEEDED':
          await this.handlePaymentSucceeded(data);
          break;
        case 'PAYMENT_FAILED':
          await this.handlePaymentFailed(data);
          break;
        case 'PAYMENT_REFUNDED':
          await this.handlePaymentRefunded(data);
          break;
        default:
          console.log(`Unhandled payment event: ${eventType}`);
      }
    } catch (error) {
      console.error(`Error processing payment event ${eventType}:`, error);
    }
  }

  async handlePaymentSucceeded(data) {
    const { paymentId, orderId } = data;
    
    const [payment, order] = await Promise.all([
      Payment.findById(paymentId),
      Order.findById(orderId).populate('customer')
    ]);

    if (order && order.customer) {
      // Update order payment status
      order.payment.status = 'completed';
      order.payment.paidAt = new Date();
      order.status = 'confirmed';
      await order.save();

      // Send payment success notification
      await NotificationService.sendPaymentNotification(payment, order.customer, 'payment_success');
      
      // Publish order confirmed event
      await KafkaManager.publishOrderEvent('ORDER_CONFIRMED', {
        orderId: order._id,
        orderNumber: order.orderNumber
      });
      
      console.log(`Payment succeeded for order ${order.orderNumber}`);
    }
  }

  async handlePaymentFailed(data) {
    const { paymentId, orderId } = data;
    
    const [payment, order] = await Promise.all([
      Payment.findById(paymentId),
      Order.findById(orderId).populate('customer')
    ]);

    if (order && order.customer) {
      // Update order payment status
      order.payment.status = 'failed';
      await order.save();

      // Send payment failed notification
      await NotificationService.sendPaymentNotification(payment, order.customer, 'payment_failed');
      
      console.log(`Payment failed for order ${order.orderNumber}`);
    }
  }

  async handlePaymentRefunded(data) {
    const { paymentId, orderId, refundAmount } = data;
    
    const order = await Order.findById(orderId).populate('customer');
    
    if (order && order.customer) {
      // Update order status if fully refunded
      if (refundAmount >= order.pricing.total) {
        order.status = 'returned';
        await order.save();
      }
      
      console.log(`Payment refunded for order ${order.orderNumber}: $${refundAmount}`);
    }
  }
}

module.exports = new PaymentWorker();