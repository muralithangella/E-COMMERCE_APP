const express = require('express');
const { createPaymentIntent, confirmPayment, getPaymentMethods, processRefund } = require('../controllers/paymentController');
const { authenticate, authorize, paymentLimiter } = require('../middleware');

const router = express.Router();

router.post('/create-intent', authenticate, paymentLimiter, createPaymentIntent);
router.post('/confirm', authenticate, confirmPayment);
router.get('/methods', authenticate, getPaymentMethods);
router.post('/refund', authenticate, authorize('admin'), processRefund);

module.exports = router;