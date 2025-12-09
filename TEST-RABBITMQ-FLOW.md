# RabbitMQ Async Communication Test

## How to Test RabbitMQ is Working

### Prerequisites
1. RabbitMQ must be running on port 5672
2. Order Service running on port 5003
3. Notification Service running on port 5004

### Step 1: Start RabbitMQ
```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

Or if already running:
```bash
docker start rabbitmq
```

### Step 2: Start Services
```bash
# Terminal 1: Order Service
cd c:\ecommerce-app\backend\order-service
npm start

# Terminal 2: Notification Service  
cd c:\ecommerce-app\backend\notification-service
npm start
```

### Step 3: Test Order Creation

**Option A: Using PowerShell**
```powershell
$body = @{
    items = @(
        @{ productId = "123"; name = "Test Product"; quantity = 2; price = 1000 }
    )
    total = 2000
    customerEmail = "test@example.com"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5003/api/orders" -Method POST -Body $body -ContentType "application/json"
```

**Option B: Using curl**
```bash
curl -X POST http://localhost:5003/api/orders \
  -H "Content-Type: application/json" \
  -d "{\"items\":[{\"productId\":\"123\",\"name\":\"Test Product\",\"quantity\":2,\"price\":1000}],\"total\":2000,\"customerEmail\":\"test@example.com\"}"
```

### Step 4: Check Logs

**Order Service Console Should Show:**
```
✅ Order event published to RabbitMQ: ORD-1234567890
```

**Notification Service Console Should Show:**
```
Notification sent: Order ORD-1234567890 has been confirmed
```

### Step 5: Check RabbitMQ Management UI
1. Open: http://localhost:15672
2. Login: username=`guest`, password=`guest`
3. Go to "Queues" tab
4. You should see `order_events` queue
5. Check message rates and counts

## What's Happening?

```
┌─────────────┐         ┌──────────┐         ┌──────────────────┐
│   Client    │         │ RabbitMQ │         │   Notification   │
│  (Browser)  │         │  Queue   │         │     Service      │
└──────┬──────┘         └────┬─────┘         └────────┬─────────┘
       │                     │                         │
       │ POST /api/orders    │                         │
       ├────────────────────>│                         │
       │                     │                         │
       │ ✅ Order Created    │                         │
       │<────────────────────┤                         │
       │                     │                         │
       │                     │ Publish ORDER_CREATED   │
       │                     │<────────────────────────┤
       │                     │                         │
       │                     │ Consume Event           │
       │                     ├────────────────────────>│
       │                     │                         │
       │                     │                         │ Send Email/SMS
       │                     │                         │ WebSocket Notify
       │                     │                         │
```

## Troubleshooting

### RabbitMQ Not Running
```bash
# Check if RabbitMQ is running
docker ps | findstr rabbitmq

# If not running, start it
docker start rabbitmq
```

### Connection Refused
- Check if RabbitMQ is on port 5672: `netstat -ano | findstr 5672`
- Check .env has: `RABBITMQ_URL=amqp://localhost:5672`

### No Messages in Queue
- Check Order Service logs for "published to RabbitMQ"
- Check Notification Service logs for "RabbitMQ consumer connected"
- Verify both services have `amqplib` installed

### Messages Not Consumed
- Restart Notification Service
- Check RabbitMQ management UI for consumer count on queue

## Expected Results

✅ **Working Correctly:**
- Order Service: "✅ Order event published to RabbitMQ"
- Notification Service: "Notification sent: Order ORD-xxx has been confirmed"
- RabbitMQ UI: Messages published and consumed

❌ **Not Working:**
- Order Service: "⚠️ Failed to publish to RabbitMQ"
- Notification Service: No logs about receiving events
- RabbitMQ UI: Messages stuck in queue
