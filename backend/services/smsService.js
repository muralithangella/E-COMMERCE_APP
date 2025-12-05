const twilio = require('twilio');

class SMSService {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
    this.templates = this.initializeTemplates();
  }

  initializeTemplates() {
    return {
      'order-confirmation': (data) => 
        `Hi ${data.customerName}! Your order ${data.orderNumber} is confirmed. Total: ₹${data.total}. Track: ${data.trackingUrl}`,
      
      'order-shipped': (data) => 
        `Great news! Your order ${data.orderNumber} has been shipped. Expected delivery: ${data.deliveryDate}. Track: ${data.trackingUrl}`,
      
      'order-delivered': (data) => 
        `Your order ${data.orderNumber} has been delivered! Thank you for shopping with us.`,
      
      'otp-verification': (data) => 
        `Your verification code is: ${data.otp}. Valid for 10 minutes. Do not share this code.`,
      
      'payment-failed': (data) => 
        `Payment failed for order ${data.orderNumber}. Please retry payment or contact support.`,
      
      'welcome': (data) => 
        `Welcome to our store, ${data.customerName}! Start shopping and enjoy free shipping on orders over ₹499.`
    };
  }

  async sendSMS(to, templateName, data, options = {}) {
    try {
      if (!this.client || !this.fromNumber) {
        console.warn('SMS service not configured, skipping SMS');
        return { success: false, reason: 'SMS service not configured' };
      }

      const template = this.templates[templateName];
      if (!template) {
        throw new Error(`SMS template ${templateName} not found`);
      }

      const message = template(data);
      
      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: this.formatPhoneNumber(to),
        ...options
      });

      console.log(`✅ SMS sent to ${to}: ${result.sid}`);
      return { success: true, sid: result.sid, to };
    } catch (error) {
      console.error(`❌ SMS failed to ${to}:`, error);
      throw error;
    }
  }

  formatPhoneNumber(phone) {
    // Format Indian phone numbers
    let formatted = phone.replace(/\D/g, '');
    
    if (formatted.startsWith('91')) {
      return `+${formatted}`;
    } else if (formatted.length === 10) {
      return `+91${formatted}`;
    }
    
    return `+${formatted}`;
  }

  async sendOrderConfirmation(orderData) {
    const { customerPhone, customerName, orderNumber, total, trackingUrl } = orderData;
    
    return await this.sendSMS(customerPhone, 'order-confirmation', {
      customerName,
      orderNumber,
      total: total.toFixed(2),
      trackingUrl: trackingUrl || `${process.env.FRONTEND_URL}/orders/${orderNumber}`
    });
  }

  async sendOrderShipped(orderData) {
    const { customerPhone, orderNumber, deliveryDate, trackingUrl } = orderData;
    
    return await this.sendSMS(customerPhone, 'order-shipped', {
      orderNumber,
      deliveryDate: new Date(deliveryDate).toLocaleDateString(),
      trackingUrl
    });
  }

  async sendOTP(phone, otp) {
    return await this.sendSMS(phone, 'otp-verification', { otp });
  }

  async sendWelcomeSMS(userData) {
    const { phone, name } = userData;
    
    return await this.sendSMS(phone, 'welcome', {
      customerName: name
    });
  }

  async verifyConnection() {
    try {
      if (!this.client) {
        return false;
      }
      
      // Test connection by fetching account info
      await this.client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
      console.log('✅ SMS service connected');
      return true;
    } catch (error) {
      console.error('❌ SMS service connection failed:', error);
      return false;
    }
  }

  getDeliveryStatus(messageSid) {
    return this.client.messages(messageSid).fetch();
  }
}

module.exports = new SMSService();