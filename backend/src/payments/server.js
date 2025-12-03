require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const paymentRoutes = require('../../routes/paymentRoutes');
const { errorHandler } = require('../../middleware/errorHandler');
const DatabaseManager = require('../../config/database');

const app = express();
const PORT = process.env.PAYMENTS_SERVICE_PORT || 3004;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/payments', paymentRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'payments-service' });
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await DatabaseManager.connectMongoDB();
    
    // Skip Redis connection
    console.log('Skipping Redis connection');
    
    app.listen(PORT, () => {
      console.log(`Payments Service running on port ${PORT}`);
      console.log('Stripe key loaded:', process.env.STRIPE_SECRET_KEY ? 'Yes' : 'No');
    });
  } catch (error) {
    console.error('Failed to start payments service:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;