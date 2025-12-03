const KafkaManager = require('../config/kafka');
const Notification = require('../models/Notification');
const EmailService = require('../services/emailService');

class NotificationWorker {
  async start() {
    console.log('Starting Notification Worker...');
    
    await KafkaManager.consumeEvents(
      'notification-worker-group',
      ['notification-events'],
      this.handleNotificationEvent.bind(this)
    );

    // Start cleanup job
    this.startCleanupJob();
  }

  async handleNotificationEvent(topic, message) {
    const { eventType, data } = message;
    
    try {
      switch (eventType) {
        case 'EMAIL_SENT':
          await this.handleEmailSent(data);
          break;
        case 'NOTIFICATION_SENT':
          await this.handleNotificationSent(data);
          break;
        default:
          console.log(`Unhandled notification event: ${eventType}`);
      }
    } catch (error) {
      console.error(`Error processing notification event ${eventType}:`, error);
    }
  }

  async handleEmailSent(data) {
    const { to, subject, messageId } = data;
    console.log(`Email sent to ${to}: ${subject} (ID: ${messageId})`);
  }

  async handleNotificationSent(data) {
    const { userId, type, notificationId } = data;
    console.log(`Notification sent to user ${userId}: ${type} (ID: ${notificationId})`);
  }

  startCleanupJob() {
    // Run cleanup every hour
    setInterval(async () => {
      await this.cleanupExpiredNotifications();
    }, 60 * 60 * 1000);
  }

  async cleanupExpiredNotifications() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await Notification.deleteMany({
        $or: [
          { expiresAt: { $lt: new Date() } },
          { createdAt: { $lt: thirtyDaysAgo }, read: true }
        ]
      });

      console.log(`Cleaned up ${result.deletedCount} expired notifications`);
    } catch (error) {
      console.error('Error cleaning up notifications:', error);
    }
  }

  async processEmailQueue() {
    // Process pending email notifications
    try {
      const pendingNotifications = await Notification.find({
        'channels.email.sent': false,
        type: { $in: ['order_confirmation', 'order_shipped', 'welcome'] }
      }).populate('user').limit(10);

      for (const notification of pendingNotifications) {
        try {
          await this.sendNotificationEmail(notification);
          
          notification.channels.email.sent = true;
          notification.channels.email.sentAt = new Date();
          await notification.save();
          
        } catch (error) {
          console.error(`Failed to send email for notification ${notification._id}:`, error);
        }
      }

      if (pendingNotifications.length > 0) {
        console.log(`Processed ${pendingNotifications.length} email notifications`);
      }
    } catch (error) {
      console.error('Error processing email queue:', error);
    }
  }

  async sendNotificationEmail(notification) {
    const { user, type, title, message, data } = notification;
    
    let emailContent;
    
    switch (type) {
      case 'order_confirmation':
        emailContent = {
          to: user.email,
          subject: title,
          html: `<h2>${title}</h2><p>Hi ${user.firstName},</p><p>${message}</p>`
        };
        break;
      case 'order_shipped':
        emailContent = {
          to: user.email,
          subject: title,
          html: `<h2>${title}</h2><p>Hi ${user.firstName},</p><p>${message}</p>`
        };
        break;
      case 'welcome':
        emailContent = {
          to: user.email,
          subject: title,
          html: `<h2>${title}</h2><p>Hi ${user.firstName},</p><p>${message}</p>`
        };
        break;
      default:
        emailContent = {
          to: user.email,
          subject: title,
          html: `<h2>${title}</h2><p>Hi ${user.firstName},</p><p>${message}</p>`
        };
    }
    
    return await EmailService.sendEmail(emailContent);
  }
}

module.exports = new NotificationWorker();