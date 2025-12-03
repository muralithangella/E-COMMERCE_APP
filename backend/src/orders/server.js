require('dotenv').config({ path: '../../.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const orderRoutes = require('../../routes/orderRoutes');
const { errorHandler } = require('../../middleware/errorHandler');
const DatabaseManager = require('../../config/database');

const app = express();
const PORT = process.env.ORDERS_SERVICE_PORT || 3008;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/orders', orderRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'orders-service' });
});

app.use(errorHandler);

const startServer = async () => {
  try {
    // Connect to RabbitMQ
    const RabbitMQManager = require('../../config/rabbitmq');
    await RabbitMQManager.connect();
    
    // Start notification workers
    const NotificationService = require('../../services/notificationService');
    await NotificationService.startNotificationWorkers();
    
    app.listen(PORT, () => {
      console.log(`✅ Orders Service running on port ${PORT}`);
      console.log(`📬 RabbitMQ notifications enabled`);
    });
  } catch (error) {
    console.error('Failed to start orders service:', error);
    // Don't exit - continue without RabbitMQ if needed
    app.listen(PORT, () => {
      console.log(`⚠️ Orders Service running on port ${PORT} (limited functionality)`);
    });
  }
};

startServer();

module.exports = app;