# Frontend RabbitMQ Integration - Fixed

## Problem
When running the frontend from the shell app (`npm run start:shell`), the RabbitMQ WebSocket notifications were not working because:
1. The shell app has its own `CheckoutPage` component (different from checkout-mf)
2. The shell's `CheckoutPage` didn't have the `NotificationToast` component
3. The WebSocket connection wasn't being established when using the shell app

## Solution
Added RabbitMQ notification support to the shell app:

### Files Created/Modified:

1. **`frontend/shell/src/hooks/useNotifications.js`**
   - WebSocket hook that connects to `ws://localhost:5004`
   - Handles reconnection logic
   - Manages notification state

2. **`frontend/shell/src/components/NotificationToast.jsx`**
   - Displays real-time notifications from RabbitMQ
   - Shows connection status
   - Displays up to 3 recent notifications

3. **`frontend/shell/src/pages/CheckoutPage.jsx`**
   - Added `NotificationToast` component
   - Updated order creation to match order service API format
   - Improved error handling

## How to Test

### Step 1: Start All Services

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

**Terminal 4 - Frontend Shell:**
```powershell
cd frontend
npm run start:shell
# Should start on http://localhost:3000
```

### Step 2: Test the Flow

1. **Open Browser:**
   - Navigate to: http://localhost:3000
   - Open Developer Tools (F12) → Console tab

2. **Check WebSocket Connection:**
   - Look for: `"✅ WebSocket connected to notification service"`
   - If you see this, WebSocket is working ✅

3. **Add Items to Cart:**
   - Browse products
   - Add items to cart
   - Go to cart page

4. **Proceed to Checkout:**
   - Click "Proceed to Checkout"
   - Fill in shipping address
   - Fill in payment details
   - Review order

5. **Place Order:**
   - Click "Place Order"
   - Watch the browser console

### Step 3: What to Look For

**In Browser Console:**
```
✅ WebSocket connected to notification service
✅ Order submitted to backend successfully
📦 Order Number: ORD-1234567890
📊 Order Status: confirmed
📬 Notification received: {type: "ORDER_CREATED", message: "Order ORD-... has been confirmed"}
```

**In Frontend UI:**
- A green notification toast should appear in the top-right corner
- Shows: "ORDER_CREATED - Order ORD-... has been confirmed"

**In Order Service Terminal:**
```
Event published: ORDER_CREATED
```

**In Notification Service Terminal:**
```
Notification sent: {type: "ORDER_CREATED", ...}
Client connected (when frontend connects)
```

**In RabbitMQ Management UI:**
- Open: http://localhost:15672 (guest/guest)
- Go to "Queues" → `order_events`
- You should see messages being published and consumed

## Expected Flow

```
Frontend Shell (Browser)
    ↓ User clicks "Place Order"
    ↓ POST /api/orders (via API Gateway)
API Gateway (Port 8080)
    ↓ Proxies to Order Service
Order Service (Port 5003)
    ↓ publishEvent('ORDER_CREATED', order)
RabbitMQ Queue (order_events)
    ↓ Message consumed
Notification Service (Port 5004)
    ↓ WebSocket broadcast
Frontend WebSocket (ws://localhost:5004)
    ↓ Notification received
NotificationToast Component
    ↓ Displays toast
✅ User sees notification!
```

## Troubleshooting

### ❌ WebSocket Not Connecting

**Check:**
1. Notification Service is running (port 5004)
2. Browser console for connection errors
3. WebSocket URL: `ws://localhost:5004`

**Solution:**
```powershell
# Check if Notification Service is running
curl http://localhost:5004/health

# Restart Notification Service
cd backend/notification-service
npm start
```

### ❌ No Notification Appearing

**Check:**
1. Browser console for WebSocket messages
2. Notification Service logs for "Notification sent"
3. RabbitMQ Management UI for messages in queue
4. Check if `NotificationToast` is rendered (should be visible in top-right)

**Solution:**
- Make sure all services are running
- Check browser console for errors
- Verify order was created successfully

### ❌ Order Not Creating

**Check:**
1. Order Service is running (port 5003)
2. API Gateway is running (port 8080)
3. Order Service logs for "Event published"
4. Browser console for API errors

**Solution:**
```powershell
# Test Order Service directly
curl -X POST http://localhost:5003/api/orders `
  -H "Content-Type: application/json" `
  -d '{\"userId\":\"test\",\"items\":[{\"productId\":\"1\",\"quantity\":1,\"price\":10}],\"totalAmount\":10}'
```

## Success Indicators

✅ **WebSocket Working:**
- Browser console shows: `"✅ WebSocket connected to notification service"`
- Notification toast shows connection status

✅ **Order Creation Working:**
- Browser console shows: `"✅ Order submitted to backend successfully"`
- Order Service logs show: `"Event published: ORDER_CREATED"`

✅ **RabbitMQ Working:**
- Notification Service logs show: `"Notification sent"`
- Frontend receives notification and displays toast

✅ **Complete Flow Working:**
- User places order
- Notification toast appears immediately
- All services show correct logs

## Notes

- The shell app now has full RabbitMQ notification support
- Notifications work when running `npm run start:shell`
- The checkout-mf micro-frontend also has notifications (for standalone use)
- Both implementations use the same WebSocket endpoint: `ws://localhost:5004`

