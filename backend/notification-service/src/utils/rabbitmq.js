const amqp = require('amqplib');

let channel = null;

const connectRabbitMQ = async (onMessage) => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost:5672');
    channel = await connection.createChannel();
    await channel.assertQueue('order_events', { durable: true });
    
    channel.consume('order_events', (msg) => {
      if (msg) {
        const event = JSON.parse(msg.content.toString());
        onMessage(event);
        channel.ack(msg);
      }
    });
    
    console.log('RabbitMQ consumer connected');
  } catch (error) {
    console.error('RabbitMQ connection error:', error);
    setTimeout(() => connectRabbitMQ(onMessage), 5000);
  }
};

module.exports = { connectRabbitMQ };
