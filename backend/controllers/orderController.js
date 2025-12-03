const Order = require('../models/Order');
const KafkaManager = require('../config/kafka');
const RabbitMQManager = require('../config/rabbitmq');
const NotificationService = require('../services/notificationService');

const createOrder = async (req, res) => {
  try {
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const orderData = {
      ...req.body,
      orderNumber,
      customer: req.user?.id || 'guest',
      status: 'confirmed',
      orderDate: new Date(),
      estimatedDelivery: new Date(Date.now() + 7*24*60*60*1000)
    };
    
    // Mock order creation for demo
    const order = {
      id: orderNumber,
      ...orderData,
      _id: orderNumber
    };
    
    // Publish to RabbitMQ for async processing
    await RabbitMQManager.publishMessage('orders', 'order.created', {
      orderId: order.id,
      orderNumber,
      order: orderData
    });
    
    // Send notifications
    if (req.body.userEmail) {
      await NotificationService.sendOrderConfirmation(
        order, 
        req.body.userEmail, 
        req.body.userPhone
      );
    }
    
    res.status(201).json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(400).json({ message: 'Failed to create order', error: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = { customer: req.user.id };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('items.product', 'name price images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);
    
    res.json({ orders, total, totalPages: Math.ceil(total / limit), currentPage: page });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    // Mock order retrieval - in production, fetch from database
    const mockOrder = {
      id: req.params.id,
      orderNumber: req.params.id,
      status: 'confirmed',
      orderDate: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7*24*60*60*1000).toISOString(),
      items: [
        {
          id: '1',
          name: 'Sample Product',
          price: 99.99,
          quantity: 1,
          image: 'https://via.placeholder.com/100'
        }
      ],
      subtotal: 99.99,
      shipping: 0,
      tax: 8.00,
      total: 107.99,
      shippingAddress: {
        fullName: 'John Doe',
        addressLine1: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        phone: '(555) 123-4567'
      },
      paymentMethod: {
        cardNumber: '****1234',
        nameOnCard: 'John Doe'
      }
    };
    
    res.json(mockOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Mock order update
    const order = {
      id: req.params.id,
      orderNumber: req.params.id,
      status,
      updatedAt: new Date()
    };

    // Publish status update to RabbitMQ
    await RabbitMQManager.publishMessage('orders', 'order.updated', { 
      orderId: order.id, 
      status, 
      orderNumber: order.orderNumber 
    });
    
    // Send notification for status update
    await NotificationService.sendOrderStatusUpdate(
      order,
      'customer@example.com', // In production, get from order data
      '+1234567890', // In production, get from order data
      status
    );
    
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update order', error: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.status !== 'pending' && order.status !== 'confirmed') {
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }
    
    order.status = 'cancelled';
    await order.save();
    
    await KafkaManager.publishOrderEvent('ORDER_CANCELLED', { 
      orderId: order._id, 
      orderNumber: order.orderNumber 
    });
    
    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel order', error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
};