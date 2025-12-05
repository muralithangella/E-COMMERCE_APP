const express = require('express');
const router = express.Router();

// Mock data stores
let orders = [];
let reviews = [];
let addresses = [];
let paymentMethods = [];

// ORDER MANAGEMENT ROUTES
router.get('/orders', (req, res) => {
  const { userId, status, page = 1, limit = 10 } = req.query;
  
  let filteredOrders = [...orders];
  
  if (userId) {
    filteredOrders = filteredOrders.filter(order => order.userId === userId);
  }
  
  if (status) {
    filteredOrders = filteredOrders.filter(order => order.status === status);
  }
  
  const startIndex = (page - 1) * limit;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + parseInt(limit));
  
  res.json({
    success: true,
    data: paginatedOrders,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredOrders.length,
      pages: Math.ceil(filteredOrders.length / limit)
    }
  });
});

router.post('/orders', (req, res) => {
  const {
    userId, items, shippingAddress, paymentMethod,
    subtotal, tax, shipping, total
  } = req.body;
  
  const newOrder = {
    id: Date.now().toString(),
    userId,
    orderNumber: 'AMZ' + Date.now(),
    items,
    shippingAddress,
    paymentMethod,
    pricing: { subtotal, tax, shipping, total },
    status: 'confirmed',
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    tracking: {
      status: 'Order Confirmed',
      updates: [
        {
          status: 'Order Placed',
          timestamp: new Date().toISOString(),
          description: 'Your order has been placed successfully'
        }
      ]
    }
  };
  
  orders.push(newOrder);
  
  res.json({
    success: true,
    data: newOrder,
    message: 'Order placed successfully'
  });
});

router.get('/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }
  
  res.json({
    success: true,
    data: order
  });
});

router.put('/orders/:id/cancel', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }
  
  if (order.status === 'shipped' || order.status === 'delivered') {
    return res.status(400).json({
      success: false,
      message: 'Cannot cancel shipped or delivered orders'
    });
  }
  
  order.status = 'cancelled';
  order.tracking.updates.push({
    status: 'Order Cancelled',
    timestamp: new Date().toISOString(),
    description: 'Order has been cancelled as requested'
  });
  
  res.json({
    success: true,
    data: order,
    message: 'Order cancelled successfully'
  });
});

// REVIEW ROUTES
router.get('/reviews', (req, res) => {
  const { productId, userId } = req.query;
  
  let filteredReviews = [...reviews];
  
  if (productId) {
    filteredReviews = filteredReviews.filter(r => r.productId === productId);
  }
  
  if (userId) {
    filteredReviews = filteredReviews.filter(r => r.userId === userId);
  }
  
  res.json({
    success: true,
    data: filteredReviews
  });
});

router.post('/reviews', (req, res) => {
  const { productId, userId, rating, title, comment, verified = false } = req.body;
  
  if (!productId || !userId || !rating) {
    return res.status(400).json({
      success: false,
      message: 'Product ID, User ID, and rating are required'
    });
  }
  
  const newReview = {
    id: Date.now().toString(),
    productId,
    userId,
    rating: parseInt(rating),
    title: title || '',
    comment: comment || '',
    verified,
    helpful: 0,
    createdAt: new Date().toISOString()
  };
  
  reviews.push(newReview);
  
  res.json({
    success: true,
    data: newReview,
    message: 'Review added successfully'
  });
});

router.put('/reviews/:id/helpful', (req, res) => {
  const review = reviews.find(r => r.id === req.params.id);
  
  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    });
  }
  
  review.helpful += 1;
  
  res.json({
    success: true,
    data: review
  });
});

// ADDRESS MANAGEMENT
router.get('/addresses', (req, res) => {
  const { userId } = req.query;
  
  let userAddresses = addresses;
  if (userId) {
    userAddresses = addresses.filter(addr => addr.userId === userId);
  }
  
  res.json({
    success: true,
    data: userAddresses
  });
});

router.post('/addresses', (req, res) => {
  const {
    userId, name, phone, addressLine1, addressLine2,
    city, state, pincode, landmark, type = 'Home'
  } = req.body;
  
  if (!userId || !name || !phone || !addressLine1 || !city || !state || !pincode) {
    return res.status(400).json({
      success: false,
      message: 'Required fields missing'
    });
  }
  
  const newAddress = {
    id: Date.now().toString(),
    userId,
    name,
    phone,
    addressLine1,
    addressLine2: addressLine2 || '',
    city,
    state,
    pincode,
    landmark: landmark || '',
    type,
    isDefault: addresses.filter(a => a.userId === userId).length === 0,
    createdAt: new Date().toISOString()
  };
  
  addresses.push(newAddress);
  
  res.json({
    success: true,
    data: newAddress,
    message: 'Address added successfully'
  });
});

