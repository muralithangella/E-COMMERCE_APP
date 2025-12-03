const jwt = require('jsonwebtoken');
const User = require('../models/User');
const CacheService = require('../services/cacheService');
const { createHash } = require('crypto');

// Enhanced authentication with session tracking
const enhancedAuthenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    // Check token blacklist
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const isBlacklisted = await CacheService.get(`blacklist:${tokenHash}`);
    
    if (isBlacklisted) {
      return res.status(401).json({ message: 'Token has been revoked' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check user session
    const sessionKey = `session:${decoded.userId}:${decoded.sessionId || 'default'}`;
    const session = await CacheService.get(sessionKey);
    
    if (!session) {
      return res.status(401).json({ message: 'Session expired' });
    }

    const user = await User.findById(decoded.userId).select('-password').lean();
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    // Update last activity
    await CacheService.set(sessionKey, { 
      ...session, 
      lastActivity: new Date(),
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }, 24 * 60 * 60); // 24 hours

    req.user = user;
    req.session = session;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Device fingerprinting for security
const deviceFingerprint = (req, res, next) => {
  const fingerprint = createHash('sha256')
    .update(req.get('User-Agent') + req.ip + (req.get('Accept-Language') || ''))
    .digest('hex');
  
  req.deviceFingerprint = fingerprint;
  next();
};

// Suspicious activity detection
const suspiciousActivityDetection = async (req, res, next) => {
  if (!req.user) return next();

  const key = `activity:${req.user._id}`;
  const activity = await CacheService.get(key) || { requests: 0, lastReset: Date.now() };
  
  const now = Date.now();
  const timeWindow = 60 * 1000; // 1 minute
  
  if (now - activity.lastReset > timeWindow) {
    activity.requests = 0;
    activity.lastReset = now;
  }
  
  activity.requests++;
  
  // Flag suspicious activity (more than 100 requests per minute)
  if (activity.requests > 100) {
    console.warn('Suspicious activity detected:', {
      userId: req.user._id,
      ip: req.ip,
      requests: activity.requests,
      userAgent: req.get('User-Agent')
    });
    
    // Temporarily increase rate limiting for this user
    req.suspiciousActivity = true;
  }
  
  await CacheService.set(key, activity, 300); // 5 minutes
  next();
};

// Token blacklisting
const blacklistToken = async (token) => {
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const decoded = jwt.decode(token);
  const ttl = decoded.exp - Math.floor(Date.now() / 1000);
  
  if (ttl > 0) {
    await CacheService.set(`blacklist:${tokenHash}`, true, ttl);
  }
};

module.exports = {
  enhancedAuthenticate,
  deviceFingerprint,
  suspiciousActivityDetection,
  blacklistToken
};