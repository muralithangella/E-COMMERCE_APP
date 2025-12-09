require('dotenv').config({ path: '../../.env' });
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const { connectRabbitMQ } = require('./utils/rabbitmq');

const app = express();
const PORT = process.env.NOTIFICATION_PORT || 5004;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('Client connected');
  
  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected');
  });
});

const broadcastNotification = (event) => {
  const notification = {
    type: event.eventType,
    message: `Order ${event.data.orderNumber} has been ${event.data.status}`,
    data: event.data,
    timestamp: event.timestamp
  };
  
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(notification));
    }
  });
  
  console.log('Notification sent:', notification);
};

connectRabbitMQ(broadcastNotification);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', clients: clients.size });
});

server.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
});

module.exports = app;
