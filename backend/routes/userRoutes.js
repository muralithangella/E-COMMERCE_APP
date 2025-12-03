const express = require('express');
const { getProfile, updateProfile, getAddresses, addAddress, updateAddress, deleteAddress, updatePreferences } = require('../controllers/userController');
const { authenticate, uploadSingle } = require('../middleware');

const router = express.Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, uploadSingle, updateProfile);
router.get('/addresses', authenticate, getAddresses);
router.post('/addresses', authenticate, addAddress);
router.put('/addresses/:addressId', authenticate, updateAddress);
router.delete('/addresses/:addressId', authenticate, deleteAddress);
router.put('/preferences', authenticate, updatePreferences);

module.exports = router;