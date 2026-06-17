/**
 * Database Configuration
 * Handles MongoDB connection and connection pooling
 */

import mongoose from 'mongoose';

/**
 * Connect to MongoDB Database
 * @returns {Promise<void>}
 */
export const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/password-history-tracker';
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('✓ MongoDB Connected Successfully');
    
    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠ MongoDB Disconnected');
    });

    mongoose.connection.on('error', (error) => {
      console.error('✗ MongoDB Connection Error:', error.message);
    });

  } catch (error) {
    console.error('✗ MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB Database
 * @returns {Promise<void>}
 */
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✓ MongoDB Disconnected Successfully');
  } catch (error) {
    console.error('✗ MongoDB Disconnection Error:', error.message);
    process.exit(1);
  }
};

export default mongoose;
