/**
 * Audit Log Schema
 * Records all security-relevant activities for compliance and investigation
 */

import mongoose from 'mongoose';
import { CONSTANTS } from '../config/constants.js';

const auditLogSchema = new mongoose.Schema(
  {
    // Reference to User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Null for registration attempts or system events
    },

    // Action performed
    action: {
      type: String,
      enum: Object.values(CONSTANTS.AUDIT_ACTIONS),
      required: [true, 'Action is required'],
      index: true,
    },

    // IP Address
    ipAddress: {
      type: String,
      required: [true, 'IP address is required'],
    },

    // User Agent / Device Information
    userAgent: {
      type: String,
      default: null,
    },

    // Status of action
    status: {
      type: String,
      enum: ['success', 'failed', 'pending'],
      default: 'success',
      index: true,
    },

    // Detailed error or result message
    details: {
      type: String,
      default: null,
    },

    // Additional metadata
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Timestamp of action
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },

    // Resource affected (e.g., 'profile', 'password', 'settings')
    resourceType: {
      type: String,
      default: null,
    },

    // Resource ID affected
    resourceId: {
      type: String,
      default: null,
    },

    // Changes made (for audit trail)
    changes: {
      before: mongoose.Schema.Types.Mixed,
      after: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: false,
  }
);

/**
 * Indexes for efficient querying
 */
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ ipAddress: 1, timestamp: -1 });
auditLogSchema.index({ status: 1, timestamp: -1 });
auditLogSchema.index({ timestamp: -1 }); // For cleanup operations

/**
 * TTL Index: Automatically delete logs older than 90 days
 */
auditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 }); // 90 days

/**
 * Static Method: Log an action
 * @param {Object} logData - Log data
 * @returns {Promise<Object>}
 */
auditLogSchema.statics.logAction = function(logData) {
  return this.create({
    userId: logData.userId || null,
    action: logData.action,
    ipAddress: logData.ipAddress,
    userAgent: logData.userAgent || null,
    status: logData.status || 'success',
    details: logData.details || null,
    metadata: logData.metadata || {},
    resourceType: logData.resourceType || null,
    resourceId: logData.resourceId || null,
    changes: logData.changes || null,
  });
};

/**
 * Static Method: Get logs for a specific user
 * @param {string} userId - User ObjectId
 * @param {number} limit - Number of records to retrieve
 * @param {number} skip - Number of records to skip
 * @returns {Promise<Array>}
 */
auditLogSchema.statics.getUserLogs = function(userId, limit = 50, skip = 0) {
  return this.find({ userId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .skip(skip)
    .lean();
};

/**
 * Static Method: Get logs by action
 * @param {string} action - Action type
 * @param {number} limit - Number of records to retrieve
 * @returns {Promise<Array>}
 */
auditLogSchema.statics.getLogsByAction = function(action, limit = 50) {
  return this.find({ action })
    .sort({ timestamp: -1 })
    .limit(limit)
    .lean();
};

/**
 * Static Method: Get failed login attempts
 * @param {string} ipAddress - IP address
 * @param {number} hoursBack - Number of hours to look back
 * @returns {Promise<Array>}
 */
auditLogSchema.statics.getFailedLoginAttempts = function(ipAddress, hoursBack = 24) {
  const startTime = new Date(Date.now() - hoursBack * 60 * 60 * 1000);
  return this.find({
    action: CONSTANTS.AUDIT_ACTIONS.FAILED_LOGIN,
    ipAddress,
    timestamp: { $gte: startTime },
    status: 'failed',
  })
    .sort({ timestamp: -1 })
    .lean();
};

/**
 * Static Method: Get security report
 * @param {Date} startDate - Start date for report
 * @param {Date} endDate - End date for report
 * @returns {Promise<Object>}
 */
auditLogSchema.statics.getSecurityReport = async function(startDate, endDate) {
  const report = await this.aggregate([
    {
      $match: {
        timestamp: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: '$action',
        count: { $sum: 1 },
        failedCount: {
          $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] },
        },
      },
    },
  ]);

  return report;
};

/**
 * Static Method: Cleanup old logs (manual trigger)
 * @param {number} daysToKeep - Number of days of logs to keep
 * @returns {Promise<Object>}
 */
auditLogSchema.statics.cleanupOldLogs = async function(daysToKeep = 90) {
  const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
  const result = await this.deleteMany({ timestamp: { $lt: cutoffDate } });
  return result;
};

export default mongoose.model('AuditLog', auditLogSchema);
