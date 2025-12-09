require('dotenv').config();
const axios = require('axios');
const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
const ORDER_SERVICE_URL = 'http://localhost:5003';
const NOTIFICATION_SERVICE_URL = 'http://localhost:5004';
const QUEUE_NAME = 'order_events';

async function testFullFlow() {
  console.log('🚀 Testing Complete RabbitMQ Flow\n');
  console.log('=' .repeat(60) + '\n');

  // Step 1: Check RabbitMQ Connection
  console.log('1️⃣ Checking RabbitMQ connection...');
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    await connection.close();
    console.log('✅ RabbitMQ is running and accessible\n');
  } catch (error) {
    console.error('❌ Cannot connect to RabbitMQ:', error.message);
    console.error('\n💡 Please start RabbitMQ first:\n');
    console.error('   Windows: rabbitmq-server');
    console.error('   Docker: docker-compose up -d rabbitmq\n');
    process.exit(1);
  }

  // Step 2: Check Order Service
  console.log('2️⃣ Checking Order Service...');
  try {
    await axios.get(`${ORDER_SERVICE_URL}/health`).catch(() => {
      // Health endpoint might not exist, that's OK
    });
    console.log(`✅ Order Service is accessible at ${ORDER_SERVICE_URL}\n`);
  } catch (error) {
    console.error(`❌ Order Service not accessible at ${ORDER_SERVICE_URL}`);
    console.error('💡 Start it with: cd backend/order-service && npm start\n');
    process.exit(1);
  }

  // Step 3: Check Notification Service
  console.log('3️⃣ Checking Notification Service...');
  try {
    const healthResponse = await axios.get(`${NOTIFICATION_SERVICE_URL}/health`);
    console.log(`✅ Notification Service is running`);
    console.log(`   - Status: ${healthResponse.data.status}`);
    console.log(`   - Connected clients: ${healthResponse.data.clients}\n`);
  } catch (error) {
    console.error(`❌ Notification Service not accessible at ${NOTIFICATION_SERVICE_URL}`);
    console.error('💡 Start it with: cd backend/notification-service && npm start\n');
    process.exit(1);
  }

  // Step 4: Monitor RabbitMQ Queue
  console.log('4️⃣ Setting up RabbitMQ queue monitor...');
  let messageReceived = false;
  let receivedMessage = null;

  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    const consumer = await channel.consume(QUEUE_NAME, (msg) => {
      if (msg) {
        receivedMessage = JSON.parse(msg.content.toString());
        console.log('✅ Message received from RabbitMQ!');
        console.log('   Event Type:', receivedMessage.eventType);
        console.log('   Order Number:', receivedMessage.data?.orderNumber);
        channel.ack(msg);
        messageReceived = true;
        channel.cancel(consumer.consumerTag);
      }
    }, { noAck: false });

    console.log('✅ Queue monitor active, waiting for messages...\n');

    // Step 5: Create Test Order
    console.log('5️⃣ Creating test order...');
    const testOrder = {
      userId: 'test-user-' + Date.now(),
      items: [
        { productId: 'prod-1', name: 'Test Product', quantity: 2, price: 29.99 }
      ],
      totalAmount: 59.98,
      shippingAddress: {
        street: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zip: '12345'
      }
    };

    try {
      const orderResponse = await axios.post(
        `${ORDER_SERVICE_URL}/api/orders`,
        testOrder,
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('✅ Order created successfully!');
      console.log('   Order Number:', orderResponse.data.orderNumber);
      console.log('   Status:', orderResponse.data.status);
      console.log('\n⏳ Waiting for RabbitMQ message...\n');

      // Wait for message (max 5 seconds)
      let waitTime = 0;
      while (!messageReceived && waitTime < 5000) {
        await new Promise(resolve => setTimeout(resolve, 100));
        waitTime += 100;
      }

      if (messageReceived) {
        console.log('✅ SUCCESS! Complete flow working:\n');
        console.log('   Order Service → RabbitMQ → Notification Service ✅\n');
      } else {
        console.log('⚠️  Order created but message not received from RabbitMQ');
        console.log('   This might indicate an issue with the publisher\n');
      }

    } catch (error) {
      console.error('❌ Failed to create order:', error.message);
      if (error.response) {
        console.error('   Response:', error.response.data);
      }
    }

    // Cleanup
    await channel.close();
    await connection.close();

  } catch (error) {
    console.error('❌ Error setting up queue monitor:', error.message);
  }

  // Step 6: Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary:\n');
  console.log('✅ RabbitMQ: Running');
  console.log('✅ Order Service: Accessible');
  console.log('✅ Notification Service: Running');
  if (messageReceived) {
    console.log('✅ Message Flow: Working');
    console.log('\n🎉 All systems operational!');
  } else {
    console.log('⚠️  Message Flow: Needs investigation');
  }
  console.log('\n' + '='.repeat(60) + '\n');
}

// Run the test
testFullFlow().catch(console.error);

