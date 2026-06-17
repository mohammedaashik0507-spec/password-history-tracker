/**
 * Admin Controller
 * Handles admin-related requests
 */

import * as adminService from '../services/adminService.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/responseUtils.js';
import { CONSTANTS } from '../config/constants.js';

/**
 * Get All Users Controller
 */
export const getAllUsersController = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;

    const result = await adminService.getAllUsers(
      parseInt(page),
      parseInt(limit),
      search
    );

    return sendPaginated(
      res,
      result.users,
      result.pagination,
      'Users retrieved successfully',
      CONSTANTS.HTTP_STATUS.OK
    );
  } catch (error) {
    console.error('Get Users Error:', error.message);
    return sendError(
      res,
      CONSTANTS.MESSAGES.SERVER_ERROR,
      CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Get Audit Logs Controller
 */
export const getAuditLogsController = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, userId, action, status, ipAddress, startDate, endDate } = req.query;

    const filters = {};
    if (userId) filters.userId = userId;
    if (action) filters.action = action;
    if (status) filters.status = status;
    if (ipAddress) filters.ipAddress = ipAddress;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    const result = await adminService.getAuditLogs(
      parseInt(page),
      parseInt(limit),
      filters
    );

    return sendPaginated(
      res,
      result.logs,
      result.pagination,
      'Audit logs retrieved successfully',
      CONSTANTS.HTTP_STATUS.OK
    );
  } catch (error) {
    console.error('Get Audit Logs Error:', error.message);
    return sendError(
      res,
      CONSTANTS.MESSAGES.SERVER_ERROR,
      CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Get Failed Login Attempts Controller
 */
export const getFailedLoginAttemptsController = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, hours = 24 } = req.query;

    const result = await adminService.getFailedLoginAttempts(
      parseInt(page),
      parseInt(limit),
      parseInt(hours)
    );

    return sendPaginated(
      res,
      result.logs,
      result.pagination,
      'Failed login attempts retrieved successfully',
      CONSTANTS.HTTP_STATUS.OK
    );
  } catch (error) {
    console.error('Get Failed Login Attempts Error:', error.message);
    return sendError(
      res,
      CONSTANTS.MESSAGES.SERVER_ERROR,
      CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Get Security Report Controller
 */
export const getSecurityReportController = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return sendError(
        res,
        'Start date and end date are required',
        CONSTANTS.HTTP_STATUS.BAD_REQUEST
      );
    }

    const result = await adminService.getSecurityReport(startDate, endDate);

    return sendSuccess(
      res,
      result,
      'Security report retrieved successfully',
      CONSTANTS.HTTP_STATUS.OK
    );
  } catch (error) {
    console.error('Get Security Report Error:', error.message);
    return sendError(
      res,
      CONSTANTS.MESSAGES.SERVER_ERROR,
      CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Unlock User Account Controller
 */
export const unlockUserAccountController = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const result = await adminService.unlockUserAccount(userId, req);

    return sendSuccess(
      res,
      result.user,
      result.message,
      CONSTANTS.HTTP_STATUS.OK
    );
  } catch (error) {
    console.error('Unlock Account Error:', error.message);

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

export default {
  getAllUsersController,
  getAuditLogsController,
  getFailedLoginAttemptsController,
  getSecurityReportController,
  unlockUserAccountController,
};
