/**
 * Health Check Routes
 */

import express from 'express';

const router = express.Router();

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/
 * API information
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Password History Tracker API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      admin: '/api/admin',
      health: '/api/health',
    },
  });
});

export default router;
