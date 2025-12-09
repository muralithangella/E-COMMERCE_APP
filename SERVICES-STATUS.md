# Services Status & Configuration

## ✅ Fixed Issues

1. **RabbitMQ Integration**
   - ✅ Added `amqplib` dependency to order-service
   - ✅ Initialized RabbitMQ connection in order-service
   - ✅ Notification service properly consumes from RabbitMQ queue
   - ✅ Order service publishes events to `order_events` queue

2. **Port Conflicts**
   - ✅ Auth Service: Changed from 5004 → 5005
   - ✅ Notification Service: Uses 5004 (WebSocket)
   - ✅ Updated API Gateway service registry

3. **Missing Dependencies**
   - ✅ Added `amqplib` and `dotenv` to order-service

## 🚀 Service Ports

| Service | Port | Protocol | Status |
|---------|------|----------|--------|
| Frontend Shell | 3000 | HTTP | ✅ |
| Products MF | 3001 | HTTP | ✅ |
| Cart MF | 3002 | HTTP | ✅ |
| Auth MF | 3003 | HTTP | ✅ |
| Main Backend | 5000 | HTTPS | ✅ |
| Product Service | 5001 | HTTPS | ✅ |
| Cart Service | 5002 | HTTPS | ✅ |
| Order Service | 5003 | HTTPS | ✅ |
| Notification Service | 5004 | HTTP/WS | ✅ |
| Auth Service | 5005 | HTTPS | ✅ |
| API Gateway | 8080 | HTTPS | ✅ |
| Nginx | 8080 | HTTPS | ✅ |

## 📦 RabbitMQ Setup

**Queue**: `order_events`

**Flow**:
```
Order Service → RabbitMQ → Notification Service → WebSocket → Frontend
```

**Events Published**:
- `order.created`
- `order.updated`
- `order.cancelled`
- `order.completed`

**Start RabbitMQ**:
```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

**Access Management UI**: http://localhost:15672 (guest/guest)

## 🔧 Installation Commands

**Install all dependencies**:
```bash
npm run install:all
cd backend/order-service && npm install
cd ../notification-service && npm install
```

**Start all services**:
```bash
# Backend microservices
cd backend
start-all-services.bat

# Or start individually
npm start  # Main backend on 5000

# Frontend
npm run start:shell
npm run start:products
npm run start:cart

# API Gateway (optional)
npm run gateway

# Nginx (optional)
cd C:\nginx-1.28.0
nginx
```

## 🔍 Health Checks

- Main Backend: https://localhost:5000/health
- Product Service: https://localhost:5001/health
- Cart Service: https://localhost:5002/health
- Order Service: https://localhost:5003/health
- Notification Service: http://localhost:5004/health
- Auth Service: https://localhost:5005/health
- API Gateway: https://localhost:8080/health

## 📝 API Endpoints

All endpoints available through:
- **Direct**: https://localhost:5000/api/*
- **Gateway**: https://localhost:8080/api/*
- **Nginx**: https://localhost:8080/api/*

### Public Endpoints
- `GET /api/products` - List products
- `GET /api/products/:id` - Product details
- `GET /api/categories` - Categories
- `GET /api/deals` - Deals
- `GET /api/recommendations` - Recommendations
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register

### Protected Endpoints (Require Auth)
- `GET /api/cart` - Get cart
- `POST /api/cart/add` - Add to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove from cart
- `GET /api/orders` - List orders
- `POST /api/orders` - Create order

## 🔐 Security Features

- ✅ Helmet.js security headers
- ✅ CORS protection
- ✅ Rate limiting (API Gateway)
- ✅ JWT authentication
- ✅ Redis caching
- ✅ HTTPS/SSL encryption
- ✅ Input validation

## 📊 Monitoring

**RabbitMQ**: http://localhost:15672
**Redis**: Connect via redis-cli on port 6379
**Logs**: Check `backend/logs/` directory

## ⚠️ Known Issues

1. **External Images**: Amazon CDN images return 404 (non-critical)
2. **React Router Warnings**: Fixed with future flags
3. **SSL Certificates**: Self-signed certs may show browser warnings

## 🎯 Next Steps

1. Start RabbitMQ: `docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management`
2. Install dependencies: `cd backend/order-service && npm install`
3. Start services: `cd backend && start-all-services.bat`
4. Test order flow to verify RabbitMQ integration
