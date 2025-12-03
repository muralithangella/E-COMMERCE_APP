const nodemailer = require('nodemailer');
const KafkaManager = require('../config/kafka');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      try {
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT || 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });
        this.isConfigured = true;
      } catch (error) {
        console.warn('Email service not configured:', error.message);
      }
    } else {
      console.log('Email service disabled - SMTP not configured');
    }
  }

  async sendEmail({ to, subject, html, text }) {
    if (!this.isConfigured) {
      console.log(`📧 Email would be sent to ${to}: ${subject}`);
      return { messageId: 'dev-' + Date.now() };
    }
    
    try {
      const result = await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        html,
        text
      });

      try {
        await KafkaManager.publishNotificationEvent('EMAIL_SENT', {
          to,
          subject,
          messageId: result.messageId
        });
      } catch (kafkaError) {
        console.warn('Kafka notification failed:', kafkaError.message);
      }

      return result;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(user) {
    const html = `
      <h2>Welcome to Our Store!</h2>
      <p>Hi ${user.firstName},</p>
      <p>Thank you for joining us. We're excited to have you as part of our community!</p>
      <p>Start shopping now and discover amazing products.</p>
    `;

    return this.sendEmail({
      to: user.email,
      subject: 'Welcome to Our Store!',
      html
    });
  }

  async sendOrderConfirmation(order, user) {
    const html = `
      <h2>Order Confirmation</h2>
      <p>Hi ${user.firstName},</p>
      <p>Thank you for your order!</p>
      <p><strong>Order Number:</strong> ${order.orderNumber}</p>
      <p><strong>Total:</strong> $${order.pricing.total}</p>
      <h3>Items:</h3>
      <ul>
        ${order.items.map(item => `<li>${item.product.name} - Qty: ${item.quantity} - $${item.price}</li>`).join('')}
      </ul>
    `;

    return this.sendEmail({
      to: user.email,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html
    });
  }

  async sendShippingNotification(order, user) {
    const html = `
      <h2>Your Order Has Shipped!</h2>
      <p>Hi ${user.firstName},</p>
      <p>Great news! Your order has been shipped.</p>
      <p><strong>Order Number:</strong> ${order.orderNumber}</p>
      <p><strong>Tracking Number:</strong> ${order.tracking.trackingNumber}</p>
      <p><strong>Carrier:</strong> ${order.tracking.carrier}</p>
    `;

    return this.sendEmail({
      to: user.email,
      subject: `Your Order ${order.orderNumber} Has Shipped`,
      html
    });
  }

  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const html = `
      <h2>Password Reset Request</h2>
      <p>Hi ${user.firstName},</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <p><a href="${resetUrl}">Reset Password</a></p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    return this.sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      html
    });
  }
}

module.exports = new EmailService();