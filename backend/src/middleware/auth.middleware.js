const jwt = require('jsonwebtoken');

/**
 * Authentication middleware for protecting admin routes.
 * Verifies custom JWT token passed in Authorization: Bearer <token> header.
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.'
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Malformed token.'
    });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('CRITICAL: JWT_SECRET environment variable is missing.');
    return res.status(500).json({
      success: false,
      message: 'Server authentication configuration error.'
    });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Session expired. Please log in again.'
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid or corrupted token.'
      });
    }

    req.admin = decoded;
    next();
  });
};

module.exports = { authenticateToken };
