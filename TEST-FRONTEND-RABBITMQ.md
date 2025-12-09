# Testing RabbitMQ Async Calls from Frontend

This guide shows you how to test the complete flow: **Frontend → Order Service → RabbitMQ → Notification Service → Frontend WebSocket**

## Prerequisites

Make sure these services are running:

1. **RabbitMQ** (port 5672)
2. **Order Service** (port 5003)
3. **Notification Service** (port 5004)
4. **Frontend Checkout** (port 3004)

## Step-by-Step Testing

### Step 1: Start All Services

Open **4 separate terminal windows**:

**Terminal 1 - RabbitMQ:**
```powershell
# If using Docker
docker-compose -f backend/docker-compose.rabbitmq.yml up -d

# Or if installed locally
rabbitmq-server
```

**Terminal 2 - Order Service:**
```powershell
cd backend/order-service
npm install
npm start
# Should see: "RabbitMQ connected" and "Order Service running on port 5003"
```

**Terminal 3 - Notification Service:**
```powershell
cd backend/notification-service
npm install
npm start
# Should see: "RabbitMQ consumer connected" and "Notification Service running on port 5004"
```

**Terminal 4 - Frontend:**
```powershell
cd frontend/checkout-mf
npm install
npm run dev
# Should start on http://localhost:3004
```

### Step 2: Verify Services Are Running

**Check RabbitMQ:**
- Open browser: http://localhost:15672
- Login: guest/guest
- Go to "Queues" tab
- Look for queue: `order_events`

**Check Order Service:**
```powershell
curl http://localhost:5003/api/orders
```

**Check Notification Service:**
```powershell
curl http://localhost:5004/health
# Should return: {"status":"ok","clients":0}
```

### Step 3: Test from Frontend

1. **Open Frontend in Browser:**
   - Navigate to: http://localhost:3004
   - Or the checkout page in your main app

2. **Open Browser Developer Tools:**
   - Press `F12` or `Ctrl+Shift+I`
   - Go to "Console" tab

3. **Check WebSocket Connection:**
   - Look for: `"WebSocket connected to notification service"`
   - If you see this, WebSocket is working ✅

4. **Fill Checkout Form:**
   - Enter shipping address
   - Enter payment details
   - Review order

5. **Place Order:**
   - Click "Place Order" button
   - Watch the browser console

### Step 4: What to Look For

**In Browser Console:**
```
✅ WebSocket connected to notification service
✅ Notification received: {type: "ORDER_CREATED", message: "Order ORD-... has been confirmed"}
```

**In Order Service Terminal:**
```
✅ Event published: ORDER_CREATED
```

**In Notification Service Terminal:**
```
✅ Notification sent: {type: "ORDER_CREATED", ...}
✅ Client connected (when frontend connects)
```

**In Frontend UI:**
- A green notification toast should appear in the top-right corner
- Shows: "ORDER_CREATED - Order ORD-... has been confirmed"

**In RabbitMQ Management UI:**
- Go to http://localhost:15672 → Queues → order_events
- You should see messages being published and consumed

## Manual API Test (Alternative)

If you want to test without the frontend UI:

```powershell
# Create an order
curl -X POST http://localhost:5003/api/orders `
  -H "Content-Type: application/json" `
  -d '{\"userId\":\"test123\",\"items\":[{\"productId\":\"prod1\",\"quantity\":2,\"price\":29.99}],\"totalAmount\":59.98,\"shippingAddress\":{\"street\":\"123 Test\",\"city\":\"Test\",\"state\":\"TS\",\"zip\":\"12345\"}}'

# Then check Notification Service
curl http://localhost:5004/health
```

## Troubleshooting

### ❌ WebSocket Not Connecting

**Symptoms:**
- Browser console shows: `WebSocket error` or connection fails

**Solutions:**
1. Check Notification Service is running (port 5004)
2. Check browser console for connection errors
3. Verify WebSocket URL in `useNotifications.js`: `ws://localhost:5004`

### ❌ No Notification Appearing

**Symptoms:**
- Order created but no notification toast

**Check:**
1. Browser console for WebSocket messages
2. Notification Service logs for "Notification sent"
3. RabbitMQ Management UI for messages in queue
4. Check if `NotificationToast` component is rendered in CheckoutPage

### ❌ Order Service Not Publishing

**Symptoms:**
- Order created but no RabbitMQ message

**Check:**
1. Order Service logs for "RabbitMQ connected"
2. Order Service logs for "Event published: ORDER_CREATED"
3. RabbitMQ Management UI - check if messages are in queue

### ❌ Notification Service Not Consuming

**Symptoms:**
- Messages in RabbitMQ queue but not being consumed

**Check:**
1. Notification Service logs for "RabbitMQ consumer connected"
2. Check for errors in Notification Service terminal
3. Verify queue name matches: `order_events`

## Expected Flow Diagram

```
Frontend (Browser)
    ↓ [User clicks "Place Order"]
    ↓ [POST /api/orders]
Order Service (Port 5003)
    ↓ [publishEvent('ORDER_CREATED', order)]
RabbitMQ Queue (order_events)
    ↓ [Message consumed]
Notification Service (Port 5004)
    ↓ [WebSocket broadcast]
Frontend WebSocket
    ↓ [Notification received]
NotificationToast Component
    ↓ [Display toast]
User sees notification ✅
```

## Success Checklist

- [ ] RabbitMQ running (port 5672)
- [ ] Order Service running and connected to RabbitMQ
- [ ] Notification Service running and consuming from RabbitMQ
- [ ] Frontend running and WebSocket connected
- [ ] Browser console shows "WebSocket connected"
- [ ] Order created successfully
- [ ] Notification toast appears in frontend
- [ ] RabbitMQ Management UI shows message flow

## Quick Test Script

Save this as `test-frontend-flow.ps1`:

```powershell
Write-Host "Testing Frontend → RabbitMQ Flow" -ForegroundColor Cyan
Write-Host ""

# Check RabbitMQ
Write-Host "1. Checking RabbitMQ..." -ForegroundColor Yellow
$rabbitmq = netstat -an | Select-String "5672"
if ($rabbitmq) {
    Write-Host "   ✅ RabbitMQ is running" -ForegroundColor Green
} else {
    Write-Host "   ❌ RabbitMQ not running" -ForegroundColor Red
}

# Check Order Service
Write-Host "2. Checking Order Service..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5003/api/orders" -Method GET -TimeoutSec 2
    Write-Host "   ✅ Order Service is running" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Order Service not running" -ForegroundColor Red
}

# Check Notification Service
Write-Host "3. Checking Notification Service..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5004/health" -TimeoutSec 2
    Write-Host "   ✅ Notification Service is running" -ForegroundColor Green
    $data = $response.Content | ConvertFrom-Json
    Write-Host "   📡 WebSocket clients: $($data.clients)" -ForegroundColor Cyan
} catch {
    Write-Host "   ❌ Notification Service not running" -ForegroundColor Red
}

Write-Host ""
Write-Host "Next: Open http://localhost:3004 and create an order!" -ForegroundColor Cyan
```

Run it:
```powershell
.\test-frontend-flow.ps1
```

