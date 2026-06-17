/**
 * Password History Schema
 * Stores hashed passwords for reuse prevention and history tracking
 */

import mongoose from 'mongoose';

const passwordHistorySchema = new mongoose.Schema(
  {
    // Reference to User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },

    // Hashed password (never store plain text)
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },

    // Password strength at the time of change
    passwordStrength: {
      type: String,
      enum: ['weak', 'fair', 'good', 'strong', 'very_strong'],
      default: 'good',
    },

    // Timestamp of password change
    changedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    // Reason for password change (manual, expired, compromised, etc.)
    changeReason: {
      type: String,
      enum: ['manual', 'expired', 'compromised', 'admin_forced'],
      default: 'manual',
    },

    // IP Address from which password was changed
    ipAddress: {
      type: String,
      default: null,
    },

    // User Agent for device tracking
    userAgent: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: false,
  }
);

/**
 * Compound index for efficient queries
 * Query user password history
 */
passwordHistorySchema.index({ userId: 1, changedAt: -1 });

/**
 * Static Method: Get password history for user
 * @param {string} userId - User ObjectId
 * @param {number} limit - Number of records to retrieve
 * @returns {Promise<Array>}
 */
passwordHistorySchema.statics.getHistory = function(userId, limit = 10) {
  return this.find({ userId })
    .sort({ changedAt: -1 })
    .limit(limit)
    .lean();
};

/**
 * Static Method: Check if password has been used before
 * @param {string} userId - User ObjectId
 * @param {string} passwordToCheck - Password to verify against history
 * @param {number} preventReuseCount - Number of previous passwords to check
 * @returns {Promise<boolean>}
 */
passwordHistorySchema.statics.checkPasswordReuse = async function(
  userId,
  passwordToCheck,
  preventReuseCount
) {
  const bcrypt = await import('bcryptjs');
  const recentPasswords = await this.find({ userId })
    .sort({ changedAt: -1 })
    .limit(preventReuseCount)
    .lean();

  for (const record of recentPasswords) {
    const matches = await bcrypt.compare(passwordToCheck, record.passwordHash);
    if (matches) {
      return true; // Password has been used before
    }
  }

  return false; // Password has not been used before
};

/**
 * Static Method: Add password to history
 * @param {string} userId - User ObjectId
 * @param {string} passwordHash - Hashed password
 * @param {string} changeReason - Reason for change
 * @param {string} ipAddress - IP address
 * @param {string} userAgent - User agent
 * @returns {Promise<Object>}
 */
passwordHistorySchema.statics.addToHistory = function(
  userId,
  passwordHash,
  changeReason = 'manual',
  ipAddress = null,
  userAgent = null
) {
  return this.create({
    userId,
    passwordHash,
    changeReason,
    ipAddress,
    userAgent,
  });
};

/**
 * Static Method: Clear old password history
 * @param {string} userId - User ObjectId
 * @param {number} keepCount - Number of recent records to keep
 * @returns {Promise<void>}
 */
passwordHistorySchema.statics.clearOldHistory = async function(userId, keepCount = 10) {
  const records = await this.find({ userId })
    .sort({ changedAt: -1 })
    .skip(keepCount)
    .lean();

  const idsToDelete = records.map(r => r._id);
  if (idsToDelete.length > 0) {
    await this.deleteMany({ _id: { $in: idsToDelete } });
  }
};

export default mongoose.model('PasswordHistory', passwordHistorySchema);
