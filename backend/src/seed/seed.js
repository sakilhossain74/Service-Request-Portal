import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Staff from '../models/Staff.js';
import Request from '../models/Request.js';
import { ROLES } from '../config/constants.js';

dotenv.config();

const STAFF_SEED = [
  { name: 'Rajesh Sharma', email: 'rajesh.sharma@staff.example.com', department: 'Electrical' },
  { name: 'Priya Nair', email: 'priya.nair@staff.example.com', department: 'IT Support' },
  { name: 'Amit Verma', email: 'amit.verma@staff.example.com', department: 'Plumbing' },
  { name: 'Sunita Devi', email: 'sunita.devi@staff.example.com', department: 'Housekeeping' },
  { name: 'Vikram Patel', email: 'vikram.patel@staff.example.com', department: 'General' }
];

const seedDatabase = async () => {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is required to run the seed script.');
    process.exit(1);
  }

  try {
    await connectDB();

    const adminEmail = (process.env.SEED_ADMIN_EMAIL || 'admin@example.com').toLowerCase();
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';

    let adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Portal Admin',
        email: adminEmail,
        password: adminPassword,
        role: ROLES.ADMIN
      });
      console.log(`Created admin user: ${adminEmail}`);
    } else {
      console.log(`Admin user already exists: ${adminEmail}`);
    }

    const demoUserEmail = 'user@example.com';
    let demoUser = await User.findOne({ email: demoUserEmail });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Demo User',
        email: demoUserEmail,
        password: 'User@123',
        role: ROLES.USER
      });
      console.log(`Created demo user: ${demoUserEmail}`);
    } else {
      console.log(`Demo user already exists: ${demoUserEmail}`);
    }

    const staffDocs = [];
    for (const member of STAFF_SEED) {
      let existingStaff = await Staff.findOne({ email: member.email });
      if (!existingStaff) {
        existingStaff = await Staff.create(member);
        console.log(`Created staff member: ${member.name}`);
      }
      staffDocs.push(existingStaff);
    }

    // Seed sample requests only if demo user currently has none (keeps seed idempotent)
    const existingDemoRequests = await Request.countDocuments({ createdBy: demoUser._id });
    if (existingDemoRequests === 0) {
      const now = new Date();
      await Request.insertMany([
        {
          title: 'Flickering ceiling light in Conference Room B',
          description: 'The main LED panel above the conference table flickers continuously and needs inspection.',
          category: 'Electrical',
          priority: 'High',
          status: 'Pending',
          createdBy: demoUser._id
        },
        {
          title: 'VPN client failing to connect on workstation',
          description: 'Unable to reach internal network after latest OS update; error code 720 appears.',
          category: 'IT Support',
          priority: 'High',
          status: 'Assigned',
          createdBy: demoUser._id,
          assignedTo: staffDocs[1]._id,
          assignedAt: now
        },
        {
          title: 'Leaking tap in 2nd floor washroom',
          description: 'The sink faucet drips constantly even when turned fully off.',
          category: 'Plumbing',
          priority: 'Medium',
          status: 'In Progress',
          createdBy: demoUser._id,
          assignedTo: staffDocs[2]._id,
          assignedAt: now
        },
        {
          title: 'Replace broken ergonomic chair armrest',
          description: 'Right armrest latch on desk #14 is cracked and will not lock in place.',
          category: 'Furniture',
          priority: 'Low',
          status: 'Resolved',
          createdBy: demoUser._id,
          assignedTo: staffDocs[4]._id,
          assignedAt: now,
          resolvedAt: now
        }
      ]);
      console.log('Seeded 4 sample requests for demo user');
    } else {
      console.log('Sample requests already exist for demo user; skipping');
    }

    console.log('Database seeding completed successfully.');
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedDatabase();
