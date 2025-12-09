require('dotenv').config({ path: '../../.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const reviewRoutes = require('./routes/reviewRoutes');
const { errorHandler, notFoundHandler } = require('../../shared/utils/errorHandler');

const app = express();
const PORT = process.env.REVIEW_SERVICE_PORT || 5005;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://muralithangella_db_user:sW6i6ceY2q1W0oTc@fullstack.qnyvzwj.mongodb.net/';

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Review Service: MongoDB connected'))
.catch(err => console.error('❌ Review Service: MongoDB connection error:', err));

// Routes
app.use('/api/reviews', reviewRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'review-service',
    timestamp: new Date().toISOString()
  });
});

// 404 and error handlers
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Review Service running on port ${PORT}`);
  console.log(`📝 Reviews API: http://localhost:${PORT}/api/reviews`);
});

module.exports = app;

