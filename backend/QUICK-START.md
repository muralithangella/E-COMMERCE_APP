# Quick Start Guide - No Docker Required

## Prerequisites

1. **Node.js 18+** installed
2. **Redis** (optional - system works without it)
3. **RabbitMQ** (optional - system works without it)

## Simple Start (Without Docker)

### Step 1: Install PM2 Globally

```bash
npm install -g pm2
```

### Step 2: Start All Services with PM2

```bash
cd backend
pm2 start ecosystem.config.js
```

### Step 3: Check Status

```bash
pm2 status
pm2 logs
```

### Step 4: Access Application

- API: https://localhost:8080/api/products
- Product Service: http://localhost:5006
- Cart Service: http://localhost:5002
- Order Service: http://localhost:5003
- Auth Service: http://localhost:5005

## Alternative: Start Services Individually

If PM2 doesn't work, start each service manually:

### Terminal 1 - Product Service
```bash
cd backend/product-service
npm start
```

### Terminal 2 - Cart Service
```bash
cd backend/cart-service
npm start
```

### Terminal 3 - Order Service
```bash
cd backend/order-service
npm start
```

### Terminal 4 - Auth Service
```bash
cd backend/auth-service
npm start
```

### Terminal 5 - Notification Service
```bash
cd backend/notification-service
npm start
```

## PM2 Commands

```bash
pm2 status              # View all services
pm2 logs                # View logs
pm2 logs product-service # View specific service
pm2 restart all         # Restart all
pm2 stop all            # Stop all
pm2 delete all          # Remove all
pm2 monit               # Real-time monitoring
```

## Install Redis (Optional - For Caching)

### Windows:
Download from: https://github.com/microsoftarchive/redis/releases
Or use: `choco install redis-64`

### Start Redis:
```bash
redis-server
```

## Install RabbitMQ (Optional - For Notifications)

### Windows:
Download from: https://www.rabbitmq.com/install-windows.html

### Start RabbitMQ:
```bash
rabbitmq-server
```

## Troubleshooting

### Error: PM2 not found
```bash
npm install -g pm2
# Or use npx
npx pm2 start ecosystem.config.js
```

### Error: Redis connection failed
System works without Redis, but caching is disabled.
To fix: Install and start Redis.

### Error: RabbitMQ connection failed
System works without RabbitMQ, but notifications are disabled.
To fix: Install and start RabbitMQ.

### Error: Port already in use
```bash
# Stop all PM2 processes
pm2 stop all
pm2 delete all

# Or kill specific port
netstat -ano | findstr :5006
taskkill /PID <PID> /F
```

## Production Mode (With All Features)

1. Install Docker Desktop
2. Start Docker
3. Run:
```bash
cd backend
docker-compose -f docker-compose.prod.yml up -d
pm2 start ecosystem.config.js
```

This starts Redis, RabbitMQ, and Nginx automatically.
