require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const cluster = require('cluster');
const os = require('os');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const redis = require('redis');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const cacheMiddleware = require('./middleware/cache');

const app = express();
const PORT = process.env.PORT || 5006;

const redisClient = redis.createClient({ 
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: { reconnectStrategy: (retries) => Math.min(retries * 50, 500) }
});
redisClient.connect().catch(() => console.log('Redis not available, using memory store'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests' }
});

mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 50,
  minPoolSize: 10,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  compressors: ['zlib'],
  readPreference: 'secondaryPreferred'
})
  .then(() => console.log(`[Worker ${process.pid}] MongoDB connected`))
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
app.use(compression({ level: 6, threshold: 1024 }));
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(limiter);
app.disable('x-powered-by');

app.use('/api/products', cacheMiddleware(300), productRoutes);

app.get('/api/deals', cacheMiddleware(600), async (req, res) => {
  try {
    const Product = require('./models/product');
    const deals = await Product.find({ isActive: true, discount: { $gt: 0 } })
      .sort({ discount: -1 })
      .limit(8)
      .select('-__v')
      .lean({ virtuals: false });
    res.json({ success: true, data: deals });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch deals' });
  }
});

app.get('/api/recommendations', cacheMiddleware(600), async (req, res) => {
  try {
    const Product = require('./models/product');
    const recommendations = await Product.find({ isActive: true })
      .sort({ 'rating.average': -1 })
      .limit(8)
      .select('-__v')
      .lean({ virtuals: false });
    res.json({ success: true, data: recommendations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch recommendations' });
  }
});

app.get('/api/categories', cacheMiddleware(3600), async (req, res) => {
  try {
    const Product = require('./models/product');
    const categories = await Product.distinct('category', { isActive: true });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});

app.use(errorHandler);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'product', 
    worker: process.pid,
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    memory: process.memoryUsage().heapUsed / 1024 / 1024
  });
});

const server = app.listen(PORT, () => {
  console.log(`[Worker ${process.pid}] Product Service on port ${PORT}`);
});

server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing gracefully');
  server.close(() => {
    mongoose.connection.close(false, () => {
      redisClient.quit().catch(() => {});
      process.exit(0);
    });
  });
});

module.exports = app;
