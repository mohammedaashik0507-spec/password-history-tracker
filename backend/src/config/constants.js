/**
 * Constants for the application
 */

export const CONSTANTS = {
  // User Roles
  ROLES: {
    USER: 'user',
    ADMIN: 'admin',
  },

  // Audit Log Actions
  AUDIT_ACTIONS: {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    REGISTER: 'REGISTER',
    PASSWORD_CHANGE: 'PASSWORD_CHANGE',
    FAILED_LOGIN: 'FAILED_LOGIN',
    ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
    ACCOUNT_UNLOCKED: 'ACCOUNT_UNLOCKED',
    PROFILE_UPDATE: 'PROFILE_UPDATE',
    DELETE_ACCOUNT: 'DELETE_ACCOUNT',
  },

  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
  },

  // Password Strength Levels
  PASSWORD_STRENGTH: {
    WEAK: 'weak',
    FAIR: 'fair',
    GOOD: 'good',
    STRONG: 'strong',
    VERY_STRONG: 'very_strong',
  },

  // Response Messages
  MESSAGES: {
    SUCCESS: 'Operation successful',
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_EXISTS: 'User already exists with this email',
    USER_NOT_FOUND: 'User not found',
    PASSWORD_WEAK: 'Password does not meet security requirements',
    PASSWORD_REUSED: 'Password has been used before. Please choose a different password',
    ACCOUNT_LOCKED: 'Account is locked due to too many failed login attempts',
    INVALID_TOKEN: 'Invalid or expired token',
    UNAUTHORIZED: 'Unauthorized access',
    SERVER_ERROR: 'An error occurred. Please try again later',
  },

  // Regex Patterns
  REGEX: {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  },
};

export default CONSTANTS;
