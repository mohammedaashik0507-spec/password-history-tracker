/**
 * Password Strength Utilities
 * Calculates password strength and provides recommendations
 */

import { CONSTANTS } from '../config/constants.js';

/**
 * Calculate password strength score
 * @param {string} password - Password to evaluate
 * @returns {Object} Score and strength level
 */
export const calculatePasswordStrength = (password) => {
  if (!password) {
    return {
      score: 0,
      strength: CONSTANTS.PASSWORD_STRENGTH.WEAK,
      percentage: 0,
      recommendations: ['Password is required'],
    };
  }

  let score = 0;
  let maxScore = 40; // Maximum points per category
  const recommendations = [];

  // 1. Length scoring (0-10)
  if (password.length >= 8) score += 5;
  if (password.length >= 12) score += 5;
  if (password.length < 8) recommendations.push('Use at least 8 characters');

  // 2. Uppercase letters (0-10)
  if (/[A-Z]/.test(password)) score += 10;
  else recommendations.push('Include uppercase letters');

  // 3. Lowercase letters (0-10)
  if (/[a-z]/.test(password)) score += 10;
  else recommendations.push('Include lowercase letters');

  // 4. Numbers (0-10)
  if (/\d/.test(password)) score += 10;
  else recommendations.push('Include numbers');

  // 5. Special characters (0-10)
  if (/[@$!%*?&]/.test(password)) score += 10;
  else recommendations.push('Include special characters (@$!%*?&)');

  // 6. No common patterns (0-5)
  if (!hasCommonPatterns(password)) score += 5;
  else recommendations.push('Avoid common patterns like sequential numbers');

  // Determine strength level
  const percentage = Math.round((score / maxScore) * 100);
  let strength = CONSTANTS.PASSWORD_STRENGTH.WEAK;

  if (percentage >= 80) strength = CONSTANTS.PASSWORD_STRENGTH.VERY_STRONG;
  else if (percentage >= 60) strength = CONSTANTS.PASSWORD_STRENGTH.STRONG;
  else if (percentage >= 40) strength = CONSTANTS.PASSWORD_STRENGTH.GOOD;
  else if (percentage >= 20) strength = CONSTANTS.PASSWORD_STRENGTH.FAIR;

  return {
    score,
    strength,
    percentage: Math.min(percentage, 100),
    recommendations,
    isStrong: strength === CONSTANTS.PASSWORD_STRENGTH.STRONG || 
              strength === CONSTANTS.PASSWORD_STRENGTH.VERY_STRONG,
  };
};

/**
 * Check for common password patterns
 * @param {string} password - Password to check
 * @returns {boolean} True if common patterns found
 */
export const hasCommonPatterns = (password) => {
  // Common patterns
  const patterns = [
    /^123456/,           // 123456...
    /^password/i,        // password...
    /^qwerty/i,          // qwerty...
    /^abc123/i,          // abc123...
    /(\d)\1{2,}/,        // Repeated numbers (111, 222, etc.)
    /([a-z])\1{2,}/i,    // Repeated letters (aaa, bbb, etc.)
  ];

  return patterns.some(pattern => pattern.test(password));
};

/**
 * Get password expiration warning
 * @param {Date} expiresAt - Password expiration date
 * @returns {Object} Warning information
 */
export const getPasswordExpirationWarning = (expiresAt) => {
  if (!expiresAt) {
    return { shouldWarn: false, daysUntilExpiry: null, message: null };
  }

  const now = new Date();
  const daysUntilExpiry = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));

  let shouldWarn = false;
  let message = null;

  if (daysUntilExpiry <= 0) {
    shouldWarn = true;
    message = 'Your password has expired. Please change it immediately.';
  } else if (daysUntilExpiry <= 7) {
    shouldWarn = true;
    message = `Your password will expire in ${daysUntilExpiry} days.`;
  } else if (daysUntilExpiry <= 14) {
    shouldWarn = true;
    message = `Your password will expire in ${daysUntilExpiry} days. Consider changing it soon.`;
  }

  return { shouldWarn, daysUntilExpiry, message };
};

/**
 * Generate password suggestion
 * @returns {string} Suggested strong password
 */
export const generateStrongPassword = () => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '@$!%*?&';
  const allChars = uppercase + lowercase + numbers + special;

  let password = '';

  // Ensure at least one from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // Add random characters to reach 12 characters minimum
  for (let i = password.length; i < 12; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  password = password.split('').sort(() => Math.random() - 0.5).join('');

  return password;
};

export default {
  calculatePasswordStrength,
  hasCommonPatterns,
  getPasswordExpirationWarning,
  generateStrongPassword,
};
