# How to Test RabbitMQ

This guide shows you how to verify that RabbitMQ is working correctly in your e-commerce application.

## Quick Test Methods

### Method 1: Basic Connection Test (Fastest)

Test if RabbitMQ is running and accessible:

```bash
cd backend
node test-rabbitmq-connection.js
```

**Expected Output:**
```
✅ Successfully connected to RabbitMQ!
✅ Channel created successfully!
✅ Queue "order_events" asserted/created!
✅ Test message published successfully!
🎉 All RabbitMQ tests passed!
```

### Method 2: Full Flow Test (Complete)

Test the entire flow: Order Service → RabbitMQ → Notification Service:

```bash
cd backend
node test-full-rabbitmq-flow.js
```

**Prerequisites:**
- RabbitMQ must be running
- Order Service must be running (port 5003)
- Notification Service must be running (port 5004)

### Method 3: Manual API Test

Create an order and verify it triggers RabbitMQ:

```bash
# Using curl (Windows PowerShell)
curl -X POST http://localhost:5003/api/orders `
  -H "Content-Type: application/json" `
  -d '{\"userId\":\"user123\",\"items\":[{\"productId\":\"prod1\",\"quantity\":2,\"price\":29.99}],\"totalAmount\":59.98}'

# Using curl (Linux/Mac)
curl -X POST http://localhost:5003/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "items": [{"productId": "prod1", "quantity": 2, "price": 29.99}],
    "totalAmount": 59.98
  }'
```

### Method 4: Using the Existing Test Script

```bash
cd backend
node test-rabbitmq.js
```

## Step-by-Step Verification

### Step 1: Check if RabbitMQ is Running

**Windows:**
```powershell
# Check if RabbitMQ service is running
Get-Service | Where-Object {$_.Name -like "*rabbitmq*"}

# Or check if port 5672 is listening
netstat -an | findstr 5672
```

**Docker:**
```bash
docker ps | grep rabbitmq
```

**Manual Start:**
```bash
# Windows
rabbitmq-server

# Linux/Mac
sudo systemctl start rabbitmq-server
# or
rabbitmq-server
```

### Step 2: Access RabbitMQ Management UI

Open your browser and go to:
```
http://localhost:15672
```

**Default Credentials:**
- Username: `guest`
- Password: `guest`

**What to Check:**
1. Go to "Queues" tab
2. Look for queue named `order_events`
3. Check if messages are being published/consumed

### Step 3: Check Service Logs

**Order Service (Publisher):**
```bash
cd backend/order-service
npm start
# Look for: "RabbitMQ connected"
```

**Notification Service (Consumer):**
```bash
cd backend/notification-service
npm start
# Look for: "RabbitMQ consumer connected"
# Look for: "Client connected" (when frontend connects)
```

### Step 4: Test Frontend Integration

1. Start the frontend:
```bash
cd frontend/checkout-mf
npm run dev
```

2. Open browser console (F12)
3. Navigate to checkout page
4. Look for: `"WebSocket connected to notification service"`
5. Create an order
6. Check for notification toast appearing

## Troubleshooting

### ❌ "Cannot connect to RabbitMQ"

**Solutions:**
1. Make sure RabbitMQ is running:
   ```bash
   # Windows
   rabbitmq-server
   
   # Docker
   docker-compose up -d rabbitmq
   ```

2. Check if port 5672 is available:
   ```bash
   netstat -an | findstr 5672
   ```

3. Verify connection URL in `.env`:
   ```
   RABBITMQ_URL=amqp://localhost:5672
   ```

### ❌ "Order created but no notification"

**Check:**
1. Is Notification Service running? (port 5004)
2. Check Notification Service logs for errors
3. Verify WebSocket connection in browser console
4. Check RabbitMQ Management UI for messages in queue

### ❌ "RabbitMQ connection error"

**Solutions:**
1. Restart RabbitMQ service
2. Check RabbitMQ logs:
   ```bash
   # Windows (if installed as service)
   rabbitmq-service status
   
   # Docker
   docker logs ecommerce-rabbitmq
   ```

3. Verify credentials (if using custom):
   ```
   RABBITMQ_URL=amqp://username:password@localhost:5672
   ```

## Health Check Endpoints

- **Notification Service Health:** http://localhost:5004/health
- **RabbitMQ Management UI:** http://localhost:15672

## Expected Behavior

When everything is working:

1. ✅ Order Service connects to RabbitMQ on startup
2. ✅ Notification Service connects and starts consuming
3. ✅ Creating an order publishes message to RabbitMQ
4. ✅ Notification Service receives message
5. ✅ Notification Service broadcasts via WebSocket
6. ✅ Frontend receives notification and displays toast

## Quick Start All Services

```bash
# Terminal 1: Start RabbitMQ (if using Docker)
docker-compose -f backend/docker-compose.rabbitmq.yml up -d

# Terminal 2: Start Order Service
cd backend/order-service
npm start

# Terminal 3: Start Notification Service
cd backend/notification-service
npm start

# Terminal 4: Start Frontend
cd frontend/checkout-mf
npm run dev

# Terminal 5: Run Test
cd backend
node test-full-rabbitmq-flow.js
```

## Success Indicators

✅ **RabbitMQ Working:**
- Connection test passes
- Management UI accessible
- Queue `order_events` exists

✅ **Publisher Working:**
- Order Service logs show "RabbitMQ connected"
- Messages appear in queue after creating orders

✅ **Consumer Working:**
- Notification Service logs show "RabbitMQ consumer connected"
- Messages are consumed from queue

✅ **Frontend Working:**
- WebSocket connects (check browser console)
- Notifications appear when orders are created

