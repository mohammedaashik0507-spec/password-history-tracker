/**
 * API Configuration
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  GET_CURRENT_USER: `${API_BASE_URL}/auth/me`,
  CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
  GET_PASSWORD_STATUS: `${API_BASE_URL}/auth/password-status`,
  GET_PASSWORD_HISTORY: `${API_BASE_URL}/auth/password-history`,
  CHECK_PASSWORD_STRENGTH: `${API_BASE_URL}/auth/check-password-strength`,

  // Admin
  GET_USERS: `${API_BASE_URL}/admin/users`,
  UNLOCK_USER: `${API_BASE_URL}/admin/users/:userId/unlock`,
  GET_AUDIT_LOGS: `${API_BASE_URL}/admin/logs`,
  GET_FAILED_LOGINS: `${API_BASE_URL}/admin/logs/failed-logins`,
  GET_SECURITY_REPORT: `${API_BASE_URL}/admin/security-report`,
};

export const API_CONFIG = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

export default API_ENDPOINTS;
