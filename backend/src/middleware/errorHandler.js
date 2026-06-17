/**
 * Error Handling Middleware
 * Centralized error handling for the application
 */

import { CONSTANTS } from '../config/constants.js';

/**
 * Custom Application Error Class
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global Error Handler Middleware
 */
export const errorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR;
  error.message = error.message || CONSTANTS.MESSAGES.SERVER_ERROR;

  // Mongoose Validation Error
  if (error.name === 'ValidationError') {
    const message = Object.values(error.errors)
      .map(val => val.message)
      .join(', ');
    error = new AppError(message, CONSTANTS.HTTP_STATUS.BAD_REQUEST);
  }

  // Mongoose Duplicate Key Error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    error = new AppError(
      `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
      CONSTANTS.HTTP_STATUS.CONFLICT
    );
  }

  // JWT Errors
  if (error.name === 'JsonWebTokenError') {
    error = new AppError(
      CONSTANTS.MESSAGES.INVALID_TOKEN,
      CONSTANTS.HTTP_STATUS.UNAUTHORIZED
    );
  }

  if (error.name === 'TokenExpiredError') {
    error = new AppError(
      'Token has expired',
      CONSTANTS.HTTP_STATUS.UNAUTHORIZED
    );
  }

  // Send error response
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

/**
 * 404 Not Found Handler
 */
export const notFoundHandler = (req, res) => {
  res.status(CONSTANTS.HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

export default {
  AppError,
  errorHandler,
  notFoundHandler,
};