router.put('/addresses/:id', (req, res) => {
  const address = addresses.find(a => a.id === req.params.id);
  
  if (!address) {
    return res.status(404).json({
      success: false,
      message: 'Address not found'
    });
  }
  
  Object.assign(address, req.body);
  address.updatedAt = new Date().toISOString();
  
  res.json({
    success: true,
    data: address,
    message: 'Address updated successfully'
  });
});

router.delete('/addresses/:id', (req, res) => {
  const index = addresses.findIndex(a => a.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Address not found'
    });
  }
  
  addresses.splice(index, 1);
  
  res.json({
    success: true,
    message: 'Address deleted successfully'
  });
});

// PAYMENT METHODS
router.get('/payment-methods', (req, res) => {
  const { userId } = req.query;
  
  let userPaymentMethods = paymentMethods;
  if (userId) {
    userPaymentMethods = paymentMethods.filter(pm => pm.userId === userId);
  }
  
  res.json({
    success: true,
    data: userPaymentMethods
  });
});

router.post('/payment-methods', (req, res) => {
  const { userId, type, cardNumber, expiryMonth, expiryYear, cardholderName, isDefault = false } = req.body;
  
  if (!userId || !type) {
    return res.status(400).json({
      success: false,
      message: 'User ID and payment type are required'
    });
  }
  
  const newPaymentMethod = {
    id: Date.now().toString(),
    userId,
    type, // 'card', 'upi', 'netbanking', 'cod'
    cardNumber: cardNumber ? '**** **** **** ' + cardNumber.slice(-4) : null,
    expiryMonth,
    expiryYear,
    cardholderName,
    isDefault,
    createdAt: new Date().toISOString()
  };
  
  paymentMethods.push(newPaymentMethod);
  
  res.json({
    success: true,
    data: newPaymentMethod,
    message: 'Payment method added successfully'
  });
});

// AMAZON PRIME ROUTES
router.get('/prime/benefits', (req, res) => {
  res.json({
    success: true,
    data: {
      benefits: [
        'FREE One-Day Delivery',
        'FREE Two-Day Delivery',
        'Prime Video',
        'Prime Music',
        'Prime Reading',
        'Early access to deals',
        'Exclusive Prime Day deals'
      ],
      pricing: {
        monthly: 179,
        yearly: 1499,
        student: 599
      }
    }
  });
});

router.post('/prime/subscribe', (req, res) => {
  const { userId, plan } = req.body; // plan: 'monthly', 'yearly', 'student'
  
  res.json({
    success: true,
    message: 'Prime subscription activated',
    data: {
      userId,
      plan,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + (plan === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString()
    }
  });
});

// RECOMMENDATIONS
router.get('/recommendations', (req, res) => {
  const { userId, type = 'general' } = req.query;
  
  // Mock recommendation logic
  const recommendations = {
    general: [
      { title: 'Frequently bought together', products: ['1', '3', '5'] },
      { title: 'Customers who viewed this also viewed', products: ['2', '4'] },
      { title: 'Your recently viewed items', products: ['1', '2'] }
    ],
    trending: [
      { title: 'Trending in Electronics', products: ['3'] },
      { title: 'Best sellers in Fashion', products: ['4'] }
    ]
  };
  
  res.json({
    success: true,
    data: recommendations[type] || recommendations.general
  });
});

// COUPONS & OFFERS
router.get('/coupons', (req, res) => {
  const coupons = [
    {
      id: '1',
      code: 'SAVE10',
      title: '10% off on orders above ₹999',
      description: 'Get 10% discount on your order',
      discount: 10,
      minOrder: 999,
      maxDiscount: 200,
      validTill: '2024-12-31',
      applicable: ['Electronics', 'Fashion']
    },
    {
      id: '2',
      code: 'FIRST50',
      title: '₹50 off on first order',
      description: 'Flat ₹50 off on your first purchase',
      discount: 50,
      minOrder: 299,
      maxDiscount: 50,
      validTill: '2024-12-31',
      applicable: ['all']
    }
  ];
  
  res.json({
    success: true,
    data: coupons
  });
});

router.post('/coupons/apply', (req, res) => {
  const { code, orderTotal } = req.body;
  
  // Mock coupon validation
  if (code === 'SAVE10' && orderTotal >= 999) {
    const discount = Math.min(orderTotal * 0.1, 200);
    return res.json({
      success: true,
      data: {
        discount,
        finalTotal: orderTotal - discount,
        message: 'Coupon applied successfully'
      }
    });
  }
  
  if (code === 'FIRST50' && orderTotal >= 299) {
    return res.json({
      success: true,
      data: {
        discount: 50,
        finalTotal: orderTotal - 50,
        message: 'Coupon applied successfully'
      }
    });
  }
  
  res.status(400).json({
    success: false,
    message: 'Invalid coupon or minimum order not met'
  });
});

module.exports = router;