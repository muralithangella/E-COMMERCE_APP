const amqp = require('amqplib');

let channel = null;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost:5672');
    channel = await connection.createChannel();
    await channel.assertQueue('order_events', { durable: true });
    console.log('RabbitMQ connected');
  } catch (error) {
    console.error('RabbitMQ connection error:', error);
    setTimeout(connectRabbitMQ, 5000);
  }
};

const publishEvent = async (eventType, data) => {
  try {
    if (!channel) {
      await connectRabbitMQ();
      // Wait a bit to ensure channel is ready
      let retries = 0;
      while (!channel && retries < 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        retries++;
      }
    }
    
    if (!channel) {
      throw new Error('RabbitMQ channel not available');
    }
    
    const message = { eventType, data, timestamp: new Date() };
    channel.sendToQueue('order_events', Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log(`Event published: ${eventType}`);
  } catch (error) {
    console.error('Failed to publish event:', error);
    throw error;
  }
};

module.exports = { connectRabbitMQ, publishEvent };
