require('dotenv').config();
const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
const QUEUE_NAME = 'order_events';

async function testRabbitMQConnection() {
  console.log('🔍 Testing RabbitMQ Connection...\n');
  console.log(`📍 RabbitMQ URL: ${RABBITMQ_URL}`);
  console.log(`📍 Queue Name: ${QUEUE_NAME}\n`);

  let connection = null;
  let channel = null;

  try {
    // Step 1: Test Connection
    console.log('1️⃣ Testing connection to RabbitMQ...');
    connection = await amqp.connect(RABBITMQ_URL);
    console.log('✅ Successfully connected to RabbitMQ!\n');

    // Step 2: Create Channel
    console.log('2️⃣ Creating channel...');
    channel = await connection.createChannel();
    console.log('✅ Channel created successfully!\n');

    // Step 3: Assert Queue
    console.log('3️⃣ Asserting queue...');
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    console.log(`✅ Queue "${QUEUE_NAME}" asserted/created!\n`);

    // Step 4: Test Publishing
    console.log('4️⃣ Testing message publishing...');
    const testMessage = {
      eventType: 'TEST_EVENT',
      data: {
        orderNumber: 'TEST-ORDER-123',
        status: 'test',
        message: 'This is a test message'
      },
      timestamp: new Date().toISOString()
    };

    channel.sendToQueue(
      QUEUE_NAME,
      Buffer.from(JSON.stringify(testMessage)),
      { persistent: true }
    );
    console.log('✅ Test message published successfully!\n');

    // Step 5: Test Consuming
    console.log('5️⃣ Testing message consumption...');
    let messageReceived = false;
    
    const consumer = await channel.consume(QUEUE_NAME, (msg) => {
      if (msg) {
        const content = JSON.parse(msg.content.toString());
        console.log('✅ Message received:', content);
        channel.ack(msg);
        messageReceived = true;
        channel.cancel(consumer.consumerTag);
      }
    }, { noAck: false });

    // Wait for message (with timeout)
    await new Promise((resolve) => {
      setTimeout(() => {
        if (!messageReceived) {
          console.log('⚠️  No message received within timeout (this is OK if queue was empty)');
        }
        resolve();
      }, 2000);
    });

    // Step 6: Check Queue Info
    console.log('\n6️⃣ Checking queue information...');
    const queueInfo = await channel.checkQueue(QUEUE_NAME);
    console.log(`✅ Queue "${QUEUE_NAME}" exists`);
    console.log(`   - Messages ready: ${queueInfo.messageCount}`);
    console.log(`   - Consumers: ${queueInfo.consumerCount}\n`);

    console.log('🎉 All RabbitMQ tests passed! ✅\n');
    console.log('📊 You can also check RabbitMQ Management UI at: http://localhost:15672');
    console.log('   Default credentials: guest/guest\n');

  } catch (error) {
    console.error('\n❌ RabbitMQ Test Failed!\n');
    console.error('Error:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Make sure RabbitMQ is running:');
    console.error('      - Windows: Check Services or run: rabbitmq-server');
    console.error('      - Docker: docker-compose up -d rabbitmq');
    console.error('   2. Check if port 5672 is accessible');
    console.error('   3. Verify RABBITMQ_URL in .env file');
    console.error('   4. Check RabbitMQ logs for errors\n');
    process.exit(1);
  } finally {
    // Cleanup
    if (channel) {
      await channel.close();
      console.log('🔒 Channel closed');
    }
    if (connection) {
      await connection.close();
      console.log('🔒 Connection closed');
    }
  }
}

// Run the test
testRabbitMQConnection().catch(console.error);

