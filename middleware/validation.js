const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        type: 'ValidationError',
        details: errors.array().map(error => ({
          field: error.path,
          message: error.msg,
          value: error.value
        }))
      }
    });
  }
  next();
};

// Sign up validation
const validateSignUp = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('firstName').isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  body('lastName').isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  body('dateOfBirth').isISO8601().withMessage('Please provide a valid date of birth'),
  validate
];

// Sign in validation
const validateSignIn = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

// Profile update validation
const validateProfileUpdate = [
  body('firstName').optional().isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  body('lastName').optional().isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  body('dateOfBirth').optional().isISO8601().withMessage('Please provide a valid date of birth'),
  validate
];

// OTP validation
const validateOTP = [
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  validate
];

// New password validation
const validateNewPassword = [
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  validate
];

module.exports = {
  validateSignUp,
  validateSignIn,
  validateProfileUpdate,
  validateOTP,
  validateNewPassword
}; 