/**
 * Authentication Routes
 */

import express from 'express';
import * as authController from '../controllers/authController.js';
import * as passwordController from '../controllers/passwordController.js';
import { authenticateToken } from '../middleware/auth.js';
import {
  validateRegister,
  validateLogin,
  validateChangePassword,
  handleValidationErrors,
} from '../middleware/validation.js';
import { authLimiter, passwordLimiter } from '../middleware/security.js';

const router = express.Router();

/**
 * Public Routes
 */

// POST /api/auth/register
// Register a new user
router.post(
  '/register',
  authLimiter,
  validateRegister,
  handleValidationErrors,
  authController.registerController
);

// POST /api/auth/login
// User login
router.post(
  '/login',
  authLimiter,
  validateLogin,
  handleValidationErrors,
  authController.loginController
);

/**
 * Protected Routes
 */

// GET /api/auth/me
// Get current user
router.get(
  '/me',
  authenticateToken,
  authController.getCurrentUserController
);

// POST /api/auth/logout
// User logout
router.post(
  '/logout',
  authenticateToken,
  authController.logoutController
);

// POST /api/auth/change-password
// Change user password
router.post(
  '/change-password',
  authenticateToken,
  passwordLimiter,
  validateChangePassword,
  handleValidationErrors,
  passwordController.changePasswordController
);

// GET /api/auth/password-status
// Get password status
router.get(
  '/password-status',
  authenticateToken,
  passwordController.getPasswordStatusController
);

// GET /api/auth/password-history
// Get password history
router.get(
  '/password-history',
  authenticateToken,
  passwordController.getPasswordHistoryController
);

// POST /api/auth/check-password-strength
// Check password strength
router.post(
  '/check-password-strength',
  authenticateToken,
  passwordController.checkPasswordStrengthController
);

export default router;
