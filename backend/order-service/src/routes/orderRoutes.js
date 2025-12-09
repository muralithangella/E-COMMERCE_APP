const express = require('express');
const { createOrder, getOrders, getOrder } = require('../controllers/orderController');

const router = express.Router();

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);

module.exports = router;
