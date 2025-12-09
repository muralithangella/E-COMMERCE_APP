# RabbitMQ Event-Driven Architecture Setup

## Overview
This implementation uses RabbitMQ for async event-driven communication between microservices.

## Architecture Flow
1. **Order Service** → Publishes `ORDER_CREATED` events to RabbitMQ queue
2. **Notification Service** → Consumes events from RabbitMQ and broadcasts via WebSocket
3. **Frontend** → Receives real-time notifications via WebSocket connection

## Prerequisites
Install RabbitMQ:
```bash
# Windows (using Chocolatey)
choco install rabbitmq

# Or download from: https://www.rabbitmq.com/download.html
```

## Installation

### Backend
```bash
# Install dependencies for order-service
cd backend/order-service
npm install

# Install dependencies for notification-service
cd ../notification-service
npm install
```

### Frontend
```bash
cd frontend/checkout-mf
npm install
```

## Running Services

### 1. Start RabbitMQ
```bash
# Start RabbitMQ service
rabbitmq-server

# Access management UI: http://localhost:15672
# Default credentials: guest/guest
```

### 2. Start Order Service (Publisher)
```bash
cd backend/order-service
npm start
# Runs on port 5003
```

### 3. Start Notification Service (Consumer)
```bash
cd backend/notification-service
npm start
# Runs on port 5004
```

### 4. Start Frontend
```bash
cd frontend/checkout-mf
npm run dev
```

## Testing

### Test Order Creation
```bash
cd backend
node test-rabbitmq.js
```

### Manual API Test
```bash
curl -X POST http://localhost:5003/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "items": [{"productId": "prod1", "quantity": 2, "price": 29.99}],
    "totalAmount": 59.98
  }'
```

## WebSocket Connection
Frontend automatically connects to: `ws://localhost:5004`

## Environment Variables
```env
RABBITMQ_URL=amqp://localhost:5672
```

## Event Types
- `ORDER_CREATED` - Triggered when new order is placed
- `ORDER_UPDATED` - Triggered when order status changes
- `ORDER_CANCELLED` - Triggered when order is cancelled

## Monitoring
- RabbitMQ Management UI: http://localhost:15672
- Queue Name: `order_events`
- Notification Service Health: http://localhost:5004/health
