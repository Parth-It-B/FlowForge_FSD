import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from './src/config/db.js';
import User from './src/models/User.js';
import Issue from './src/models/Issue.js';

const seedDatabase = async () => {
  try {
    console.log('[Seeder] Connecting to database...');
    await connectDB();

    console.log('[Seeder] Clearing old records...');
    await User.deleteMany({});
    await Issue.deleteMany({});

    console.log('[Seeder] Creating demo users...');
    // Create admin user
    const admin = await User.create({
      name: 'Sarah Connor (Admin)',
      email: 'admin@flowforge.dev',
      password: 'admin123',
      role: 'admin',
    });

    // Create standard developer user
    const dev = await User.create({
      name: 'Alex Rivera (Engineer)',
      email: 'alex@flowforge.dev',
      password: 'user123',
      role: 'user',
    });

    console.log('[Seeder] Creating sample issues...');
    await Issue.create([
      {
        title: 'Memory leak in real-time telemetry worker',
        description: 'Worker process RSS memory creeps above 1.5GB after 6 hours of continuous batch ingestion.',
        status: 'OPEN',
        priority: 'URGENT',
        assignedTo: 'Alex Rivera',
        createdBy: dev._id,
      },
      {
        title: 'Optimize MongoDB indexing for compound status queries',
        description: 'Slow queries observed when filtering issues by status and sorting by timestamp simultaneously.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assignedTo: 'Sarah Connor',
        createdBy: admin._id,
      },
      {
        title: 'Resolve mobile navigation responsive layout shift',
        description: 'Top navbar collapses unexpectedly on viewports narrower than 640px during orientation changes.',
        status: 'RESOLVED',
        priority: 'MEDIUM',
        assignedTo: 'Alex Rivera',
        createdBy: dev._id,
      },
      {
        title: 'Configure Helmet security headers and strict CORS whitelist',
        description: 'Ensure CSP and cross-origin resource sharing policies are audited and compliant.',
        status: 'CLOSED',
        priority: 'LOW',
        assignedTo: 'Sarah Connor',
        createdBy: admin._id,
      },
    ]);

    console.log('✅ [Seeder] Database seeded successfully!');
    console.log('----------------------------------------------------');
    console.log('Admin Account: admin@flowforge.dev / admin123');
    console.log('User Account:  alex@flowforge.dev  / user123');
    console.log('----------------------------------------------------');
  } catch (err) {
    console.error('❌ [Seeder] Failed to seed database:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedDatabase();
