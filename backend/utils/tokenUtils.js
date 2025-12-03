const jwt = require('jsonwebtoken');
const DatabaseManager = require('../config/database');

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  
  // Store refresh token in Redis
  const redisClient = DatabaseManager.getRedisClient();
  if (redisClient) {
    redisClient.setex(`refresh_token:${userId}`, 7 * 24 * 60 * 60, refreshToken);
  }
  
  return { accessToken, refreshToken };
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const generatePasswordResetToken = (userId) => {
  return jwt.sign({ userId, type: 'password_reset' }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const verifyPasswordResetToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (decoded.type !== 'password_reset') {
    throw new Error('Invalid token type');
  }
  return decoded;
};

module.exports = {
  generateTokens,
  verifyRefreshToken,
  verifyAccessToken,
  generatePasswordResetToken,
  verifyPasswordResetToken
};