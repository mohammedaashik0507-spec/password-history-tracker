/**
 * Password Service
 * Business logic for password management
 */

import User from '../models/User.js';
import PasswordHistory from '../models/PasswordHistory.js';
import AuditLog from '../models/AuditLog.js';
import { calculatePasswordStrength, getPasswordExpirationWarning } from '../utils/passwordUtils.js';
import { config } from '../config/config.js';
import { CONSTANTS } from '../config/constants.js';
import { getClientIP, getUserAgent } from '../utils/helpers.js';

/**
 * Get password history for user
 */
export const getPasswordHistory = async (userId) => {
  try {
    const history = await PasswordHistory.getHistory(userId, config.PREVENT_REUSE_COUNT + 5);
    return {
      history: history.map(record => ({
        changedAt: record.changedAt,
        changeReason: record.changeReason,
        passwordStrength: record.passwordStrength,
      })),
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get password status for user
 */
export const getPasswordStatus = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error(CONSTANTS.MESSAGES.USER_NOT_FOUND);
    }

    const passwordExpired = user.isPasswordExpiredCheck();
    const { shouldWarn, daysUntilExpiry, message } = getPasswordExpirationWarning(
      user.passwordExpiresAt
    );

    const history = await PasswordHistory.getHistory(userId, 5);

    return {
      lastPasswordChange: user.lastPasswordChange,
      passwordExpiresAt: user.passwordExpiresAt,
      passwordExpired,
      daysUntilExpiry,
      shouldWarn,
      warningMessage: message,
      passwordHistoryCount: history.length,
      passwordChangeAllowed: !passwordExpired && !user.isLocked,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Check password strength
 */
export const checkPasswordStrength = async (password) => {
  try {
    const strengthData = calculatePasswordStrength(password);
    return strengthData;
  } catch (error) {
    throw error;
  }
};

export default {
  getPasswordHistory,
  getPasswordStatus,
  checkPasswordStrength,
};
