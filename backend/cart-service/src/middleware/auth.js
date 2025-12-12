const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies.token;
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      req.userId = decoded.id;
    } else {
      // Generate session ID for guest users
      req.sessionId = req.cookies.sessionId || `guest_${Date.now()}_${Math.random()}`;
      if (!req.cookies.sessionId) {
        res.cookie('sessionId', req.sessionId, { 
          httpOnly: true, 
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
      }
    }
    next();
  } catch (error) {
    req.sessionId = req.cookies.sessionId || `guest_${Date.now()}_${Math.random()}`;
    if (!req.cookies.sessionId) {
      res.cookie('sessionId', req.sessionId, { 
        httpOnly: true, 
        maxAge: 7 * 24 * 60 * 60 * 1000 
      });
    }
    next();
  }
};

module.exports = auth;