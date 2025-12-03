const { Kafka } = require('kafkajs');

class EventPublisher {
  constructor() {
    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID || 'ecommerce-app',
      brokers: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092']
    });
    this.producer = this.kafka.producer();
    this.isConnected = false;
  }

  async connect() {
    if (!this.isConnected) {
      await this.producer.connect();
      this.isConnected = true;
      console.log('Kafka producer connected');
    }
  }

  async publishEvent(topic, event) {
    try {
      await this.connect();
      
      const message = {
        topic,
        messages: [{
          key: event.id || Date.now().toString(),
          value: JSON.stringify({
            ...event,
            timestamp: new Date().toISOString(),
            service: process.env.SERVICE_NAME || 'unknown'
          })
        }]
      };

      await this.producer.send(message);
      console.log(`Event published to ${topic}:`, event);
    } catch (error) {
      console.error('Failed to publish event:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.isConnected) {
      await this.producer.disconnect();
      this.isConnected = false;
      console.log('Kafka producer disconnected');
    }
  }
}

const eventPublisher = new EventPublisher();

// Graceful shutdown
process.on('SIGINT', async () => {
  await eventPublisher.disconnect();
  process.exit(0);
});

module.exports = {
  publishEvent: (topic, event) => eventPublisher.publishEvent(topic, event),
  disconnect: () => eventPublisher.disconnect()
};