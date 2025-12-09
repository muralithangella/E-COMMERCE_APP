const { publishEvent } = require('../utils/rabbitmq');

exports.createOrder = async (req, res) => {
  try {
    const orderNumber = `ORD-${Date.now()}`;
    const orderData = { orderNumber, status: 'confirmed', ...req.body };
    
    // Publish to RabbitMQ
    try {
      await publishEvent('ORDER_CREATED', orderData);
      console.log('✅ Order event published to RabbitMQ:', orderNumber);
    } catch (error) {
      console.error('⚠️ Failed to publish to RabbitMQ:', error.message);
    }
    
    res.status(201).json(orderData);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create order', error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    res.json({ orders: [], total: 0 });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    res.json({ orderId: id, status: 'delivered', items: [] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
};
