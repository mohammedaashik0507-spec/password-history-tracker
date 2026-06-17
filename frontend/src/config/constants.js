/**
 * Application Constants
 */

export const CONSTANTS = {
  // User Roles
  ROLES: {
    USER: 'user',
    ADMIN: 'admin',
  },

  // Password Strength Levels
  PASSWORD_STRENGTH: {
    WEAK: 'weak',
    FAIR: 'fair',
    GOOD: 'good',
    STRONG: 'strong',
    VERY_STRONG: 'very_strong',
  },

  // Security Score
  SECURITY_SCORE_LEVELS: {
    CRITICAL: { min: 0, max: 30, color: 'danger', label: 'Critical' },
    LOW: { min: 31, max: 50, color: 'warning', label: 'Low' },
    MEDIUM: { min: 51, max: 70, color: 'info', label: 'Medium' },
    HIGH: { min: 71, max: 85, color: 'success', label: 'High' },
    EXCELLENT: { min: 86, max: 100, color: 'success', label: 'Excellent' },
  },

  // Error Messages
  ERRORS: {
    INVALID_EMAIL: 'Please enter a valid email',
    PASSWORD_WEAK: 'Password does not meet security requirements',
    PASSWORD_MISMATCH: 'Passwords do not match',
    USER_EXISTS: 'User already exists with this email',
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'You are not authorized to perform this action',
    SERVER_ERROR: 'An error occurred. Please try again later',
  },

  // Success Messages
  SUCCESS: {
    REGISTRATION: 'Registration successful! Please log in.',
    LOGIN: 'Login successful!',
    PASSWORD_CHANGED: 'Password changed successfully',
    LOGOUT: 'Logged out successfully',
  },

  // Storage Keys
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    USER: 'user',
    THEME: 'theme',
  },
};

export default CONSTANTS;
