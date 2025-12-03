const express = require('express');
const { register, login, logout, refreshToken, forgotPassword, resetPassword } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validation');
const { authLimiter } = require('../middleware/security');

const router = express.Router();

router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;