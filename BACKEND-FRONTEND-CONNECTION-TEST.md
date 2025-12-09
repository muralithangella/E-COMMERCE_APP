# Backend-Frontend Connection Status

## ✅ Frontend Services Configuration

All frontend services point to: `https://localhost:8080/api` (Nginx Gateway)

### Product Service
- ✅ GET /api/products
- ✅ GET /api/products/:id
- ✅ GET /api/categories

### Cart Service
- ✅ GET /api/cart
- ✅ POST /api/cart/add
- ✅ PUT /api/cart/items/:itemId
- ✅ DELETE /api/cart/items/:itemId
- ✅ DELETE /api/cart/clear

### Order Service
- ✅ POST /api/orders
- ✅ GET /api/orders
- ✅ GET /api/orders/:id (Added)

### Auth Service
- ✅ POST /api/auth/register
- ✅ POST /api/auth/login
- ✅ POST /api/auth/forgot-password
- ✅ POST /api/auth/reset-password

## ✅ Backend Services

### Product Service (Port 5001)
**Routes:**
- GET /api/products → getProducts
- GET /api/products/categories → getCategories
- GET /api/products/:id → getProduct

**Nginx Route:** `/api/products` → `http://localhost:5001`

### Cart Service (Port 5002)
**Routes:**
- GET /api/cart → getCart
- POST /api/cart/add → addToCart
- PUT /api/cart/items/:itemId → updateCartItem
- DELETE /api/cart/items/:itemId → removeFromCart
- DELETE /api/cart/clear → clearCart

**Nginx Route:** `/api/cart` → `http://localhost:5002`

### Order Service (Port 5003)
**Routes:**
- POST /api/orders → createOrder
- GET /api/orders → getOrders
- GET /api/orders/:id → getOrder (Added)

**Nginx Route:** `/api/orders` → `http://localhost:5003`
**RabbitMQ:** ✅ Publishes order events

### Auth Service (Port 5005)
**Routes:**
- POST /api/auth/register → register
- POST /api/auth/login → login
- POST /api/auth/forgot-password → forgotPassword
- POST /api/auth/reset-password → resetPassword

**Nginx Route:** `/api/auth` → `http://localhost:5005`

### Notification Service (Port 5004)
**WebSocket:** ws://localhost:5004
**RabbitMQ:** ✅ Consumes order events
**Broadcasts:** Real-time notifications to connected clients

## 🔧 Fixes Applied

1. ✅ Added missing `getOrder` endpoint in order-service
2. ✅ Created axios config with interceptors
3. ✅ All services use correct Nginx gateway URL
4. ✅ RabbitMQ initialized in order-service
5. ✅ Nginx routes to all microservices

## 🧪 Testing Checklist

### Manual Testing Steps:

1. **Start Services:**
```bash
# Terminal 1: Nginx
cd C:\nginx-1.28.0
nginx

# Terminal 2: Backend Services
cd c:\ecommerce-app\backend
start-all-services.bat

# Terminal 3: Frontend
cd c:\ecommerce-app
npm run start:shell
```

2. **Test Product Service:**
- Open http://localhost:3000
- Products should load on homepage
- Click on a product → Should show details

3. **Test Cart Service:**
- Click "Add to cart" on any product
- Go to cart page
- Update quantity
- Remove items

4. **Test Order Service:**
- Add items to cart
- Go to checkout
- Place order
- Check order confirmation

5. **Test Auth Service:**
- Go to /login
- Try to register
- Try to login

6. **Test Notifications (Optional):**
- Place an order
- Check browser console for WebSocket connection
- Should receive real-time notification

## 🔍 Debugging

### Check Nginx is routing correctly:
```bash
curl -k https://localhost:8080/health
```

### Check individual services:
```bash
curl http://localhost:5001/api/products
curl http://localhost:5002/api/cart
curl http://localhost:5003/api/orders
curl http://localhost:5005/api/auth/login
curl http://localhost:5004/health
```

### Check RabbitMQ:
```bash
cd backend
node test-rabbitmq-connection.js
```

## ⚠️ Known Issues

1. **SSL Certificate Warning:** Browser will show warning for self-signed cert - click "Advanced" → "Proceed"
2. **CORS:** If issues, check nginx CORS headers
3. **Auth Required:** Some endpoints need authentication token

## 📝 Notes

- All API calls go through Nginx (port 8080)
- Nginx handles rate limiting and caching
- Services communicate internally without SSL
- Frontend uses axios with automatic token injection
- Order service publishes to RabbitMQ on order creation
- Notification service consumes from RabbitMQ and broadcasts via WebSocket
