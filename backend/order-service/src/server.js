require('dotenv').config({ path: '../../.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const orderRoutes = require('./routes/orderRoutes');
const { connectRabbitMQ } = require('./utils/rabbitmq');

const app = express();
const PORT = process.env.PORT || 5003;

mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 30,
  minPoolSize: 5,
  serverSelectionTimeoutMS: 5000
}).then(() => console.log(`[Worker ${process.pid}] MongoDB connected`));

connectRabbitMQ().catch(err => console.error('RabbitMQ init failed:', err));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { success: false, message: 'Too many requests' }
});

app.use(helmet());
app.use(compression({ level: 6 }));
app.use(cors({ credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(limiter);
app.use('/api/orders', orderRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'order', worker: process.pid });
});

const server = app.listen(PORT, () => {
  console.log(`[Worker ${process.pid}] Order Service on port ${PORT}`);
});

server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

process.on('SIGTERM', () => {
  server.close(() => {
    mongoose.connection.close(false, () => process.exit(0));
  });
});

module.exports = app;
