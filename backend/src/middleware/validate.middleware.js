const { validationResult } = require('express-validator');

/**
 * Middleware to check express-validator validation errors.
 * Returns structured 400 Bad Request if validation rules fail.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value
    }));
    return res.status(400).json({
      success: false,
      message: errorDetails[0]?.message || 'Validation failed',
      errors: errorDetails
    });
  }
  next();
};

module.exports = { validate };
