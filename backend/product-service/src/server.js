require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const express = require('express');
const mongoose = require('mongoose');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5006;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests' }
});

mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log('MongoDB connected with connection pooling'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

mongoose.connection.on('error', err => {
  console.error('MongoDB runtime error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...');
});

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(limiter);

app.use('/api/products', productRoutes);

app.get('/api/deals', async (req, res) => {
  try {
    const Product = require('./models/product');
    const deals = await Product.find({ isActive: true, discount: { $gt: 0 } }).sort({ discount: -1 }).limit(8).lean();
    res.json({ success: true, data: deals });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch deals' });
  }
});

app.get('/api/recommendations', async (req, res) => {
  try {
    const Product = require('./models/product');
    const recommendations = await Product.find({ isActive: true }).sort({ 'rating.average': -1 }).limit(8).lean();
    res.json({ success: true, data: recommendations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch recommendations' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const Product = require('./models/product');
    const categories = await Product.distinct('category', { isActive: true });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});

app.use(errorHandler);

const certPath = path.join(__dirname, '../../certs/cert.pem');
const keyPath = path.join(__dirname, '../../certs/key.pem');

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'product', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.listen(PORT, () => {
  console.log(`Product Service running on HTTP port ${PORT}`);
});

module.exports = app;
