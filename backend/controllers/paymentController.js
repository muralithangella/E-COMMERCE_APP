const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const KafkaManager = require('../config/kafka');

const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'usd', orderId } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: { orderId, userId: req.user.id }
    });
    
    await KafkaManager.publishPaymentEvent('PAYMENT_INTENT_CREATED', {
      paymentId: paymentIntent.id,
      orderId,
      amount,
      currency
    });
    
    res.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create payment intent', error: error.message });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      await KafkaManager.publishPaymentEvent('PAYMENT_SUCCEEDED', {
        paymentId: paymentIntent.id,
        orderId: paymentIntent.metadata.orderId,
        amount: paymentIntent.amount / 100
      });
      
      res.json({ status: 'succeeded', paymentIntent });
    } else {
      res.json({ status: paymentIntent.status, paymentIntent });
    }
  } catch (error) {
    res.status(400).json({ message: 'Failed to confirm payment', error: error.message });
  }
};

const getPaymentMethods = async (req, res) => {
  try {
    const customer = await stripe.customers.list({
      email: req.user.email,
      limit: 1
    });
    
    if (customer.data.length === 0) {
      return res.json({ paymentMethods: [] });
    }
    
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customer.data[0].id,
      type: 'card'
    });
    
    res.json({ paymentMethods: paymentMethods.data });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch payment methods', error: error.message });
  }
};

const processRefund = async (req, res) => {
  try {
    const { paymentIntentId, amount } = req.body;
    
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined
    });
    
    await KafkaManager.publishPaymentEvent('PAYMENT_REFUNDED', {
      paymentId: paymentIntentId,
      refundId: refund.id,
      amount: refund.amount / 100
    });
    
    res.json({ refund });
  } catch (error) {
    res.status(400).json({ message: 'Failed to process refund', error: error.message });
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  getPaymentMethods,
  processRefund
};