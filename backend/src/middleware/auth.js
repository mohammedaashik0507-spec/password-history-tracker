/**
 * Authentication Middleware
 * Handles JWT verification and request authentication
 */

import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { CONSTANTS } from '../config/constants.js';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';

/**
 * Middleware: Verify JWT Token
 */
export const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: CONSTANTS.MESSAGES.INVALID_TOKEN,
      });
    }

    // Verify token
    jwt.verify(token, config.JWT_SECRET, async (error, user) => {
      if (error) {
        // Log token verification failure
        await AuditLog.logAction({
          userId: null,
          action: CONSTANTS.AUDIT_ACTIONS.LOGIN,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          status: 'failed',
          details: `Invalid token: ${error.message}`,
        });

        return res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: CONSTANTS.MESSAGES.INVALID_TOKEN,
        });
      }

      // Fetch user from database to get latest data
      const currentUser = await User.findById(user.id);

      if (!currentUser || !currentUser.isActive) {
        return res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: CONSTANTS.MESSAGES.USER_NOT_FOUND,
        });
      }

      // Attach user to request object
      req.user = currentUser;
      next();
    });
  } catch (error) {
    console.error('Authentication Error:', error.message);
    res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: CONSTANTS.MESSAGES.SERVER_ERROR,
    });
  }
};

/**
 * Middleware: Check user role authorization
 */
export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: CONSTANTS.MESSAGES.UNAUTHORIZED,
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      // Log unauthorized access attempt
      AuditLog.logAction({
        userId: req.user._id,
        action: 'UNAUTHORIZED_ACCESS_ATTEMPT',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        status: 'failed',
        details: `Attempted to access ${req.originalUrl} with role ${req.user.role}`,
      }).catch(err => console.error('Audit log error:', err));

      return res.status(CONSTANTS.HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: CONSTANTS.MESSAGES.UNAUTHORIZED,
      });
    }

    next();
  };
};

/**
 * Middleware: Check account lockout status
 */
export const checkAccountLockout = async (req, res, next) => {
  try {
    if (req.user && req.user.isLocked) {
      return res.status(CONSTANTS.HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: CONSTANTS.MESSAGES.ACCOUNT_LOCKED,
        lockUntil: req.user.lockUntil,
      });
    }
    next();
  } catch (error) {
    console.error('Lockout Check Error:', error.message);
    res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: CONSTANTS.MESSAGES.SERVER_ERROR,
    });
  }
};

/**
 * Middleware: Check password expiration
 */
export const checkPasswordExpiration = (req, res, next) => {
  try {
    if (req.user && req.user.isPasswordExpiredCheck()) {
      res.locals.passwordExpired = true;
    }
    next();
  } catch (error) {
    console.error('Password Expiration Check Error:', error.message);
    res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: CONSTANTS.MESSAGES.SERVER_ERROR,
    });
  }
};

export default {
  authenticateToken,
  authorizeRole,
  checkAccountLockout,
  checkPasswordExpiration,
};
