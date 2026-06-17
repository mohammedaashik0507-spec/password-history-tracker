/**
 * Authentication Service
 * Business logic for authentication operations
 */

import User from '../models/User.js';
import PasswordHistory from '../models/PasswordHistory.js';
import AuditLog from '../models/AuditLog.js';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenUtils.js';
import { calculatePasswordStrength } from '../utils/passwordUtils.js';
import { config } from '../config/config.js';
import { CONSTANTS } from '../config/constants.js';
import { getClientIP, getUserAgent } from '../utils/helpers.js';

/**
 * Register new user
 */
export const registerUser = async (req, data) => {
  try {
    const { name, email, password } = data;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error(CONSTANTS.MESSAGES.USER_EXISTS);
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
    });

    await user.save();

    // Log registration
    await AuditLog.logAction({
      userId: user._id,
      action: CONSTANTS.AUDIT_ACTIONS.REGISTER,
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
      status: 'success',
      details: `User registered: ${email}`,
    });

    // Create initial password history entry
    await PasswordHistory.addToHistory(
      user._id,
      user.password,
      'manual',
      getClientIP(req),
      getUserAgent(req)
    );

    return {
      user: user.toJSON(),
      message: 'User registered successfully',
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Login user
 */
export const loginUser = async (req, data) => {
  try {
    const { email, password } = data;
    const ipAddress = getClientIP(req);
    const userAgent = getUserAgent(req);

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    // Check if user exists
    if (!user) {
      // Log failed login attempt
      await AuditLog.logAction({
        userId: null,
        action: CONSTANTS.AUDIT_ACTIONS.FAILED_LOGIN,
        ipAddress,
        userAgent,
        status: 'failed',
        details: `Failed login attempt: user not found (${email})`,
      });
      throw new Error(CONSTANTS.MESSAGES.INVALID_CREDENTIALS);
    }

    // Check if account is locked
    if (user.isLocked) {
      // Log account locked attempt
      await AuditLog.logAction({
        userId: user._id,
        action: CONSTANTS.AUDIT_ACTIONS.FAILED_LOGIN,
        ipAddress,
        userAgent,
        status: 'failed',
        details: 'Account is locked due to too many failed attempts',
      });
      throw new Error(CONSTANTS.MESSAGES.ACCOUNT_LOCKED);
    }

    // Check if account is active
    if (!user.isActive) {
      throw new Error('Account is inactive');
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      // Increment failed login attempts
      await user.incFailedLoginAttempts();

      // Log failed login
      await AuditLog.logAction({
        userId: user._id,
        action: CONSTANTS.AUDIT_ACTIONS.FAILED_LOGIN,
        ipAddress,
        userAgent,
        status: 'failed',
        details: `Failed login attempt (attempt ${user.failedLoginAttempts})`,
      });

      throw new Error(CONSTANTS.MESSAGES.INVALID_CREDENTIALS);
    }

    // Reset failed login attempts
    await user.resetFailedLoginAttempts();

    // Check password expiration
    const passwordExpired = user.isPasswordExpiredCheck();

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Log successful login
    await AuditLog.logAction({
      userId: user._id,
      action: CONSTANTS.AUDIT_ACTIONS.LOGIN,
      ipAddress,
      userAgent,
      status: 'success',
      details: `User logged in successfully`,
    });

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
      passwordExpired,
      message: 'Login successful',
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user
 */
export const logoutUser = async (req, userId) => {
  try {
    const ipAddress = getClientIP(req);
    const userAgent = getUserAgent(req);

    // Log logout
    await AuditLog.logAction({
      userId,
      action: CONSTANTS.AUDIT_ACTIONS.LOGOUT,
      ipAddress,
      userAgent,
      status: 'success',
      details: 'User logged out',
    });

    return { message: 'Logout successful' };
  } catch (error) {
    throw error;
  }
};

/**
 * Change password
 */
export const changePassword = async (req, userId, data) => {
  try {
    const { currentPassword, newPassword } = data;
    const ipAddress = getClientIP(req);
    const userAgent = getUserAgent(req);

    // Get user with password
    const user = await User.findById(userId).select('+password');

    if (!user) {
      throw new Error(CONSTANTS.MESSAGES.USER_NOT_FOUND);
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Check if new password is same as current
    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
      throw new Error('New password must be different from current password');
    }

    // Check password reuse
    const isReused = await PasswordHistory.checkPasswordReuse(
      userId,
      newPassword,
      config.PREVENT_REUSE_COUNT
    );

    if (isReused) {
      throw new Error(CONSTANTS.MESSAGES.PASSWORD_REUSED);
    }

    // Calculate password strength
    const strengthData = calculatePasswordStrength(newPassword);

    // Store old password in history
    await PasswordHistory.addToHistory(
      userId,
      user.password,
      'manual',
      ipAddress,
      userAgent
    );

    // Update password
    user.password = newPassword;
    user.passwordExpiresAt = new Date(Date.now() + config.PASSWORD_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    await user.save();

    // Store new password in history
    await PasswordHistory.addToHistory(
      userId,
      user.password,
      'manual',
      ipAddress,
      userAgent
    );

    // Clean up old password history
    await PasswordHistory.clearOldHistory(userId, config.PREVENT_REUSE_COUNT);

    // Log password change
    await AuditLog.logAction({
      userId,
      action: CONSTANTS.AUDIT_ACTIONS.PASSWORD_CHANGE,
      ipAddress,
      userAgent,
      status: 'success',
      details: `Password changed successfully`,
      metadata: {
        passwordStrength: strengthData.strength,
      },
    });

    return {
      message: 'Password changed successfully',
      passwordStrength: strengthData.strength,
    };
  } catch (error) {
    throw error;
  }
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  changePassword,
};
