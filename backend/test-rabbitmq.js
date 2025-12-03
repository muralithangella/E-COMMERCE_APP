require('dotenv').config();
const { connectRabbitMQ, publishMessage, consumeMessage } = require('./config/rabbitmq');

async function testRabbitMQ() {
  console.log('🔍 Testing RabbitMQ Connection...');
  
  try {
    await connectRabbitMQ();
    console.log('✅ RabbitMQ: Connected successfully');
    
    // Test publishing a message
    await publishMessage('orders', 'order.test', {
      orderId: 'test-123',
      message: 'Test order message',
      timestamp: new Date()
    });
    console.log('✅ RabbitMQ Publish: Test message sent');
    
    // Test consuming a message
    await consumeMessage('order.created', (message) => {
      console.log('✅ RabbitMQ Consume: Message received', message);
    });
    
    console.log('\n🎉 RabbitMQ is ready for development!');
    
    setTimeout(() => {
      process.exit(0);
    }, 2000);
    
  } catch (error) {
    console.log('❌ RabbitMQ Connection Failed:', error.message);
    console.log('\n💡 Make sure RabbitMQ is running:');
    console.log('   Check RabbitMQ Management: http://localhost:15672');
    process.exit(1);
  }
}

testRabbitMQ();