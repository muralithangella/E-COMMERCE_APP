const express = require('express');
const { getInventory, updateStock, reserveStock, releaseStock } = require('../controllers/inventoryController');
const { authenticate, authorize, pagination } = require('../middleware');

const router = express.Router();

router.get('/', authenticate, authorize('admin', 'vendor'), pagination(), getInventory);
router.put('/stock', authenticate, authorize('admin', 'vendor'), updateStock);
router.post('/reserve', authenticate, authorize('admin'), reserveStock);
router.post('/release', authenticate, authorize('admin'), releaseStock);

module.exports = router;