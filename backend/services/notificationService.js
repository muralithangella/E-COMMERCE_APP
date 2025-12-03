const nodemailer = require('nodemailer');
const twilio = require('twilio');
const RabbitMQManager = require('../config/rabbitmq');
const { logger } = require('../utils/logger');

class NotificationService {
  constructor() {
    // Email setup (Amazon SES compatible)
    this.emailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'email-smtp.us-east-1.amazonaws.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // SMS setup (Twilio - same as Amazon SNS)
    this.smsClient = null;
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.smsClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
    }
  }

  async sendEmail(to, subject, html, template = 'default') {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'E-Shop <noreply@e-shop.com>',
        to,
        subject,
        html: this.getEmailTemplate(template, { subject, content: html })
      };

      const result = await this.emailTransporter.sendMail(mailOptions);
      console.log(`📧 Email sent successfully to ${to}`);
      return result;
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      console.log(`📧 Email (Mock): ${to} - ${subject}`);
      return { messageId: 'mock_' + Date.now() };
    }
  }

  async sendSMS(to, message) {
    try {
      if (!this.smsClient) {
        console.log(`📱 SMS (Mock): ${to} - ${message}`);
        return { sid: 'mock_' + Date.now() };
      }

      const result = await this.smsClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: to
      });
      
      console.log(`📱 SMS sent successfully to ${to}`);
      return result;
    } catch (error) {
      console.error('❌ SMS sending failed:', error);

    }
  }

  getEmailTemplate(template, data) {
    const templates = {
      default: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; }
            .header { text-align: center; border-bottom: 3px solid #ff9f00; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 28px; font-weight: bold; color: #232f3e; }
            .content { line-height: 1.6; color: #333; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🛒 E-Shop</div>
            </div>
            <div class="content">
              ${data.content}
            </div>
            <div class="footer">
              <p>Thank you for shopping with E-Shop!</p>
              <p>Questions? Contact us at support@e-shop.com</p>
            </div>
          </div>
        </body>
        </html>
      `,
      order: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; }
            .header { text-align: center; border-bottom: 3px solid #ff9f00; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 28px; font-weight: bold; color: #232f3e; }
            .order-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .total { font-size: 18px; font-weight: bold; color: #B12704; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🛒 E-Shop</div>
              <h2 style="color: #28a745; margin: 10px 0;">✅ Order Confirmed!</h2>
            </div>
            ${data.content}
          </div>
        </body>
        </html>
      `
    };
    return templates[template] || templates.default;
  }

  async sendOrderConfirmation(order, userEmail, userPhone) {
    const subject = `Order Confirmation - ${order.id || order.orderNumber}`;
    
    const emailContent = `
      <h3>Thank you for your order!</h3>
      <div class="order-box">
        <p><strong>Order #:</strong> ${order.id || order.orderNumber}</p>
        <p><strong>Order Date:</strong> ${new Date(order.orderDate || Date.now()).toLocaleDateString()}</p>
        <p><strong>Total:</strong> <span class="total">$${order.total.toFixed(2)}</span></p>
      </div>
      
      <h4>Items Ordered:</h4>
      ${order.items.map(item => `
        <div class="item">
          <span>${item.name} (Qty: ${item.quantity})</span>
          <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      `).join('')}
      
      <div style="margin-top: 20px; padding: 15px; background: #d4edda; border-radius: 5px;">
        <p><strong>🚚 Estimated Delivery:</strong> ${new Date(order.estimatedDelivery || Date.now() + 7*24*60*60*1000).toLocaleDateString()}</p>
        <p>We'll send you tracking information when your order ships.</p>
      </div>
    `;
    
    const smsMessage = `E-Shop: Order confirmed! Order #${order.id || order.orderNumber} - Total: $${order.total.toFixed(2)}. Track at e-shop.com/orders`;
    
    // Send via RabbitMQ for async processing
    await RabbitMQManager.publishMessage('notifications', 'email.order', {
      to: userEmail,
      subject,
      content: emailContent,
      template: 'order'
    });
    
    if (userPhone) {
      await RabbitMQManager.publishMessage('notifications', 'sms.order', {
        to: userPhone,
        message: smsMessage
      });
    }
    
    return { emailQueued: true, smsQueued: !!userPhone };
  }

  async sendOrderStatusUpdate(order, userEmail, userPhone, status) {
    const subject = `Order Update - ${order.id || order.orderNumber}`;
    const statusMessages = {
      confirmed: 'Your order has been confirmed and is being prepared.',
      shipped: '📦 Great news! Your order has shipped.',
      delivered: '✅ Your order has been delivered. Thank you for shopping with us!',
      cancelled: '❌ Your order has been cancelled.'
    };
    
    const emailContent = `
      <h3>Order Status Update</h3>
      <div class="order-box">
        <p><strong>Order #:</strong> ${order.id || order.orderNumber}</p>
        <p><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">${status.toUpperCase()}</span></p>
        <p>${statusMessages[status] || 'Your order status has been updated.'}</p>
      </div>
    `;
    
    const smsMessage = `E-Shop: Order #${order.id || order.orderNumber} ${status}. ${statusMessages[status] || ''}`;
    
    await RabbitMQManager.publishMessage('notifications', 'email.status', {
      to: userEmail,
      subject,
      content: emailContent,
      template: 'order'
    });
    
    if (userPhone) {
      await RabbitMQManager.publishMessage('notifications', 'sms.status', {
        to: userPhone,
        message: smsMessage
      });
    }
  }

  // Start notification workers
  async startNotificationWorkers() {
    // Email worker
    await RabbitMQManager.consumeMessages('email.notifications', async (data) => {
      await this.sendEmail(data.to, data.subject, data.content, data.template);
    });
    
    // SMS worker
    await RabbitMQManager.consumeMessages('sms.notifications', async (data) => {
      await this.sendSMS(data.to, data.message);
    });
    
    console.log('📬 Notification workers started');
  }
}

module.exports = new NotificationService();