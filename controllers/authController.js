const crypto = require('crypto');
const User = require('../models/User');
const { sendOTPEmail, sendPasswordResetEmail } = require('../utils/emailService');

// Generate random token
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Sign up controller
const signUp = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, dateOfBirth } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'User with this email already exists',
          type: 'DuplicateError'
        }
      });
    }

    // Create new user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      dateOfBirth
    });

    // Generate JWT token
    const token = user.generateAuthToken();

    // Update last login
    await user.update({ lastLoginAt: new Date() });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Sign in controller
const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid email or password',
          type: 'AuthenticationError'
        }
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Account is deactivated',
          type: 'AuthenticationError'
        }
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid email or password',
          type: 'AuthenticationError'
        }
      });
    }

    // Generate JWT token
    const token = user.generateAuthToken();

    // Update last login
    await user.update({ lastLoginAt: new Date() });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get current user profile
const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: req.user.toJSON()
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, dateOfBirth } = req.body;
    const updateData = {};

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;

    await req.user.update(updateData);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: req.user.toJSON()
      }
    });
  } catch (error) {
    next(error);
  }
};

// Request password change OTP
const requestPasswordChangeOTP = async (req, res, next) => {
  try {
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 600000); // 10 minutes

    await req.user.update({
      passwordChangeOtp: otp,
      passwordChangeOtpExpires: otpExpires
    });

    // Send OTP email
    const emailSent = await sendOTPEmail(
      req.user.email, 
      otp, 
      `${req.user.firstName} ${req.user.lastName}`
    );

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        error: {
          message: 'Failed to send OTP email. Please try again.',
          type: 'EmailError'
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email for password change'
    });
  } catch (error) {
    next(error);
  }
};

// Change password with OTP
const changePasswordWithOTP = async (req, res, next) => {
  try {
    const { otp, newPassword } = req.body;

    // Check if OTP matches and is not expired
    if (req.user.passwordChangeOtp !== otp || 
        new Date() > req.user.passwordChangeOtpExpires) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid or expired OTP',
          type: 'ValidationError'
        }
      });
    }

    // Update password and clear OTP
    await req.user.update({
      password: newPassword,
      passwordChangeOtp: null,
      passwordChangeOtpExpires: null
    });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Logout (client-side token removal)
const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signUp,
  signIn,
  getProfile,
  updateProfile,
  requestPasswordChangeOTP,
  changePasswordWithOTP,
  logout
}; 