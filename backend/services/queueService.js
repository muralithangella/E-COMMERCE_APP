const Bull = require('bull');
const Redis = require('ioredis');

class QueueService {
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3
    });

    // Initialize queues
    this.emailQueue = new Bull('email processing', {
      redis: { host: process.env.REDIS_HOST || 'localhost', port: 6379 }
    });
    
    this.smsQueue = new Bull('sms processing', {
      redis: { host: process.env.REDIS_HOST || 'localhost', port: 6379 }
    });
    
    this.orderQueue = new Bull('order processing', {
      redis: { host: process.env.REDIS_HOST || 'localhost', port: 6379 }
    });

    this.setupProcessors();
  }

  setupProcessors() {
    // Email processor
    this.emailQueue.process('send-email', async (job) => {
      const { to, subject, template, data } = job.data;
      return await this.processEmail(to, subject, template, data);
    });

    // SMS processor
    this.smsQueue.process('send-sms', async (job) => {
      const { phone, message, type } = job.data;
      return await this.processSMS(phone, message, type);
    });

    // Order processor
    this.orderQueue.process('process-order', async (job) => {
      const { orderId, type } = job.data;
      return await this.processOrder(orderId, type);
    });
  }

  async addEmailJob(emailData, options = {}) {
    return await this.emailQueue.add('send-email', emailData, {
      attempts: 3,
      backoff: 'exponential',
      delay: options.delay || 0,
      ...options
    });
  }

  async addSMSJob(smsData, options = {}) {
    return await this.smsQueue.add('send-sms', smsData, {
      attempts: 3,
      backoff: 'exponential',
      delay: options.delay || 0,
      ...options
    });
  }

  async addOrderJob(orderData, options = {}) {
    return await this.orderQueue.add('process-order', orderData, {
      attempts: 5,
      backoff: 'exponential',
      ...options
    });
  }

  async processEmail(to, subject, template, data) {
    // Integration with email service (SendGrid, AWS SES, etc.)
    console.log(`📧 Processing email to ${to}: ${subject}`);
    
    try {
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`✅ Email sent successfully to ${to}`);
      return { success: true, to, subject };
    } catch (error) {
      console.error(`❌ Email failed to ${to}:`, error);
      throw error;
    }
  }

  async processSMS(phone, message, type) {
    console.log(`📱 Processing SMS to ${phone}: ${type}`);
    
    try {
      // Integration with SMS service (Twilio, AWS SNS, etc.)
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`✅ SMS sent successfully to ${phone}`);
      return { success: true, phone, type };
    } catch (error) {
      console.error(`❌ SMS failed to ${phone}:`, error);
      throw error;
    }
  }

  async processOrder(orderId, type) {
    console.log(`📦 Processing order ${orderId}: ${type}`);
    
    try {
      switch (type) {
        case 'confirmation':
          await this.sendOrderConfirmation(orderId);
          break;
        case 'payment':
          await this.processPayment(orderId);
          break;
        case 'inventory':
          await this.updateInventory(orderId);
          break;
      }
      return { success: true, orderId, type };
    } catch (error) {
      console.error(`❌ Order processing failed for ${orderId}:`, error);
      throw error;
    }
  }

  async sendOrderConfirmation(orderId) {
    // Send confirmation email and SMS
    console.log(`Sending confirmation for order ${orderId}`);
  }

  async processPayment(orderId) {
    // Process payment with payment gateway
    console.log(`Processing payment for order ${orderId}`);
  }

  async updateInventory(orderId) {
    // Update inventory levels
    console.log(`Updating inventory for order ${orderId}`);
  }

  getQueueStats() {
    return {
      email: {
        waiting: this.emailQueue.waiting(),
        active: this.emailQueue.active(),
        completed: this.emailQueue.completed(),
        failed: this.emailQueue.failed()
      },
      sms: {
        waiting: this.smsQueue.waiting(),
        active: this.smsQueue.active(),
        completed: this.smsQueue.completed(),
        failed: this.smsQueue.failed()
      },
      order: {
        waiting: this.orderQueue.waiting(),
        active: this.orderQueue.active(),
        completed: this.orderQueue.completed(),
        failed: this.orderQueue.failed()
      }
    };
  }
}

module.exports = new QueueService();