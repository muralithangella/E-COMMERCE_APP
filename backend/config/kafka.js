const { Kafka } = require('kafkajs');

class KafkaManager {
  constructor() {
    if (process.env.SKIP_KAFKA === 'true') {
      console.log('Kafka connection skipped');
      this.kafka = null;
      this.producer = null;
      this.consumers = new Map();
      return;
    }

    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID || 'ecommerce-app',
      brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
      retry: {
        initialRetryTime: 100,
        retries: 8
      }
    });

    this.producer = null;
    this.consumers = new Map();
    this.topics = {
      ORDER_EVENTS: 'order-events',
      PAYMENT_EVENTS: 'payment-events',
      INVENTORY_EVENTS: 'inventory-events',
      USER_EVENTS: 'user-events',
      NOTIFICATION_EVENTS: 'notification-events'
    };
  }

  async initProducer() {
    if (!this.kafka) return null;
    
    try {
      this.producer = this.kafka.producer({
        maxInFlightRequests: 1,
        idempotent: true,
        transactionTimeout: 30000
      });
      
      await this.producer.connect();
      console.log('Kafka producer connected successfully');
      return this.producer;
    } catch (error) {
      console.error('Kafka producer connection error:', error);
      throw error;
    }
  }

  async createConsumer(groupId, topics) {
    try {
      const consumer = this.kafka.consumer({ 
        groupId,
        sessionTimeout: 30000,
        rebalanceTimeout: 60000,
        heartbeatInterval: 3000
      });
      
      await consumer.connect();
      await consumer.subscribe({ topics, fromBeginning: false });
      
      this.consumers.set(groupId, consumer);
      console.log(`Kafka consumer ${groupId} connected and subscribed to topics:`, topics);
      return consumer;
    } catch (error) {
      console.error(`Kafka consumer ${groupId} connection error:`, error);
      throw error;
    }
  }

  async publishEvent(topic, message, key = null) {
    try {
      if (!this.producer) {
        await this.initProducer();
      }

      const result = await this.producer.send({
        topic,
        messages: [{
          key,
          value: JSON.stringify(message),
          timestamp: Date.now()
        }]
      });

      console.log(`Event published to ${topic}:`, result);
      return result;
    } catch (error) {
      console.error(`Error publishing to ${topic}:`, error);
      throw error;
    }
  }

  async consumeEvents(groupId, topics, messageHandler) {
    try {
      const consumer = await this.createConsumer(groupId, topics);
      
      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const parsedMessage = JSON.parse(message.value.toString());
            await messageHandler(topic, parsedMessage, {
              partition,
              offset: message.offset,
              key: message.key?.toString()
            });
          } catch (error) {
            console.error(`Error processing message from ${topic}:`, error);
          }
        }
      });

      return consumer;
    } catch (error) {
      console.error(`Error setting up consumer ${groupId}:`, error);
      throw error;
    }
  }

  // Event publishing methods
  async publishOrderEvent(eventType, orderData) {
    return this.publishEvent(this.topics.ORDER_EVENTS, {
      eventType,
      data: orderData,
      timestamp: new Date().toISOString()
    }, orderData.orderId);
  }

  async publishPaymentEvent(eventType, paymentData) {
    return this.publishEvent(this.topics.PAYMENT_EVENTS, {
      eventType,
      data: paymentData,
      timestamp: new Date().toISOString()
    }, paymentData.paymentId);
  }

  async publishInventoryEvent(eventType, inventoryData) {
    return this.publishEvent(this.topics.INVENTORY_EVENTS, {
      eventType,
      data: inventoryData,
      timestamp: new Date().toISOString()
    }, inventoryData.productId);
  }

  async publishUserEvent(eventType, userData) {
    return this.publishEvent(this.topics.USER_EVENTS, {
      eventType,
      data: userData,
      timestamp: new Date().toISOString()
    }, userData.userId);
  }

  async publishNotificationEvent(eventType, notificationData) {
    try {
      return this.publishEvent(this.topics.NOTIFICATION_EVENTS, {
        eventType,
        data: notificationData,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.warn('Kafka notification event failed:', error.message);
      return null;
    }
  }

  async disconnect() {
    try {
      if (this.producer) {
        await this.producer.disconnect();
        console.log('Kafka producer disconnected');
      }

      for (const [groupId, consumer] of this.consumers) {
        await consumer.disconnect();
        console.log(`Kafka consumer ${groupId} disconnected`);
      }
    } catch (error) {
      console.error('Error disconnecting Kafka:', error);
    }
  }
}

module.exports = new KafkaManager();