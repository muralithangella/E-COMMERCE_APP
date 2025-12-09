require('dotenv').config();
const axios = require('axios');

const testOrderCreation = async () => {
  try {
    const response = await axios.post('http://localhost:5003/api/orders', {
      userId: 'test-user-123',
      items: [
        { productId: 'prod-1', name: 'Test Product', quantity: 2, price: 29.99 }
      ],
      totalAmount: 59.98,
      shippingAddress: {
        street: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zip: '12345'
      }
    });
    
    console.log('Order created:', response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

testOrderCreation();
