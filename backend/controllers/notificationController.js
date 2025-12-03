const nodemailer = require('nodemailer');
const KafkaManager = require('../config/kafka');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendEmail = async (req, res) => {
  try {
    const { to, subject, html, text } = req.body;
    
    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
      text
    };
    
    const result = await transporter.sendMail(mailOptions);
    
    await KafkaManager.publishNotificationEvent('EMAIL_SENT', {
      to,
      subject,
      messageId: result.messageId
    });
    
    res.json({ message: 'Email sent successfully', messageId: result.messageId });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
};

const sendOrderConfirmation = async (req, res) => {
  try {
    const { email, orderNumber, items, total } = req.body;
    
    const html = `
      <h2>Order Confirmation</h2>
      <p>Thank you for your order!</p>
      <p><strong>Order Number:</strong> ${orderNumber}</p>
      <p><strong>Total:</strong> $${total}</p>
      <h3>Items:</h3>
      <ul>
        ${items.map(item => `<li>${item.name} - Quantity: ${item.quantity} - $${item.price}</li>`).join('')}
      </ul>
    `;
    
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: `Order Confirmation - ${orderNumber}`,
      html
    };
    
    const result = await transporter.sendMail(mailOptions);
    
    res.json({ message: 'Order confirmation sent', messageId: result.messageId });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send order confirmation', error: error.message });
  }
};

const sendShippingNotification = async (req, res) => {
  try {
    const { email, orderNumber, trackingNumber, carrier } = req.body;
    
    const html = `
      <h2>Your Order Has Shipped!</h2>
      <p><strong>Order Number:</strong> ${orderNumber}</p>
      <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
      <p><strong>Carrier:</strong> ${carrier}</p>
      <p>You can track your package using the tracking number above.</p>
    `;
    
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: `Your Order ${orderNumber} Has Shipped`,
      html
    };
    
    const result = await transporter.sendMail(mailOptions);
    
    res.json({ message: 'Shipping notification sent', messageId: result.messageId });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send shipping notification', error: error.message });
  }
};

const sendLowStockAlert = async (req, res) => {
  try {
    const { productName, currentStock, threshold } = req.body;
    
    const html = `
      <h2>Low Stock Alert</h2>
      <p><strong>Product:</strong> ${productName}</p>
      <p><strong>Current Stock:</strong> ${currentStock}</p>
      <p><strong>Threshold:</strong> ${threshold}</p>
      <p>Please restock this item soon.</p>
    `;
    
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `Low Stock Alert - ${productName}`,
      html
    };
    
    const result = await transporter.sendMail(mailOptions);
    
    res.json({ message: 'Low stock alert sent', messageId: result.messageId });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send low stock alert', error: error.message });
  }
};

module.exports = {
  sendEmail,
  sendOrderConfirmation,
  sendShippingNotification,
  sendLowStockAlert
};