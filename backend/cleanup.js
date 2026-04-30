// Database cleanup script
// This script deletes all users and chapters from the database

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Chapter from './src/models/Chapter.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const clearDatabase = async () => {
  try {
    console.log('🔄 Starting database cleanup...');

    // Delete all chapters
    const chaptersDeleted = await Chapter.deleteMany({});
    console.log(`✅ Deleted ${chaptersDeleted.deletedCount} chapters`);

    // Delete all users
    const usersDeleted = await User.deleteMany({});
    console.log(`✅ Deleted ${usersDeleted.deletedCount} users`);

    console.log('✅ Database cleanup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
};

// Run the cleanup
connectDB().then(() => {
  clearDatabase();
});
