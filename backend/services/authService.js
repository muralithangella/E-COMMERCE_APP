const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const BaseService = require('./baseService');

class AuthService extends BaseService {
  constructor() {
    super('auth-service');
  }
  generateTokens(userId) {
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '15m' });
    const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' });
    
    // Store refresh token in Redis
    const redisClient = this.getRedisClient();
    if (redisClient) {
      redisClient.setex(`refresh_token:${userId}`, 7 * 24 * 60 * 60, refreshToken);
    }
    
    return { accessToken, refreshToken };
  }

  verifyRefreshToken(token) {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  }

  async validateUser(email, password) {
    const user = await User.findOne({ email, isActive: true });
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  async createUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const user = new User({
      ...userData,
      password: hashedPassword
    });
    
    return await user.save();
  }

  async invalidateRefreshToken(userId) {
    const redisClient = this.getRedisClient();
    if (redisClient) {
      await redisClient.del(`refresh_token:${userId}`);
    }
  }

  async generatePasswordResetToken(userId) {
    return jwt.sign({ userId, type: 'password_reset' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  }

  verifyPasswordResetToken(token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'password_reset') {
      throw new Error('Invalid token type');
    }
    return decoded;
  }
}

module.exports = new AuthService();