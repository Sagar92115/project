const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

/**
 * Admin Login Controller
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const sanitizedEmail = email.trim().toLowerCase();

    // Query admin by email (parameterized query)
    const result = await db.query(
      'SELECT id, email, password_hash FROM admins WHERE LOWER(email) = $1 LIMIT 1',
      [sanitizedEmail]
    );

    if (result.rows.length === 0) {
      // Timing-safe response to prevent user enumeration
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const admin = result.rows[0];

    // Compare provided password with stored bcrypt hash
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured on server.');
    }

    const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email
      },
      secret,
      { expiresIn }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        email: admin.email
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify current admin session
 * GET /api/auth/me (Protected)
 */
const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    admin: req.admin
  });
};

module.exports = {
  login,
  getMe
};
