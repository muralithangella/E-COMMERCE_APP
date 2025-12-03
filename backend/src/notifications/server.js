require('dotenv').config({ path: '../../.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const RabbitMQManager = require('../../config/rabbitmq');
const NotificationService = require('../../services/notificationService');

const app = express();
const PORT = process.env.NOTIFICATIONS_SERVICE_PORT || 3006;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'notifications-service',
    rabbitmq: RabbitMQManager.isConnected
  });
});

// Manual notification endpoints for testing
app.post('/api/notifications/email', async (req, res) => {
  try {
    const { to, subject, content, template } = req.body;
    await NotificationService.sendEmail(to, subject, content, template);
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/notifications/sms', async (req, res) => {
  try {
    const { to, message } = req.body;
    await NotificationService.sendSMS(to, message);
    res.json({ success: true, message: 'SMS sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const startServer = async () => {
  try {
    // Connect to RabbitMQ
    console.log('🔌 Connecting to RabbitMQ...');
    await RabbitMQManager.connect();
    
    // Start notification workers
    console.log('🚀 Starting notification workers...');
    await NotificationService.startNotificationWorkers();
    
    app.listen(PORT, () => {
      console.log(`✅ Notifications Service running on port ${PORT}`);
      console.log(`📬 Email/SMS workers active`);
      console.log(`🐰 RabbitMQ connected: ${RabbitMQManager.isConnected}`);
    });
  } catch (error) {
    console.error('❌ Failed to start notifications service:', error);
    // Start without RabbitMQ if needed
    app.listen(PORT, () => {
      console.log(`⚠️ Notifications Service running on port ${PORT} (limited functionality)`);
    });
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down notifications service...');
  await RabbitMQManager.close();
  process.exit(0);
});

startServer();

module.exports = app;