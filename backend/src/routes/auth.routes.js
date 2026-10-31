const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { login, getMe } = require('../controllers/auth.controller');
const { validate } = require('../middleware/validate.middleware');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Strict rate limit on login attempts: max 10 requests per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many login attempts from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate admin and issue JWT
 * @access  Public (Rate limited)
 */
router.post(
  '/login',
  loginLimiter,
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address.')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required.')
  ],
  validate,
  login
);

/**
 * @route   GET /api/auth/me
 * @desc    Verify admin token and return admin info
 * @access  Protected
 */
router.get('/me', authenticateToken, getMe);

module.exports = router;
