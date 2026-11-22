const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
  try {
    const secret = process.env.JWT_SECRET || 'medicare_default_jwt_secret_2026';
    const decoded = jwt.verify(token, secret);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'User belonging to this token no longer exists' });
    }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Session expired or invalid token. Please log in again.' });
  }
};

// Role based check
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: User role '${req.user?.role || 'unknown'}' is not authorized to access this route`,
      });
    }
    next();
  };
};
