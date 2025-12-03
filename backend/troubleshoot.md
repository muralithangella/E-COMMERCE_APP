# Troubleshooting Guide

## Common Issues

### 1. MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
- Start MongoDB: `net start MongoDB` (Windows) or `brew services start mongodb` (Mac)
- Check MongoDB is running: `mongo --eval "db.adminCommand('ismaster')"`

### 2. Redis Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```
**Solution:**
- Start Redis: `redis-server` or use Docker: `docker run -d -p 6379:6379 redis`

### 3. Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution:**
- Kill process: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`
- Or use different port: `PORT=5001 npm start`

### 4. Missing Environment Variables
**Solution:**
- Copy `.env` file and update values
- Ensure all required variables are set

### 5. Kafka Connection Issues
**Solution:**
- Use Docker: `docker-compose up -d kafka zookeeper`
- Or disable Kafka temporarily by commenting out Kafka calls

## Quick Start Commands

### Using Docker (Easiest)
```bash
docker-compose up -d
```

### Manual Setup
```bash
# Install dependencies
npm install

# Start infrastructure
docker-compose up -d mongodb redis

# Start application
npm start
```

### Development Mode
```bash
npm run dev
```

## Health Check URLs
- Main Health: http://localhost:5000/health
- Readiness: http://localhost:5000/ready
- Liveness: http://localhost:5000/live

## API Testing
Use Postman or curl to test:
```bash
curl http://localhost:5000/api/products
curl http://localhost:5000/health
```