/**
 * JWT Token Utilities
 * Handles token generation and validation
 */

import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

/**
 * Generate JWT Access Token
 * @param {string} userId - User ID
 * @param {string} role - User role
 * @returns {string} JWT token
 */
export const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRY }
  );
};

/**
 * Generate JWT Refresh Token
 * @param {string} userId - User ID
 * @returns {string} JWT token
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    config.JWT_SECRET,
    { expiresIn: config.JWT_REFRESH_EXPIRY }
  );
};

/**
 * Verify JWT Token
 * @param {string} token - JWT token
 * @returns {Object} Decoded token
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (error) {
    throw new Error(`Token verification failed: ${error.message}`);
  }
};

/**
 * Decode JWT Token without verification (for debugging)
 * @param {string} token - JWT token
 * @returns {Object} Decoded token
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean}
 */
export const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return true;
    
    return Date.now() >= decoded.exp * 1000;
  } catch (error) {
    return true;
  }
};

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  decodeToken,
  isTokenExpired,
};
