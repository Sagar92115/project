const express = require('express');
const { body, param, query } = require('express-validator');
const rateLimit = require('express-rate-limit');
const {
  createInquiry,
  getInquiries,
  updateInquiryStatus
} = require('../controllers/inquiry.controller');
const { validate } = require('../middleware/validate.middleware');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Rate limiter for public inquiries submission: 20 inquiries per 15 minutes per IP
const inquirySubmitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many inquiries submitted from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const VALID_USER_TYPES = ['Parent', 'Student', 'School'];
const VALID_CATEGORIES = ['Scholarship', 'Concert', 'Admission', 'General Query'];
const VALID_STATUSES = ['New', 'In Progress', 'Resolved'];

/**
 * @route   POST /api/inquiries
 * @desc    Submit a new public inquiry
 * @access  Public (Rate limited)
 */
router.post(
  '/',
  inquirySubmitLimiter,
  [
    body('user_type')
      .trim()
      .notEmpty()
      .withMessage('User type is required.')
      .isIn(VALID_USER_TYPES)
      .withMessage(`User type must be one of: ${VALID_USER_TYPES.join(', ')}`),
    body('category')
      .trim()
      .notEmpty()
      .withMessage('Category is required.')
      .isIn(VALID_CATEGORIES)
      .withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`),
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required.')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters.'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required.')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail(),
    body('phone')
      .trim()
      .notEmpty()
      .withMessage('Phone number is required.')
      .matches(/^[0-9]{10}$/)
      .withMessage('Phone number must be exactly 10 digits.'),
    body('message')
      .trim()
      .notEmpty()
      .withMessage('Message is required.')
      .isLength({ min: 5, max: 2000 })
      .withMessage('Message must be between 5 and 2000 characters.')
  ],
  validate,
  createInquiry
);

/**
 * @route   GET /api/inquiries
 * @desc    Get paginated, filtered inquiries
 * @access  Protected (Admin only)
 */
router.get(
  '/',
  authenticateToken,
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer.'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100.')
  ],
  validate,
  getInquiries
);

/**
 * @route   PATCH /api/inquiries/:id/status
 * @desc    Update status of an inquiry
 * @access  Protected (Admin only)
 */
router.patch(
  '/:id/status',
  authenticateToken,
  [
    param('id')
      .isUUID()
      .withMessage('Invalid inquiry ID format (must be a valid UUID).'),
    body('status')
      .trim()
      .notEmpty()
      .withMessage('Status is required.')
      .isIn(VALID_STATUSES)
      .withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`)
  ],
  validate,
  updateInquiryStatus
);

module.exports = router;
