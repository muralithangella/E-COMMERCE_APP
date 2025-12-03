const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const KafkaManager = require('../config/kafka');

class PaymentService {
  async createPaymentIntent(amount, currency, orderId, userId) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        metadata: { orderId, userId }
      });

      const payment = new Payment({
        order: orderId,
        user: userId,
        amount,
        currency: currency.toUpperCase(),
        method: 'stripe',
        gateway: {
          provider: 'stripe',
          paymentIntentId: paymentIntent.id
        }
      });

      await payment.save();

      await KafkaManager.publishPaymentEvent('PAYMENT_INTENT_CREATED', {
        paymentId: payment._id,
        paymentIntentId: paymentIntent.id,
        orderId,
        amount
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentId: payment._id
      };
    } catch (error) {
      console.error('Payment intent creation failed:', error);
      throw error;
    }
  }

  async confirmPayment(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      const payment = await Payment.findOne({
        'gateway.paymentIntentId': paymentIntentId
      });

      if (!payment) {
        throw new Error('Payment not found');
      }

      if (paymentIntent.status === 'succeeded') {
        payment.status = 'completed';
        payment.processedAt = new Date();
        payment.gateway.transactionId = paymentIntent.charges.data[0]?.id;
        
        await payment.save();

        await KafkaManager.publishPaymentEvent('PAYMENT_SUCCEEDED', {
          paymentId: payment._id,
          orderId: payment.order,
          amount: payment.amount,
          transactionId: payment.gateway.transactionId
        });
      }

      return payment;
    } catch (error) {
      console.error('Payment confirmation failed:', error);
      throw error;
    }
  }

  async processRefund(paymentId, amount = null, reason = 'requested_by_customer') {
    try {
      const payment = await Payment.findById(paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      const refundAmount = amount ? Math.round(amount * 100) : undefined;
      
      const refund = await stripe.refunds.create({
        payment_intent: payment.gateway.paymentIntentId,
        amount: refundAmount,
        reason
      });

      payment.refunds.push({
        amount: refund.amount / 100,
        reason,
        refundId: refund.id,
        processedAt: new Date()
      });

      if (!amount || amount >= payment.amount) {
        payment.status = 'refunded';
      }

      await payment.save();

      await KafkaManager.publishPaymentEvent('PAYMENT_REFUNDED', {
        paymentId: payment._id,
        orderId: payment.order,
        refundAmount: refund.amount / 100,
        refundId: refund.id
      });

      return refund;
    } catch (error) {
      console.error('Refund processing failed:', error);
      throw error;
    }
  }

  async getPaymentMethods(userId) {
    try {
      const payments = await Payment.find({
        user: userId,
        status: 'completed'
      }).select('gateway.transactionId createdAt').limit(5);

      return payments;
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
      throw error;
    }
  }
}

module.exports = new PaymentService();