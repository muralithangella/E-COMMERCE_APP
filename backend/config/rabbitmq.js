const amqp = require('amqplib');

class RabbitMQManager {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      const connectionString = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
      this.connection = await amqp.connect(connectionString);
      this.channel = await this.connection.createChannel();
      this.isConnected = true;
      
      // Setup exchanges and queues
      await this.setupExchangesAndQueues();
      
      console.log('✅ RabbitMQ connected successfully');
      return true;
    } catch (error) {
      console.error('❌ RabbitMQ connection failed:', error.message);
      this.isConnected = false;
      return false;
    }
  }

  async setupExchangesAndQueues() {
    if (!this.channel) return;

    // Create exchanges
    await this.channel.assertExchange('orders', 'topic', { durable: true });
    await this.channel.assertExchange('notifications', 'topic', { durable: true });
    
    // Create queues
    await this.channel.assertQueue('order.created', { durable: true });
    await this.channel.assertQueue('order.updated', { durable: true });
    await this.channel.assertQueue('email.notifications', { durable: true });
    await this.channel.assertQueue('sms.notifications', { durable: true });
    
    // Bind queues to exchanges
    await this.channel.bindQueue('order.created', 'orders', 'order.created');
    await this.channel.bindQueue('order.updated', 'orders', 'order.updated');
    await this.channel.bindQueue('email.notifications', 'notifications', 'email.*');
    await this.channel.bindQueue('sms.notifications', 'notifications', 'sms.*');
  }

  async publishMessage(exchange, routingKey, message) {
    if (!this.isConnected || !this.channel) {
      console.warn('RabbitMQ not connected, skipping message publish');
      return false;
    }

    try {
      const messageBuffer = Buffer.from(JSON.stringify(message));
      await this.channel.publish(exchange, routingKey, messageBuffer, {
        persistent: true,
        timestamp: Date.now()
      });
      console.log(`📤 Message published to ${exchange}:${routingKey}`);
      return true;
    } catch (error) {
      console.error('Failed to publish message:', error);
      return false;
    }
  }

  async consumeMessages(queue, callback) {
    if (!this.isConnected || !this.channel) {
      console.warn('RabbitMQ not connected, cannot consume messages');
      return;
    }

    try {
      await this.channel.consume(queue, async (msg) => {
        if (msg) {
          try {
            const content = JSON.parse(msg.content.toString());
            await callback(content);
            this.channel.ack(msg);
          } catch (error) {
            console.error('Error processing message:', error);
            this.channel.nack(msg, false, false);
          }
        }
      });
      console.log(`👂 Listening for messages on queue: ${queue}`);
    } catch (error) {
      console.error('Failed to consume messages:', error);
    }
  }

  async close() {
    try {
      if (this.channel) await this.channel.close();
      if (this.connection) await this.connection.close();
      this.isConnected = false;
      console.log('RabbitMQ connection closed');
    } catch (error) {
      console.error('Error closing RabbitMQ connection:', error);
    }
  }
}

module.exports = new RabbitMQManager();