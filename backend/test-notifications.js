require('dotenv').config();
const RabbitMQManager = require('./config/rabbitmq');
const NotificationService = require('./services/notificationService');

async function testNotifications() {
  console.log('🧪 Testing E-Commerce Notification System...\n');
  
  try {
    // Connect to RabbitMQ
    console.log('1. Connecting to RabbitMQ...');
    await RabbitMQManager.connect();
    console.log('✅ RabbitMQ connected\n');
    
    // Test order confirmation
    console.log('2. Testing order confirmation notification...');
    const mockOrder = {
      id: 'ORD-TEST-' + Date.now(),
      orderNumber: 'ORD-TEST-' + Date.now(),
      items: [
        { name: 'Test Product', price: 99.99, quantity: 1 },
        { name: 'Another Product', price: 49.99, quantity: 2 }
      ],
      total: 199.97,
      orderDate: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7*24*60*60*1000).toISOString()
    };
    
    await NotificationService.sendOrderConfirmation(
      mockOrder,
      'test@example.com',
      '+1234567890'
    );
    console.log('✅ Order confirmation queued\n');
    
    // Test status update
    console.log('3. Testing order status update...');
    await NotificationService.sendOrderStatusUpdate(
      mockOrder,
      'test@example.com',
      '+1234567890',
      'shipped'
    );
    console.log('✅ Status update queued\n');
    
    // Start workers to process messages
    console.log('4. Starting notification workers...');
    await NotificationService.startNotificationWorkers();
    console.log('✅ Workers started - processing messages...\n');
    
    console.log('🎉 Test completed! Check console for notification processing.');
    console.log('📧 Email notifications will be logged (or sent if SMTP configured)');
    console.log('📱 SMS notifications will be logged (or sent if Twilio configured)');
    console.log('\n⏱️  Waiting 10 seconds for message processing...');
    
    setTimeout(() => {
      console.log('\n✨ Notification test finished!');
      process.exit(0);
    }, 10000);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testNotifications();