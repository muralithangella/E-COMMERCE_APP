const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { authenticate, authorize, pagination } = require('../middleware');

const router = express.Router();

const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalOrders, totalProducts, recentOrders] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      Order.countDocuments(),
      Product.countDocuments({ status: 'published' }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('customer', 'firstName lastName email')
    ]);
    
    const totalRevenue = await Order.aggregate([
      { $match: { 'payment.status': 'completed' } },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } }
    ]);
    
    res.json({
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard stats', error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    const filter = {};
    
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(req.pagination.limit)
      .skip(req.pagination.skip);
    
    const total = await User.countDocuments(filter);
    res.json(res.paginate(users, total));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update user status', error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (search) filter.orderNumber = { $regex: search, $options: 'i' };
    
    const orders = await Order.find(filter)
      .populate('customer', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(req.pagination.limit)
      .skip(req.pagination.skip);
    
    const total = await Order.countDocuments(filter);
    res.json(res.paginate(orders, total));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

router.get('/dashboard', authenticate, authorize('admin'), getDashboardStats);
router.get('/users', authenticate, authorize('admin'), pagination(), getUsers);
router.patch('/users/:id/status', authenticate, authorize('admin'), updateUserStatus);
router.get('/orders', authenticate, authorize('admin'), pagination(), getAllOrders);

module.exports = router;