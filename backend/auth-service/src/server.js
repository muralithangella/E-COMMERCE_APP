require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5005;

mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 20,
  minPoolSize: 5
}).then(() => console.log(`[Worker ${process.pid}] MongoDB connected`));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many login attempts' }
});

app.use(helmet());
app.use(compression({ level: 6 }));
app.use(cors({ credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use('/api/auth', limiter, authRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth', worker: process.pid });
});

const server = app.listen(PORT, () => {
  console.log(`[Worker ${process.pid}] Auth Service on port ${PORT}`);
});

server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

process.on('SIGTERM', () => {
  server.close(() => {
    mongoose.connection.close(false, () => process.exit(0));
  });
});

module.exports = app;
