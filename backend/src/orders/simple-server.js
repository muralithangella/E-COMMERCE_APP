require('dotenv').config({ path: '../../.env' });
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.ORDERS_SERVICE_PORT || 3008;

app.use(cors());
app.use(express.json());

// Simple order creation endpoint
app.post('/api/orders', async (req, res) => {
  try {
    console.log('📦 Order received:', req.body);
    
    const order = {
      id: req.body.id || Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    // Mock notification sending
    console.log('📧 Sending email notification to:', req.body.userEmail);
    console.log('📱 Sending SMS notification to:', req.body.userPhone);
    
    res.status(201).json({
      success: true,
      order,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('❌ Order creation failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get order by ID
app.get('/api/orders/:id', (req, res) => {
  console.log('🔍 Fetching order:', req.params.id);
  
  // Mock order data
  const order = {
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
  
  res.json(order);
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'orders-service-simple' });
});

app.listen(PORT, () => {
  console.log(`✅ Simple Orders Service running on port ${PORT}`);
  console.log(`📧 Mock notifications enabled`);
});

module.exports = app;