const express = require('express');
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const orderRoutes = require('./orderRoutes');
const paymentRoutes = require('./paymentRoutes');
const userRoutes = require('./userRoutes');
const cartRoutes = require('./cartRoutes');
const reviewRoutes = require('./reviewRoutes');
const couponRoutes = require('./couponRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const notificationRoutes = require('./notificationRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Direct categories endpoint
router.get('/categories', (req, res) => {
  const mockCategories = [
    { _id: '1', name: 'Electronics', slug: 'electronics', description: 'Electronic devices and gadgets', image: 'https://picsum.photos/200/150?random=1' },
    { _id: '2', name: 'Fashion', slug: 'fashion', description: 'Clothing and accessories', image: 'https://picsum.photos/200/150?random=2' },
    { _id: '3', name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Home appliances and kitchen items', image: 'https://picsum.photos/200/150?random=3' },
    { _id: '4', name: 'Sports', slug: 'sports', description: 'Sports equipment and gear', image: 'https://picsum.photos/200/150?random=4' },
    { _id: '5', name: 'Books', slug: 'books', description: 'Books and educational materials', image: 'https://picsum.photos/200/150?random=5' },
    { _id: '6', name: 'Beauty', slug: 'beauty', description: 'Beauty and personal care products', image: 'https://picsum.photos/200/150?random=6' }
  ];
  res.json({ data: mockCategories });
});

// API routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/users', userRoutes);
router.use('/cart', cartRoutes);
router.use('/reviews', reviewRoutes);
router.use('/coupons', couponRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);

module.exports = router;