# Microservices Architecture Diagram

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                    (React Applications)                          │
│                   http://localhost:3000                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Requests
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY (Optional)                      │
│                     http://localhost:5000                        │
│                   Routes to microservices                        │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐     ┌──────────────┐
│   PRODUCT    │      │     CART     │     │    ORDER     │
│   SERVICE    │      │   SERVICE    │     │   SERVICE    │
│   Port 5001  │      │   Port 5002  │     │   Port 5003  │
└──────────────┘      └──────────────┘     └──────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐     ┌──────────────┐
│   MongoDB    │      │   MongoDB    │     │   MongoDB    │
│   products   │      │    carts     │     │    orders    │
└──────────────┘      └──────────────┘     └──────────────┘

        ┌─────────────────────┐
        │                     │
        ▼                     ▼
┌──────────────┐      ┌──────────────┐
│     AUTH     │      │     USER     │
│   SERVICE    │      │   SERVICE    │
│   Port 5004  │      │   Port 5005  │
└──────────────┘      └──────────────┘
        │                     │
        ▼                     ▼
┌──────────────┐      ┌──────────────┐
│   MongoDB    │      │   MongoDB    │
│    users     │      │    users     │
└──────────────┘      └──────────────┘
```

## 📦 Service Details

### Product Service (Port 5001)
```
product-service/
├── src/
│   ├── controllers/
│   │   └── productController.js    ← Handles product requests
│   ├── middleware/
│   │   └── errorHandler.js         ← Error handling
│   ├── models/
│   │   └── product.js              ← Product schema
│   ├── routes/
│   │   └── productRoutes.js        ← API routes
│   ├── utils/
│   │   └── logger.js               ← Logging
│   └── server.js                   ← Service entry
└── package.json                    ← Dependencies

Endpoints:
  GET  /api/products       - List all products
  GET  /api/products/:id   - Get product details
```

### Cart Service (Port 5002)
```
cart-service/
├── src/
│   ├── controllers/
│   │   └── cartController.js       ← Cart operations
│   ├── models/
│   │   └── cart.js                 ← Cart schema
│   ├── routes/
│   │   └── cartRoutes.js           ← Cart routes
│   └── server.js                   ← Service entry
└── package.json

Endpoints:
  GET  /api/cart          - Get user cart
  POST /api/cart/add      - Add item to cart
```

### Order Service (Port 5003)
```
order-service/
├── src/
│   ├── controllers/
│   │   └── orderController.js      ← Order processing
│   ├── models/
│   │   └── order.js                ← Order schema
│   ├── routes/
│   │   └── orderRoutes.js          ← Order routes
│   └── server.js                   ← Service entry
└── package.json

Endpoints:
  POST /api/orders        - Create new order
  GET  /api/orders        - Get user orders
```

### Auth Service (Port 5004)
```
auth-service/
├── src/
│   ├── controllers/
│   │   └── authController.js       ← Authentication
│   ├── models/
│   │   └── user.js                 ← User schema
│   ├── routes/
│   │   └── authRoutes.js           ← Auth routes
│   └── server.js                   ← Service entry
└── package.json

Endpoints:
  POST /api/auth/register - Register user
  POST /api/auth/login    - Login user
```

## 🔄 Request Flow Example

### User Adds Product to Cart

```
1. Frontend
   └─> POST http://localhost:5002/api/cart/add
       Body: { productId: "123", quantity: 1 }

2. Cart Service (5002)
   ├─> cartController.addToCart()
   ├─> Validates request
   └─> Saves to MongoDB

3. Response
   └─> { message: "Item added", cart: {...} }
```

### User Places Order

```
1. Frontend
   └─> POST http://localhost:5003/api/orders
       Body: { items: [...], total: 299.99 }

2. Order Service (5003)
   ├─> orderController.createOrder()
   ├─> Generates order number
   ├─> Saves to MongoDB
   └─> (Optional) Publishes event to message queue

3. Response
   └─> { orderNumber: "ORD-123", status: "confirmed" }
```

## 🔌 Inter-Service Communication

### Current: Direct HTTP Calls
```
Cart Service ──HTTP──> Product Service
                       (Get product details)
```

### Future: Message Queue (Optional)
```
Order Service ──Publish──> RabbitMQ/Kafka ──Subscribe──> Inventory Service
                                          └──Subscribe──> Notification Service
```

## 🗄️ Database Strategy

### Option 1: Shared Database (Current)
```
All Services ──> MongoDB (localhost:27017)
                 └── Collections:
                     ├── products
                     ├── carts
                     ├── orders
                     └── users
```

### Option 2: Database Per Service (Recommended)
```
Product Service  ──> MongoDB (products_db)
Cart Service     ──> MongoDB (carts_db)
Order Service    ──> MongoDB (orders_db)
Auth Service     ──> MongoDB (users_db)
```

## 🚀 Deployment Options

### Option 1: Local Development
```
Terminal 1: cd product-service && npm start
Terminal 2: cd cart-service && npm start
Terminal 3: cd order-service && npm start
Terminal 4: cd auth-service && npm start
```

### Option 2: Docker Compose
```
docker-compose up
  ├── product-service:5001
  ├── cart-service:5002
  ├── order-service:5003
  └── auth-service:5004
```

### Option 3: Kubernetes
```
kubectl apply -f k8s/
  ├── product-deployment.yaml
  ├── cart-deployment.yaml
  ├── order-deployment.yaml
  └── auth-deployment.yaml
```

## 📊 Scaling Strategy

```
Load Balancer
      │
      ├──> Product Service Instance 1 (5001)
      ├──> Product Service Instance 2 (5011)
      └──> Product Service Instance 3 (5021)

      ├──> Cart Service Instance 1 (5002)
      └──> Cart Service Instance 2 (5012)

      └──> Order Service Instance 1 (5003)
```

## 🔐 Security Flow

```
1. User Login
   Frontend ──> Auth Service (5004)
                └──> Returns JWT Token

2. Authenticated Request
   Frontend ──> Cart Service (5002)
   Header: Authorization: Bearer <token>
                └──> Validates token
                └──> Processes request
```

## 📈 Monitoring & Logging

```
Each Service
    ├──> Winston Logger ──> Console/File
    ├──> Metrics ──> Prometheus (optional)
    └──> Traces ──> Jaeger (optional)
```

## ✨ Benefits of This Architecture

1. **Independent Scaling**
   - Scale product service separately from cart service

2. **Technology Freedom**
   - Product service: Node.js
   - Payment service: Python (future)
   - Notification service: Go (future)

3. **Fault Isolation**
   - Cart service down? Product service still works

4. **Team Autonomy**
   - Team A owns product-service
   - Team B owns order-service

5. **Deployment Independence**
   - Deploy product-service without affecting others

## 🎯 Summary

This architecture provides:
- ✅ True microservices separation
- ✅ Independent deployment
- ✅ Scalability per service
- ✅ Technology flexibility
- ✅ Fault tolerance
- ✅ Team autonomy

**Matches social-media-microservices pattern exactly!** 🎯
