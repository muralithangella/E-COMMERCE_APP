# Local Testing Guide - E-Commerce Backend

## 🚀 Quick Start

### 1. Prerequisites
- Docker Desktop installed and running
- Node.js 18+ installed
- Git Bash or Windows Terminal

### 2. One-Command Setup
```bash
npm run setup:local
```

This will:
- Start all infrastructure services (MongoDB, Redis, Kafka)
- Initialize MongoDB replica set
- Test all connections
- Display service URLs

### 3. Start Your Application
```bash
# Option 1: Enhanced local server with detailed logging
node server-local.js

# Option 2: Regular development server
npm run dev

# Option 3: Start all microservices
npm run start:microservices
```

## 📊 Service URLs

### Infrastructure Services
- **MongoDB**: `localhost:27017, 27018, 27019`
- **Redis**: `localhost:6379, 6380`
- **Kafka**: `localhost:9092, 9093, 9094`

### Management UIs
- **Kafka UI**: http://localhost:8080
- **Redis Commander**: http://localhost:8081
- **MongoDB Express**: http://localhost:8082

### API Endpoints
- **Main API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

## 🧪 Testing Commands

### Test All Services
```bash
npm run test:local
```

### Test Individual Components
```bash
# Test API endpoints
npm run test:api

# Test specific endpoints
npm run test:endpoints

# Test client connections
npm run test:client
```

## 📝 Logging

### Log Files Location
```
backend/logs/
├── combined.log      # All logs
├── error.log         # Error logs only
├── requests.log      # API requests
└── database.log      # Database operations
```

### Console Logging
The enhanced local server provides colored console output:
- 🔴 **RED**: Errors
- 🟡 **YELLOW**: Warnings  
- 🔵 **CYAN**: Info messages
- 🟢 **GREEN**: Debug messages
- 🟣 **MAGENTA**: Service names

### Log Levels
Set log level via environment variable:
```bash
LOG_LEVEL=debug node server-local.js
```

Available levels: `error`, `warn`, `info`, `debug`, `verbose`

## 🔧 Docker Management

### Start Services
```bash
npm run docker:local:up
```

### Stop Services
```bash
npm run docker:local:down
```

### View Logs
```bash
npm run docker:local:logs
```

### Restart Services
```bash
npm run docker:local:restart
```

## 🐛 Troubleshooting

### MongoDB Issues
```bash
# Check replica set status
docker exec mongodb-primary mongosh --eval "rs.status()"

# Reinitialize replica set
docker exec mongodb-primary mongosh --eval "rs.reconfig({...})"
```

### Redis Issues
```bash
# Check Redis status
docker exec redis-master redis-cli ping

# View Redis info
docker exec redis-master redis-cli info
```

### Kafka Issues
```bash
# List topics
docker exec kafka1 kafka-topics --bootstrap-server localhost:9092 --list

# Check consumer groups
docker exec kafka1 kafka-consumer-groups --bootstrap-server localhost:9092 --list
```

### Port Conflicts
If ports are already in use, modify `docker-compose.local.yml`:
```yaml
ports:
  - "27020:27017"  # Change MongoDB port
  - "6380:6379"    # Change Redis port
  - "9095:9092"    # Change Kafka port
```

## 🔍 Health Monitoring

### Health Check Endpoint
```bash
curl http://localhost:5000/health
```

Response includes:
- Service status (MongoDB, Redis, Kafka)
- Memory usage
- Uptime
- Response time

### Service-Specific Health Checks
```bash
# MongoDB
curl http://localhost:5000/api/health/mongodb

# Redis
curl http://localhost:5000/api/health/redis

# Kafka
curl http://localhost:5000/api/health/kafka
```

## 📈 Performance Monitoring

### Built-in Performance Logging
The enhanced logger tracks:
- Request/response times
- Database query performance
- Redis operation times
- Kafka message processing

### Memory Usage
```bash
# Check Node.js memory usage
curl http://localhost:5000/health | jq '.memory'
```

## 🔐 Security for Local Testing

### Default Credentials
- **MongoDB**: `admin:password`
- **Redis**: No password (local only)
- **Kafka**: No authentication (local only)

### Environment Variables
Copy `.env.example` to `.env` and update:
```bash
cp .env.example .env
```

## 🚦 Development Workflow

### 1. Start Infrastructure
```bash
npm run docker:local:up
```

### 2. Test Connections
```bash
npm run test:local
```

### 3. Start Development Server
```bash
node server-local.js
```

### 4. Make Changes
- Code changes trigger automatic restart (if using nodemon)
- Logs appear in console with colors
- Check health endpoint for service status

### 5. Test Your Changes
```bash
npm run test:api
```

### 6. Stop Services (when done)
```bash
npm run docker:local:down
```

## 📚 Additional Resources

- [MongoDB Replica Set Documentation](https://docs.mongodb.com/manual/replication/)
- [Redis Cluster Documentation](https://redis.io/topics/cluster-tutorial)
- [Kafka Documentation](https://kafka.apache.org/documentation/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## 🆘 Getting Help

If you encounter issues:

1. Check the logs: `npm run docker:local:logs`
2. Test connections: `npm run test:local`
3. Restart services: `npm run docker:local:restart`
4. Check Docker Desktop for container status
5. Verify ports are not in use: `netstat -an | findstr :27017`