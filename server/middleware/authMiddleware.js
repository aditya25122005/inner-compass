// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB and attach to req.user
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err);
    res
      .status(401)
      .json({ success: false, message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
