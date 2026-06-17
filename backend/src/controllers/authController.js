/**
 * Authentication Controller
 * Handles authentication-related requests
 */

import * as authService from '../services/authService.js';
import { sendSuccess, sendError } from '../utils/responseUtils.js';
import { CONSTANTS } from '../config/constants.js';
import User from '../models/User.js';

/**
 * Register Controller
 */
export const registerController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const result = await authService.registerUser(req, {
      name,
      email,
      password,
    });

    return sendSuccess(
      res,
      result.user,
      'User registered successfully',
      CONSTANTS.HTTP_STATUS.CREATED
    );
  } catch (error) {
    console.error('Registration Error:', error.message);

    if (error.message === CONSTANTS.MESSAGES.USER_EXISTS) {
      return sendError(
        res,
        error.message,
        CONSTANTS.HTTP_STATUS.CONFLICT
      );
    }

    if (error.message.includes('password')) {
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
 * Login Controller
 */
export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser(req, {
      email,
      password,
    });

    return sendSuccess(
      res,
      {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        passwordExpired: result.passwordExpired,
      },
      result.message,
      CONSTANTS.HTTP_STATUS.OK
    );
  } catch (error) {
    console.error('Login Error:', error.message);

    if (error.message === CONSTANTS.MESSAGES.INVALID_CREDENTIALS) {
      return sendError(
        res,
        error.message,
        CONSTANTS.HTTP_STATUS.UNAUTHORIZED
      );
    }

    if (error.message === CONSTANTS.MESSAGES.ACCOUNT_LOCKED) {
      return sendError(
        res,
        error.message,
        CONSTANTS.HTTP_STATUS.FORBIDDEN
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
 * Logout Controller
 */
export const logoutController = async (req, res, next) => {
  try {
    const userId = req.user._id;

    await authService.logoutUser(req, userId);

    return sendSuccess(
      res,
      null,
      'Logout successful',
      CONSTANTS.HTTP_STATUS.OK
    );
  } catch (error) {
    console.error('Logout Error:', error.message);
    return sendError(
      res,
      CONSTANTS.MESSAGES.SERVER_ERROR,
      CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Get Current User Controller
 */
export const getCurrentUserController = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return sendError(
        res,
        CONSTANTS.MESSAGES.USER_NOT_FOUND,
        CONSTANTS.HTTP_STATUS.NOT_FOUND
      );
    }

    return sendSuccess(
      res,
      {
        ...user.toJSON(),
        isPasswordExpired: user.isPasswordExpiredCheck(),
        securityScore: user.getSecurityScore(),
      },
      'User retrieved successfully',
      CONSTANTS.HTTP_STATUS.OK
    );
  } catch (error) {
    console.error('Get User Error:', error.message);
    return sendError(
      res,
      CONSTANTS.MESSAGES.SERVER_ERROR,
      CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

export default {
  registerController,
  loginController,
  logoutController,
  getCurrentUserController,
};
