# START HERE - Simple Commands

## Option 1: Start with PM2 (Recommended for Production)

### Step 1: Open PowerShell/CMD as Administrator

### Step 2: Install PM2
```bash
npm install -g pm2
```

### Step 3: Refresh PATH (close and reopen terminal)

### Step 4: Start services
```bash
cd c:\ecommerce-app\backend
pm2 start ecosystem.config.js
```

### Step 5: Check status
```bash
pm2 status
pm2 logs
```

---

## Option 2: Start Manually (If PM2 doesn't work)

Open **5 separate terminals** and run:

### Terminal 1:
```bash
cd c:\ecommerce-app\backend\product-service
npm start
```

### Terminal 2:
```bash
cd c:\ecommerce-app\backend\cart-service
npm start
```

### Terminal 3:
```bash
cd c:\ecommerce-app\backend\order-service
npm start
```

### Terminal 4:
```bash
cd c:\ecommerce-app\backend\auth-service
npm start
```

### Terminal 5:
```bash
cd c:\ecommerce-app\backend\notification-service
npm start
```

---

## Test It Works

Open browser: http://localhost:5006/health

Should see: `{"status":"ok","service":"product",...}`

---

## PM2 Commands (After Starting)

```bash
pm2 status          # View all services
pm2 logs            # View all logs
pm2 stop all        # Stop all services
pm2 restart all     # Restart all services
pm2 delete all      # Remove all services
pm2 monit           # Real-time dashboard
```

---

## Troubleshooting

### PM2 not found after install
Close terminal and reopen, then try again.

### Port already in use
```bash
pm2 stop all
pm2 delete all
```

### Redis/RabbitMQ errors
System works without them. Ignore these errors for now.
