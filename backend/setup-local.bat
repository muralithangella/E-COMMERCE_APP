@echo off
echo ========================================
echo E-Commerce Local Environment Setup
echo ========================================

echo.
echo 1. Starting infrastructure services...
docker-compose -f docker-compose.local.yml up -d

echo.
echo 2. Waiting for services to be ready...
timeout /t 30 /nobreak

echo.
echo 3. Initializing MongoDB replica set...
docker exec mongodb-primary mongosh --eval "
try {
  rs.initiate({
    _id: 'rs0',
    members: [
      { _id: 0, host: 'mongodb-primary:27017', priority: 2 },
      { _id: 1, host: 'mongodb-secondary1:27017', priority: 1 },
      { _id: 2, host: 'mongodb-secondary2:27017', priority: 1 }
    ]
  });
  print('Replica set initialized successfully');
} catch(e) {
  print('Replica set may already be initialized: ' + e);
}"

echo.
echo 4. Waiting for replica set to stabilize...
timeout /t 20 /nobreak

echo.
echo 5. Testing connections...
node test-local-setup.js

echo.
echo 6. Setup complete! Services are running on:
echo   - MongoDB: localhost:27017, 27018, 27019
echo   - Redis: localhost:6379, 6380
echo   - Kafka: localhost:9092, 9093, 9094
echo   - Kafka UI: http://localhost:8080
echo   - Redis Commander: http://localhost:8081
echo   - MongoDB Express: http://localhost:8082
echo.
echo To start your application:
echo   npm run dev
echo.
echo To stop services:
echo   docker-compose -f docker-compose.local.yml down

pause