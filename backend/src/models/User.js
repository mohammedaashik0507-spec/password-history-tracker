/**
 * User Schema
 * Stores user account information and authentication data
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { CONSTANTS } from '../config/constants.js';
import { config } from '../config/config.js';

const userSchema = new mongoose.Schema(
  {
    // Personal Information
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [CONSTANTS.REGEX.EMAIL, 'Please provide a valid email address'],
      index: true,
    },
    
    // Password Management
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't include password in queries by default
    },
    
    // Account Status
    role: {
      type: String,
      enum: Object.values(CONSTANTS.ROLES),
      default: CONSTANTS.ROLES.USER,
    },
    
    // Security - Account Lockout
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    
    lockUntil: {
      type: Date,
      default: null,
    },
    
    // Password Expiry
    lastPasswordChange: {
      type: Date,
      default: Date.now,
    },
    
    passwordExpiresAt: {
      type: Date,
      default: function() {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + config.PASSWORD_EXPIRY_DAYS);
        return expiryDate;
      },
    },
    
    // Account Status
    isActive: {
      type: Boolean,
      default: true,
    },
    
    // Virtual for password expiration status
    isPasswordExpired: {
      type: Boolean,
      default: false,
    },
    
    // Two Factor Authentication (future enhancement)
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    
    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Index for efficient queries
 */
userSchema.index({ email: 1, isActive: 1 });
userSchema.index({ role: 1 });

/**
 * Virtual: Check if account is locked
 */
userSchema.virtual('isLocked').get(function() {
  return this.lockUntil && this.lockUntil > Date.now();
});

/**
 * Hash password before saving
 */
userSchema.pre('save', async function(next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Check password strength
    if (!CONSTANTS.REGEX.STRONG_PASSWORD.test(this.password)) {
      throw new Error('Password must contain uppercase, lowercase, number, and special character');
    }

    // Hash password
    const salt = await bcrypt.genSalt(config.BCRYPT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    this.lastPasswordChange = new Date();
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Method: Compare password
 * @param {string} passwordToCheck - Password to verify
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function(passwordToCheck) {
  try {
    return await bcrypt.compare(passwordToCheck, this.password);
  } catch (error) {
    throw error;
  }
};

/**
 * Method: Increment failed login attempts
 * @returns {Promise<void>}
 */
userSchema.methods.incFailedLoginAttempts = async function() {
  this.failedLoginAttempts += 1;

  // Lock account after max attempts
  if (this.failedLoginAttempts >= config.MAX_LOGIN_ATTEMPTS) {
    this.lockUntil = new Date(Date.now() + config.LOCK_TIME * 60 * 1000);
  }

  return this.save();
};

/**
 * Method: Reset failed login attempts
 * @returns {Promise<void>}
 */
userSchema.methods.resetFailedLoginAttempts = async function() {
  this.failedLoginAttempts = 0;
  this.lockUntil = null;
  this.lastLogin = new Date();
  return this.save();
};

/**
 * Method: Check if password is expired
 * @returns {boolean}
 */
userSchema.methods.isPasswordExpiredCheck = function() {
  return this.passwordExpiresAt < new Date();
};

/**
 * Method: Get security score
 * @returns {number} Score from 0-100
 */
userSchema.methods.getSecurityScore = function() {
  let score = 50; // Base score

  // Factor 1: Account age (newer accounts have lower score)
  const accountAgeMonths = (Date.now() - this.createdAt) / (1000 * 60 * 60 * 24 * 30);
  if (accountAgeMonths > 6) score += 15;
  if (accountAgeMonths > 12) score += 10;

  // Factor 2: Last login (recent login increases score)
  if (this.lastLogin) {
    const daysSinceLastLogin = (Date.now() - this.lastLogin) / (1000 * 60 * 60 * 24);
    if (daysSinceLastLogin < 7) score += 10;
    if (daysSinceLastLogin > 30) score -= 5;
  }

  // Factor 3: No failed attempts (good security)
  if (this.failedLoginAttempts === 0) score += 10;

  // Factor 4: Password not expired
  if (!this.isPasswordExpiredCheck()) score += 5;

  return Math.min(score, 100);
};

/**
 * Remove sensitive data before sending response
 */
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

export default mongoose.model('User', userSchema);
