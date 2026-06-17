/**
 * API Service
 * Centralized API calls with error handling and interceptors
 */

import axios from 'axios';
import { API_ENDPOINTS, API_CONFIG } from '../config/api.js';
import { CONSTANTS } from '../config/constants.js';

// Create axios instance
const apiClient = axios.create({
  timeout: API_CONFIG.TIMEOUT,
});

// Request Interceptor - Add token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear stored auth data
      localStorage.removeItem(CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(CONSTANTS.STORAGE_KEYS.USER);
      
      // Redirect to login
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

/**
 * Authentication Service
 */
export const authAPI = {
  register: (data) => apiClient.post(API_ENDPOINTS.REGISTER, data),
  login: (data) => apiClient.post(API_ENDPOINTS.LOGIN, data),
  logout: () => apiClient.post(API_ENDPOINTS.LOGOUT),
  getCurrentUser: () => apiClient.get(API_ENDPOINTS.GET_CURRENT_USER),
};

/**
 * Password Service
 */
export const passwordAPI = {
  changePassword: (data) => apiClient.post(API_ENDPOINTS.CHANGE_PASSWORD, data),
  getPasswordStatus: () => apiClient.get(API_ENDPOINTS.GET_PASSWORD_STATUS),
  getPasswordHistory: () => apiClient.get(API_ENDPOINTS.GET_PASSWORD_HISTORY),
  checkPasswordStrength: (password) =>
    apiClient.post(API_ENDPOINTS.CHECK_PASSWORD_STRENGTH, { password }),
};

/**
 * Admin Service
 */
export const adminAPI = {
  getUsers: (page = 1, limit = 20, search = '') =>
    apiClient.get(API_ENDPOINTS.GET_USERS, {
      params: { page, limit, search },
    }),
  unlockUser: (userId) =>
    apiClient.post(API_ENDPOINTS.UNLOCK_USER.replace(':userId', userId)),
  getAuditLogs: (page = 1, limit = 50, filters = {}) =>
    apiClient.get(API_ENDPOINTS.GET_AUDIT_LOGS, {
      params: { page, limit, ...filters },
    }),
  getFailedLogins: (page = 1, limit = 50, hours = 24) =>
    apiClient.get(API_ENDPOINTS.GET_FAILED_LOGINS, {
      params: { page, limit, hours },
    }),
  getSecurityReport: (startDate, endDate) =>
    apiClient.get(API_ENDPOINTS.GET_SECURITY_REPORT, {
      params: { startDate, endDate },
    }),
};

export default apiClient;
