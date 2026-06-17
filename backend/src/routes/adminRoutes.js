/**
 * Admin Routes
 */

import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import { validateUserId, handleValidationErrors } from '../middleware/validation.js';
import { adminLimiter } from '../middleware/security.js';
import { CONSTANTS } from '../config/constants.js';

const router = express.Router();

/**
 * All admin routes require authentication and admin role
 */
router.use(authenticateToken);
router.use(authorizeRole(CONSTANTS.ROLES.ADMIN));
router.use(adminLimiter);

/**
 * Users Management
 */

// GET /api/admin/users
// Get all users with pagination
router.get(
  '/users',
  adminController.getAllUsersController
);

// POST /api/admin/users/:userId/unlock
// Unlock user account
router.post(
  '/users/:userId/unlock',
  validateUserId,
  handleValidationErrors,
  adminController.unlockUserAccountController
);

/**
 * Audit & Security
 */

// GET /api/admin/logs
// Get audit logs
router.get(
  '/logs',
  adminController.getAuditLogsController
);

// GET /api/admin/logs/failed-logins
// Get failed login attempts
router.get(
  '/logs/failed-logins',
  adminController.getFailedLoginAttemptsController
);

// GET /api/admin/security-report
// Get security report
router.get(
  '/security-report',
  adminController.getSecurityReportController
);

export default router;
