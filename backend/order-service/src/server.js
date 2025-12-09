require('dotenv').config({ path: '../../.env' });
const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');
const { connectRabbitMQ } = require('./utils/rabbitmq');

const app = express();
const PORT = process.env.PORT || 5003;

connectRabbitMQ().catch(err => console.error('RabbitMQ init failed:', err));

app.use(cors());
app.use(express.json());
app.use('/api/orders', orderRoutes);

const certPath = path.join(__dirname, '../../certs/cert.pem');
const keyPath = path.join(__dirname, '../../certs/key.pem');

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'order' });
});

if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
  const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  };
  https.createServer(options, app).listen(PORT, () => {
    console.log(`Order Service running on HTTPS port ${PORT}`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`Order Service running on HTTP port ${PORT} (SSL certs not found)`);
  });
}

module.exports = app;
