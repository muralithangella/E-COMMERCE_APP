const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authLimiter } = require('../middleware/security');

const generateSimpleTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId, type: 'access' }, 
    process.env.JWT_SECRET || 'fallback-secret', 
    { expiresIn: '15m', issuer: 'ecommerce-app' }
  );
  const refreshToken = jwt.sign(
    { userId, type: 'refresh' }, 
    process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret', 
    { expiresIn: '7d', issuer: 'ecommerce-app' }
  );
  return { accessToken, refreshToken };
};

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email }).select('_id');
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password });
    await user.save();
    
    const { accessToken, refreshToken } = generateSimpleTokens(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists' });
    }
    res.status(500).json({ message: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    console.log('Login attempt:', req.body.email);
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email, isActive: true }).select('+password');
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log('Invalid password for:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const { accessToken, refreshToken } = generateSimpleTokens(user._id);
    console.log('Login successful for:', email);

    res.json({
      message: 'Login successful',
      user: { id: user._id, email: user.email, name: user.name },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Logout failed', error: error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId);

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    await EmailService.sendEmail({
      to: email,
      subject: 'Password Reset',
      html: `<p>Click <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}">here</a> to reset your password</p>`
    });

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send reset email', error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    await User.findByIdAndUpdate(decoded.userId, { password: hashedPassword });
    
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { register, login, logout, refreshToken, forgotPassword, resetPassword };