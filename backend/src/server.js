/**
 * Password History Tracker - Backend Server
 * Main application entry point
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import 'dotenv/config';

// Import configuration
import { config } from './config/config.js';
import { connectDB } from './config/database.js';
import { CONSTANTS } from './config/constants.js';

// Import middleware
import {
  apiLimiter,
  corsOptions,
  helmetOptions,
  requestLogger,
} from './middleware/security.js';
import {
  errorHandler,
  notFoundHandler,
} from './middleware/errorHandler.js';

// Import routes
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Create Express app
const app = express();

/**
 * Middleware Setup
 */

// Security middleware
app.use(helmet(helmetOptions));
app.use(cors(corsOptions));

// Request logging
app.use(requestLogger);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rate limiting
app.use('/api/', apiLimiter);

/**
 * Routes
 */

// Health check routes
app.use('/api', healthRoutes);

// Authentication routes
app.use('/api/auth', authRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

/**
 * Error Handling
 */

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

/**
 * Database Connection & Server Start
 */

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start listening
    app.listen(config.PORT, () => {
      console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   Password History Tracker - Backend Server              ║
║   ✓ Server started successfully                          ║
║   ✓ Listening on port ${config.PORT}                        ║
║   ✓ Environment: ${config.NODE_ENV}                     ║
║   ✓ Database: MongoDB                                    ║
║                                                          ║
║   API: http://localhost:${config.PORT}                       ║
║   Health: http://localhost:${config.PORT}/api/health        ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('✓ SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('✓ SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start server
startServer();

export default app;
