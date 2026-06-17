/**
 * Admin Service
 * Business logic for admin operations
 */

import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import { CONSTANTS } from '../config/constants.js';

/**
 * Get all users with pagination
 */
export const getAllUsers = async (page = 1, limit = 20, search = '') => {
  try {
    const skip = (page - 1) * limit;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .lean();

    const total = await User.countDocuments(query);

    const usersWithScores = users.map(user => ({
      ...user,
      securityScore: 0, // Will be calculated on frontend if needed
    }));

    return {
      users: usersWithScores,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get audit logs with pagination and filtering
 */
export const getAuditLogs = async (page = 1, limit = 50, filters = {}) => {
  try {
    const skip = (page - 1) * limit;

    const query = {};
    if (filters.userId) query.userId = filters.userId;
    if (filters.action) query.action = filters.action;
    if (filters.status) query.status = filters.status;
    if (filters.ipAddress) query.ipAddress = filters.ipAddress;

    if (filters.startDate || filters.endDate) {
      query.timestamp = {};
      if (filters.startDate) query.timestamp.$gte = new Date(filters.startDate);
      if (filters.endDate) query.timestamp.$lte = new Date(filters.endDate);
    }

    const logs = await AuditLog.find(query)
      .limit(limit)
      .skip(skip)
      .sort({ timestamp: -1 })
      .lean();

    const total = await AuditLog.countDocuments(query);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get failed login attempts
 */
export const getFailedLoginAttempts = async (page = 1, limit = 50, hours = 24) => {
  try {
    const skip = (page - 1) * limit;

    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);

    const logs = await AuditLog.find({
      action: CONSTANTS.AUDIT_ACTIONS.FAILED_LOGIN,
      status: 'failed',
      timestamp: { $gte: startTime },
    })
      .limit(limit)
      .skip(skip)
      .sort({ timestamp: -1 })
      .lean();

    const total = await AuditLog.countDocuments({
      action: CONSTANTS.AUDIT_ACTIONS.FAILED_LOGIN,
      status: 'failed',
      timestamp: { $gte: startTime },
    });

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get security report
 */
export const getSecurityReport = async (startDate, endDate) => {
  try {
    const report = await AuditLog.getSecurityReport(
      new Date(startDate),
      new Date(endDate)
    );

    // Additional statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const lockedUsers = await User.countDocuments({ lockUntil: { $gt: new Date() } });

    return {
      report,
      statistics: {
        totalUsers,
        activeUsers,
        lockedUsers,
      },
      period: {
        startDate,
        endDate,
      },
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Unlock user account
 */
export const unlockUserAccount = async (userId, req) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error(CONSTANTS.MESSAGES.USER_NOT_FOUND);
    }

    user.lockUntil = null;
    user.failedLoginAttempts = 0;
    await user.save();

    // Log account unlock
    await AuditLog.logAction({
      userId: req.user._id,
      action: CONSTANTS.AUDIT_ACTIONS.ACCOUNT_UNLOCKED,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success',
      details: `Admin unlocked account for user ${user.email}`,
      resourceType: 'user',
      resourceId: userId,
    });

    return {
      user: user.toJSON(),
      message: 'User account unlocked successfully',
    };
  } catch (error) {
    throw error;
  }
};

export default {
  getAllUsers,
  getAuditLogs,
  getFailedLoginAttempts,
  getSecurityReport,
  unlockUserAccount,
};
