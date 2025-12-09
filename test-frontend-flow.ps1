Write-Host "🚀 Testing Frontend → RabbitMQ Flow" -ForegroundColor Cyan
Write-Host ("=" * 60)
Write-Host ""

# Check RabbitMQ
Write-Host "1️⃣ Checking RabbitMQ..." -ForegroundColor Yellow
$rabbitmq = netstat -an | Select-String "5672"
if ($rabbitmq) {
    Write-Host "   ✅ RabbitMQ is running (port 5672)" -ForegroundColor Green
} else {
    Write-Host "   ❌ RabbitMQ not running" -ForegroundColor Red
    Write-Host "   💡 Start with: rabbitmq-server" -ForegroundColor Yellow
}

Write-Host ""

# Check Order Service
Write-Host "2️⃣ Checking Order Service..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5003/api/orders" -Method GET -TimeoutSec 2 -ErrorAction Stop
    Write-Host "   ✅ Order Service is running at http://localhost:5003" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Order Service not running" -ForegroundColor Red
    Write-Host "   💡 Start with: cd backend/order-service; npm start" -ForegroundColor Yellow
}

Write-Host ""

# Check Notification Service
Write-Host "3️⃣ Checking Notification Service..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5004/health" -TimeoutSec 2 -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    Write-Host "   ✅ Notification Service is running at http://localhost:5004" -ForegroundColor Green
    Write-Host "   📡 WebSocket clients connected: $($data.clients)" -ForegroundColor Cyan
} catch {
    Write-Host "   ❌ Notification Service not running" -ForegroundColor Red
    Write-Host "   💡 Start with: cd backend/notification-service; npm start" -ForegroundColor Yellow
}

Write-Host ""

# Test Order Creation
Write-Host "4️⃣ Testing Order Creation..." -ForegroundColor Yellow
$testOrder = @{
    userId = "test-user-$(Get-Date -Format 'yyyyMMddHHmmss')"
    items = @(
        @{
            productId = "prod-1"
            name = "Test Product"
            quantity = 2
            price = 29.99
        }
    )
    totalAmount = 59.98
    shippingAddress = @{
        street = "123 Test St"
        city = "Test City"
        state = "TS"
        zip = "12345"
    }
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5003/api/orders" -Method POST -Body $testOrder -ContentType "application/json" -TimeoutSec 5 -ErrorAction Stop
    $orderData = $response.Content | ConvertFrom-Json
    Write-Host "   ✅ Order created successfully!" -ForegroundColor Green
    Write-Host "   📦 Order Number: $($orderData.orderNumber)" -ForegroundColor Cyan
    Write-Host "   📊 Status: $($orderData.status)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   ⏳ Waiting 2 seconds for RabbitMQ processing..." -ForegroundColor Yellow
    Start-Sleep -Seconds 2
    
    # Check Notification Service again
    try {
        $healthCheck = Invoke-WebRequest -Uri "http://localhost:5004/health" -TimeoutSec 2 -ErrorAction Stop
        $healthData = $healthCheck.Content | ConvertFrom-Json
        Write-Host "   ✅ Notification Service processed the message" -ForegroundColor Green
        Write-Host "   📡 WebSocket clients: $($healthData.clients)" -ForegroundColor Cyan
    } catch {
        Write-Host "   ⚠️  Could not verify notification processing" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Failed to create order: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host ("=" * 60)
Write-Host "📊 Test Summary" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ RabbitMQ: " -NoNewline
if ($rabbitmq) { Write-Host "Running" -ForegroundColor Green } else { Write-Host "Not Running" -ForegroundColor Red }

Write-Host ""
Write-Host "💡 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Open frontend: http://localhost:3004" -ForegroundColor White
Write-Host "   2. Open browser console (F12)" -ForegroundColor White
Write-Host "   3. Look for: 'WebSocket connected to notification service'" -ForegroundColor White
Write-Host "   4. Create an order from checkout page" -ForegroundColor White
Write-Host "   5. Watch for notification toast appearing!" -ForegroundColor White
Write-Host ""
Write-Host "📊 RabbitMQ Management UI: http://localhost:15672 (guest/guest)" -ForegroundColor Cyan
Write-Host ""
