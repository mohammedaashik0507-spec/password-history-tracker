/**
 * Helper Utilities
 */

import { CONSTANTS } from '../config/constants.js';

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const isStrongPassword = (password) => {
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
};

/**
 * Format date
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date and time
 */
export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get security score color
 */
export const getScoreColor = (score) => {
  const levels = CONSTANTS.SECURITY_SCORE_LEVELS;
  if (score <= levels.CRITICAL.max) return 'danger';
  if (score <= levels.LOW.max) return 'warning';
  if (score <= levels.MEDIUM.max) return 'info';
  if (score <= levels.HIGH.max) return 'success';
  return 'success';
};

/**
 * Get password strength color
 */
export const getPasswordStrengthColor = (strength) => {
  const colors = {
    weak: 'danger',
    fair: 'warning',
    good: 'info',
    strong: 'success',
    very_strong: 'success',
  };
  return colors[strength] || 'gray';
};

/**
 * Capitalize string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncate string
 */
export const truncate = (str, length = 50) => {
  if (!str || str.length <= length) return str;
  return str.substring(0, length) + '...';
};

/**
 * Get days until date
 */
export const getDaysUntil = (date) => {
  const now = new Date();
  const target = new Date(date);
  const diff = target - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export default {
  isValidEmail,
  isStrongPassword,
  formatDate,
  formatDateTime,
  getScoreColor,
  getPasswordStrengthColor,
  capitalize,
  truncate,
  getDaysUntil,
};
