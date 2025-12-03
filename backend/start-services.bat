@echo off
echo Starting E-Commerce Services with RabbitMQ and Notifications...

echo.
echo 1. Starting infrastructure services (MongoDB, Redis, RabbitMQ, Kafka)...
docker-compose up -d mongodb redis rabbitmq zookeeper kafka

echo.
echo 2. Waiting for services to be ready...
timeout /t 10 /nobreak > nul

echo.
echo 3. Installing dependencies...
call npm install

echo.
echo 4. Starting microservices...
start "API Gateway" cmd /k "npm run start:gateway"
timeout /t 2 /nobreak > nul

start "Auth Service" cmd /k "npm run start:auth"
timeout /t 2 /nobreak > nul

start "Products Service" cmd /k "npm run start:products"
timeout /t 2 /nobreak > nul

start "Orders Service" cmd /k "npm run start:orders"
timeout /t 2 /nobreak > nul

start "Notifications Service" cmd /k "npm run start:notifications"
timeout /t 2 /nobreak > nul

echo.
echo ✅ All services started!
echo.
echo 📊 Service URLs:
echo   - API Gateway: http://localhost:5000
echo   - RabbitMQ Management: http://localhost:15672 (admin/password)
echo   - MongoDB: mongodb://localhost:27017
echo   - Redis: redis://localhost:6379
echo.
echo 📧 Email/SMS notifications are configured via RabbitMQ
echo 🔔 Check console logs for notification processing
echo.
pause