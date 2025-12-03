const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['order_confirmation', 'order_shipped', 'order_delivered', 'payment_success', 'payment_failed', 'low_stock', 'welcome', 'promotion'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  data: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  channels: {
    email: {
      sent: {
        type: Boolean,
        default: false
      },
      sentAt: Date,
      messageId: String
    },
    sms: {
      sent: {
        type: Boolean,
        default: false
      },
      sentAt: Date,
      messageId: String
    },
    push: {
      sent: {
        type: Boolean,
        default: false
      },
      sentAt: Date
    }
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  expiresAt: Date
}, {
  timestamps: true
});

notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ read: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Notification', notificationSchema);