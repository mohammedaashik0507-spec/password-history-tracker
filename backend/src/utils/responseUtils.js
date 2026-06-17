/**
 * Response Utilities
 * Standardized response formatting
 */

import { CONSTANTS } from '../config/constants.js';

/**
 * Send success response
 */
export const sendSuccess = (res, data = null, message = CONSTANTS.MESSAGES.SUCCESS, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data: data || undefined,
  });
};

/**
 * Send error response
 */
export const sendError = (res, message = CONSTANTS.MESSAGES.SERVER_ERROR, statusCode = 500, data = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    ...(data && { data }),
  });
};

/**
 * Send paginated response
 */
export const sendPaginated = (res, data, pagination, message = CONSTANTS.MESSAGES.SUCCESS, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      pages: Math.ceil(pagination.total / pagination.limit),
    },
  });
};

/**
 * Format user response (remove sensitive data)
 */
export const formatUserResponse = (user) => {
  if (!user) return null;

  const userObj = user.toObject ? user.toObject() : user;
  const { password, __v, ...safeUser } = userObj;

  return {
    ...safeUser,
    isPasswordExpired: user.isPasswordExpiredCheck?.() || false,
    isLocked: user.isLocked || false,
    securityScore: user.getSecurityScore?.() || 0,
  };
};

/**
 * Format password history response
 */
export const formatPasswordHistoryResponse = (history) => {
  return history.map(record => ({
    _id: record._id,
    changedAt: record.changedAt,
    changeReason: record.changeReason,
    passwordStrength: record.passwordStrength,
  }));
};

export default {
  sendSuccess,
  sendError,
  sendPaginated,
  formatUserResponse,
  formatPasswordHistoryResponse,
};
