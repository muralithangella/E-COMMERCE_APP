require('dotenv').config({ path: '../../.env' });
const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
const QUEUE_NAME = 'order_events';

async function testConnection() {
  console.log('🔍 Testing RabbitMQ Connection...\n');
  console.log(`📍 RabbitMQ URL: ${RABBITMQ_URL}`);
  console.log(`📍 Queue Name: ${QUEUE_NAME}\n`);

  let connection = null;
  let channel = null;

  try {
    console.log('1️⃣ Connecting to RabbitMQ...');
    connection = await amqp.connect(RABBITMQ_URL);
    console.log('✅ Connected successfully!\n');

    console.log('2️⃣ Creating channel...');
    channel = await connection.createChannel();
    console.log('✅ Channel created!\n');

    console.log('3️⃣ Checking queue...');
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    const queueInfo = await channel.checkQueue(QUEUE_NAME);
    console.log(`✅ Queue "${QUEUE_NAME}" exists`);
    console.log(`   - Messages ready: ${queueInfo.messageCount}`);
    console.log(`   - Consumers: ${queueInfo.consumerCount}\n`);

    console.log('4️⃣ Testing message publish...');
    const testMsg = {
      eventType: 'TEST',
      data: { test: true },
      timestamp: new Date().toISOString()
    };
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(testMsg)), { persistent: true });
    console.log('✅ Test message published!\n');

    console.log('🎉 RabbitMQ is working correctly! ✅\n');
    console.log('📊 Management UI: http://localhost:15672 (guest/guest)\n');

  } catch (error) {
    console.error('\n❌ RabbitMQ Test Failed!\n');
    console.error('Error:', error.message);
    console.error('\n💡 Make sure RabbitMQ is running:');
    console.error('   - Windows: rabbitmq-server');
    console.error('   - Docker: docker-compose up -d rabbitmq\n');
    process.exit(1);
  } finally {
    if (channel) await channel.close();
    if (connection) await connection.close();
  }
}

testConnection().catch(console.error);

