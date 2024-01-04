const jwt = require('jsonwebtoken');
const config = require('../config/auth')

const authMiddleware = (req, res, next) => {
  try {
    const header = req.header('Authorization'); // Extract token from header
    if(!header) return res.status(403).json({ message: 'Unauthorized' });
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret); // Verify token
    req.user = decoded; // Attach user information to request object
    next(); // Proceed to next route handler
  } catch (err) {
    throw(err)
  }
};

module.exports = authMiddleware;
