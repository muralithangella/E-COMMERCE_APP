const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');

class EmailService {
  constructor() {
    this.transporter = this.createTransporter();
    this.templates = new Map();
    this.loadTemplates();
  }

  createTransporter() {
    return nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100
    });
  }

  async loadTemplates() {
    try {
      const templatesDir = path.join(__dirname, '../templates/email');
      
      // Order confirmation template
      this.templates.set('order-confirmation', {
        subject: 'Order Confirmation - {{orderNumber}}',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #232f3e;">Order Confirmed!</h1>
            <p>Hi {{customerName}},</p>
            <p>Thank you for your order. Your order <strong>{{orderNumber}}</strong> has been confirmed.</p>
            
            <div style="background: #f8f9fa; padding: 20px; margin: 20px 0;">
              <h3>Order Details:</h3>
              {{#each items}}
              <div style="border-bottom: 1px solid #ddd; padding: 10px 0;">
                <strong>{{name}}</strong><br>
                Quantity: {{quantity}} × ₹{{price}} = ₹{{total}}
              </div>
              {{/each}}
              
              <div style="margin-top: 15px; font-size: 18px;">
                <strong>Total: ₹{{orderTotal}}</strong>
              </div>
            </div>
            
            <p>Estimated delivery: {{deliveryDate}}</p>
            <p>Track your order: <a href="{{trackingUrl}}">{{orderNumber}}</a></p>
          </div>
        `
      });

      // Welcome email template
      this.templates.set('welcome', {
        subject: 'Welcome to Amazon-Style Store!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #232f3e;">Welcome {{customerName}}!</h1>
            <p>Thank you for joining our store. Start shopping now and enjoy:</p>
            <ul>
              <li>Free shipping on orders over ₹499</li>
              <li>Easy returns within 30 days</li>
              <li>24/7 customer support</li>
            </ul>
            <a href="{{shopUrl}}" style="background: #ff9f00; color: black; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
              Start Shopping
            </a>
          </div>
        `
      });

      console.log('✅ Email templates loaded');
    } catch (error) {
      console.error('❌ Failed to load email templates:', error);
    }
  }

  async sendEmail(to, templateName, data, options = {}) {
    try {
      const template = this.templates.get(templateName);
      if (!template) {
        throw new Error(`Template ${templateName} not found`);
      }

      const subjectTemplate = handlebars.compile(template.subject);
      const htmlTemplate = handlebars.compile(template.html);

      const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@ecommerce.com',
        to,
        subject: subjectTemplate(data),
        html: htmlTemplate(data),
        ...options
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email sent to ${to}: ${result.messageId}`);
      return result;
    } catch (error) {
      console.error(`❌ Email failed to ${to}:`, error);
      throw error;
    }
  }

  async sendOrderConfirmation(orderData) {
    const { customerEmail, customerName, orderNumber, items, total, deliveryDate } = orderData;
    
    return await this.sendEmail(customerEmail, 'order-confirmation', {
      customerName,
      orderNumber,
      items: items.map(item => ({
        ...item,
        total: (item.price * item.quantity).toFixed(2)
      })),
      orderTotal: total.toFixed(2),
      deliveryDate: new Date(deliveryDate).toLocaleDateString(),
      trackingUrl: `${process.env.FRONTEND_URL}/orders/${orderNumber}`
    });
  }

  async sendWelcomeEmail(userData) {
    const { email, name } = userData;
    
    return await this.sendEmail(email, 'welcome', {
      customerName: name,
      shopUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
    });
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service connected');
      return true;
    } catch (error) {
      console.error('❌ Email service connection failed:', error);
      return false;
    }
  }
}

module.exports = new EmailService();