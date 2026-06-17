/**
 * Password Controller
 * Handles password-related requests
 */

import * as authService from '../services/authService.js';
import * as passwordService from '../services/passwordService.js';
import { sendSuccess, sendError } from '../utils/responseUtils.js';
import { CONSTANTS } from '../config/constants.js';

/**
 * Change Password Controller
 */
export const changePasswordController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    const result = await authService.changePassword(req, userId, {
      currentPassword,
      newPassword,
    });

    return sendSuccess(
      res,
      result,
      result.message,
      CONSTANTS.HTTP_STATUS.OK
    );
  } catch (error) {
    console.error('Change Password Error:', error.message);

    if (error.message === CONSTANTS.MESSAGES.PASSWORD_REUSED) {
      return sendError(
        res,
        error.message,
        CONSTANTS.HTTP_STATUS.CONFLICT
      );
    }

    if (
      error.message.includes('password') ||
      error.message === CONSTANTS.MESSAGES.USER_NOT_FOUND
    ) {
      return sendError(
        res,
        error.message,
        CONSTANTS.HTTP_STATUS.BAD_REQUEST
      );
    }

    return sendError(
      res,
      CONSTANTS.MESSAGES.SERVER_ERROR,
      CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Get Password History Controller
 */
export const getPasswordHistoryController = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const result = await passwordService.getPasswordHistory(userId);

    return sendSuccess(
      res,
      result.history,
      'Password history retrieved successfully',
      CONSTANTS.HTTP_STATUS.OK
    );
  } catch (error) {
    console.error('Get Password History Error:', error.message);
    return sendError(
      res,
      CONSTANTS.MESSAGES.SERVER_ERROR,
      CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Get Password Status Controller
 */
export const getPasswordStatusController = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const result = await passwordService.getPasswordStatus(userId);

    return sendSuccess(
      res,
      result,
      'Password status retrieved successfully',
      CONSTANTS.HTTP_STATUS.OK
    );
  } catch (error) {
    console.error('Get Password Status Error:', error.message);

    if (error.message === CONSTANTS.MESSAGES.USER_NOT_FOUND) {
      return sendError(
        res,
        error.message,
        CONSTANTS.HTTP_STATUS.NOT_FOUND
      );
    }

    return sendError(
      res,
      CONSTANTS.MESSAGES.SERVER_ERROR,
      CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Check Password Strength Controller
 */
export const checkPasswordStrengthController = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password) {
      return sendError(
        res,
        'Password is required',
        CONSTANTS.HTTP_STATUS.BAD_REQUEST
      );
    }

    const result = await passwordService.checkPasswordStrength(password);

    return sendSuccess(
      res,
      result,
      'Password strength calculated successfully',
      CONSTANTS.HTTP_STATUS.OK
    );
  } catch (error) {
    console.error('Check Password Strength Error:', error.message);
    return sendError(
      res,
      CONSTANTS.MESSAGES.SERVER_ERROR,
      CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

export default {
  changePasswordController,
  getPasswordHistoryController,
  getPasswordStatusController,
  checkPasswordStrengthController,
};
