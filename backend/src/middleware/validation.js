/**
 * Request Validation Middleware
 * Validates incoming requests using express-validator
 */

import { body, validationResult, param } from 'express-validator';
import { CONSTANTS } from '../config/constants.js';
import { config } from '../config/config.js';

/**
 * Handle validation errors
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(CONSTANTS.HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

/**
 * Validation: Register User
 */
export const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: config.MIN_PASSWORD_LENGTH })
    .withMessage(`Password must be at least ${config.MIN_PASSWORD_LENGTH} characters`)
    .matches(CONSTANTS.REGEX.STRONG_PASSWORD)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),
  
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),
];

/**
 * Validation: Login User
 */
export const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

/**
 * Validation: Change Password
 */
export const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: config.MIN_PASSWORD_LENGTH })
    .withMessage(`Password must be at least ${config.MIN_PASSWORD_LENGTH} characters`)
    .matches(CONSTANTS.REGEX.STRONG_PASSWORD)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),
  
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage('Passwords do not match'),
];

/**
 * Validation: Update Profile
 */
export const validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
];

/**
 * Validation: User ID
 */
export const validateUserId = [
  param('userId')
    .isMongoId()
    .withMessage('Invalid user ID'),
];

/**
 * Validation: Update Password Policy (Admin)
 */
export const validateUpdatePasswordPolicy = [
  body('minPasswordLength')
    .optional()
    .isInt({ min: 6, max: 20 })
    .withMessage('Minimum password length must be between 6 and 20'),
  
  body('passwordExpiryDays')
    .optional()
    .isInt({ min: 0, max: 365 })
    .withMessage('Password expiry days must be between 0 and 365'),
  
  body('preventReuseCount')
    .optional()
    .isInt({ min: 1, max: 24 })
    .withMessage('Prevent reuse count must be between 1 and 24'),
];

export default {
  handleValidationErrors,
  validateRegister,
  validateLogin,
  validateChangePassword,
  validateUpdateProfile,
  validateUserId,
  validateUpdatePasswordPolicy,
};
