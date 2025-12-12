require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const cartRoutes = require('./routes/cartRoutes');

const app = express();
const PORT = process.env.PORT || 5002;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000,
  message: { success: false, message: 'Too many requests' }
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log(`[Worker ${process.pid}] MongoDB connected`))
  .catch(err => console.error('MongoDB error:', err));

app.use(helmet());
app.use(compression({ level: 6 }));
app.use(cors({ 
  origin: ['http://localhost:3000', 'http://www.localhost:3000'],
  credentials: true 
}));
app.use(cookieParser());
app.use(express.json({ limit: '5mb' }));
app.use(limiter);
app.use('/api/cart', cartRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'cart', worker: process.pid });
});

const server = app.listen(PORT, () => {
  console.log(`[Worker ${process.pid}] Cart Service on port ${PORT}`);
});

server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});

module.exports = app;
