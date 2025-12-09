require('dotenv').config({ path: '../../.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const wishlistRoutes = require('./routes/wishlistRoutes');
const { errorHandler, notFoundHandler } = require('../../shared/utils/errorHandler');

const app = express();
const PORT = process.env.WISHLIST_SERVICE_PORT || 5006;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://muralithangella_db_user:sW6i6ceY2q1W0oTc@fullstack.qnyvzwj.mongodb.net/';

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Wishlist Service: MongoDB connected'))
.catch(err => console.error('❌ Wishlist Service: MongoDB connection error:', err));

// Routes
app.use('/api/wishlist', wishlistRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'wishlist-service',
    timestamp: new Date().toISOString()
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Wishlist Service running on port ${PORT}`);
  console.log(`💝 Wishlist API: http://localhost:${PORT}/api/wishlist`);
});

module.exports = app;

