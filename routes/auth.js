const express = require('express');
const router = express.Router();

const {
  signUp,
  signIn,
  getProfile,
  updateProfile,
  requestPasswordChangeOTP,
  changePasswordWithOTP,
  requestPasswordReset,
  resetPassword,
  logout
} = require('../controllers/authController');

const {
  authenticateToken
} = require('../middleware/auth');

const {
  validateSignUp,
  validateSignIn,
  validatePasswordResetRequest,
  validatePasswordReset,
  validateProfileUpdate,
  validateOTP,
  validateNewPassword
} = require('../middleware/validation');

// Public routes
router.post('/signup', validateSignUp, signUp);
router.post('/signin', validateSignIn, signIn);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, validateProfileUpdate, updateProfile);
router.post('/request-password-change-otp', authenticateToken, requestPasswordChangeOTP);
router.post('/change-password-with-otp', authenticateToken, validateOTP, validateNewPassword, changePasswordWithOTP);
router.post('/logout', authenticateToken, logout);

// Optional authenticated routes (for future use)
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user.toJSON()
    }
  });
});

module.exports = router; 