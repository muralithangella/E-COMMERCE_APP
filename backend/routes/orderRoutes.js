const express = require('express');
const { createOrder, getOrders, getOrderById, updateOrderStatus, cancelOrder } = require('../controllers/orderController');
const { authenticate, authorize, validateOrder, pagination } = require('../middleware');

const router = express.Router();

router.post('/', authenticate, validateOrder, createOrder);
router.get('/', authenticate, pagination(), getOrders);
router.get('/:id', authenticate, getOrderById);
router.patch('/:id/status', authenticate, authorize('admin'), updateOrderStatus);
router.patch('/:id/cancel', authenticate, cancelOrder);

module.exports = router;