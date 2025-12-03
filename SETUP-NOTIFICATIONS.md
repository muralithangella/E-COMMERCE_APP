# E-Commerce Notifications Setup Guide

## 🚀 Quick Start

### 1. Start Infrastructure Services
```bash
cd backend
docker-compose up -d mongodb redis rabbitmq zookeeper kafka
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Services
```bash
# Option A: Use the batch script (Windows)
start-services.bat

# Option B: Start manually
npm run start:gateway
npm run start:orders
npm run start:notifications
```

## 📧 Email & SMS Configuration

### Email Setup (Amazon SES Compatible)
Edit `backend/.env`:
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-aws-access-key
SMTP_PASS=your-aws-secret-key
EMAIL_FROM=E-Shop <noreply@yourdomain.com>
```

### SMS Setup (Twilio - Same as Amazon SNS)
```env
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

## 🐰 RabbitMQ Features

### Message Queues
- `email.notifications` - Email processing
- `sms.notifications` - SMS processing
- `order.created` - New order events
- `order.updated` - Order status changes

### Management UI
- URL: http://localhost:15672
- Username: admin
- Password: password

## 🔔 Notification Flow

### Order Confirmation
1. Customer places order on frontend
2. Order data sent to `/api/orders` endpoint
3. Order controller publishes to RabbitMQ
4. Notification workers process email/SMS
5. Customer receives confirmation

### Order Status Updates
1. Order status changed via API
2. Status update published to RabbitMQ
3. Notification workers send updates
4. Customer receives status notification

## 🧪 Testing

### Test Notifications
```bash
node test-notifications.js
```

### Manual API Testing
```bash
# Test email
curl -X POST http://localhost:3006/api/notifications/email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "content": "<h1>Test Message</h1>",
    "template": "order"
  }'

# Test SMS
curl -X POST http://localhost:3006/api/notifications/sms \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+1234567890",
    "message": "Test SMS from E-Shop"
  }'
```

## 📱 Frontend Integration

### Order Confirmation Page
- Fetches order details from API: `/api/orders/{orderId}`
- Falls back to localStorage if API unavailable
- Displays complete order information

### Checkout Process
- Includes email field for notifications
- Submits order to backend API
- Triggers automatic email/SMS notifications

## 🔧 Service Architecture

### Backend Services
- **Gateway** (Port 5000) - Routes requests
- **Orders** (Port 3003) - Order processing + RabbitMQ
- **Notifications** (Port 3006) - Email/SMS workers

### Message Flow
```
Frontend → Gateway → Orders Service → RabbitMQ → Notification Workers → Email/SMS
```

## 📊 Monitoring

### Service Health
- Gateway: http://localhost:5000/health
- Orders: http://localhost:3003/health
- Notifications: http://localhost:3006/health

### RabbitMQ Monitoring
- Management UI: http://localhost:15672
- Check queue lengths and message rates
- Monitor worker performance

## 🛠️ Troubleshooting

### RabbitMQ Connection Issues
```bash
# Check if RabbitMQ is running
docker ps | grep rabbitmq

# Restart RabbitMQ
docker-compose restart rabbitmq
```

### Email Not Sending
1. Check SMTP credentials in `.env`
2. Verify email service logs
3. Check RabbitMQ queue for stuck messages

### SMS Not Sending
1. Verify Twilio credentials
2. Check phone number format (+1234567890)
3. Review Twilio console for errors

## 🎯 Production Deployment

### Environment Variables
```env
NODE_ENV=production
RABBITMQ_URL=amqp://user:pass@rabbitmq-server:5672
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
TWILIO_ACCOUNT_SID=production-sid
```

### Scaling
- Run multiple notification workers
- Use RabbitMQ clustering
- Implement dead letter queues
- Add monitoring and alerting

## 📈 Features Implemented

✅ **RabbitMQ Integration** - Async message processing  
✅ **Email Notifications** - Order confirmations & updates  
✅ **SMS Notifications** - Real-time order alerts  
✅ **Order API** - Complete order management  
✅ **Frontend Integration** - Order details from API  
✅ **Amazon-style Templates** - Professional email design  
✅ **Error Handling** - Graceful fallbacks  
✅ **Docker Support** - Easy infrastructure setup  
✅ **Health Monitoring** - Service status checks  
✅ **Testing Tools** - Comprehensive test suite  

## 🚀 Next Steps

1. Configure real SMTP/SMS credentials
2. Start services with `start-services.bat`
3. Test order flow from frontend
4. Monitor RabbitMQ queues
5. Check email/SMS delivery