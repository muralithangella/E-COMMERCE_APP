const express = require('express');
const { sendEmail, sendOrderConfirmation, sendShippingNotification, sendLowStockAlert } = require('../controllers/notificationController');
const Notification = require('../models/Notification');
const { authenticate, authorize, pagination } = require('../middleware');

const router = express.Router();

const getNotifications = async (req, res) => {
  try {
    const filter = { user: req.user.id };
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(req.pagination.limit)
      .skip(req.pagination.skip);
    
    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({ ...filter, read: false });
    
    res.json({
      ...res.paginate(notifications, total),
      unreadCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { read: true, readAt: new Date() }
    );
    
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark notification as read', error: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true, readAt: new Date() }
    );
    
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark notifications as read', error: error.message });
  }
};

router.get('/', authenticate, pagination(), getNotifications);
router.patch('/:id/read', authenticate, markAsRead);
router.patch('/read-all', authenticate, markAllAsRead);
router.post('/email', authenticate, authorize('admin'), sendEmail);
router.post('/order-confirmation', authenticate, authorize('admin'), sendOrderConfirmation);
router.post('/shipping-notification', authenticate, authorize('admin'), sendShippingNotification);
router.post('/low-stock-alert', authenticate, authorize('admin'), sendLowStockAlert);

module.exports = router;