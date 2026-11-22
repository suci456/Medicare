// scripts/cleanupDemoData.js
// Utility to remove legacy demo data from MongoDB collections.
// Usage:
//   node scripts/cleanupDemoData.js          -> cleans only demo records (demo emails)
//   node scripts/cleanupDemoData.js --all    -> cleans ALL records for a fresh empty database

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Load .env
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, { encoding: 'utf8' });
  envContent.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const idx = trimmed.indexOf('=');
    if (idx === -1) return;
    const key = trimmed.substring(0, idx).trim();
    const val = trimmed.substring(idx + 1).trim();
    process.env[key] = val;
  });
}

const { connectDB } = require('../src/config/db');
const User = require('../src/models/User');
const Doctor = require('../models/Doctor') || require('../src/models/Doctor');
const Appointment = require('../src/models/Appointment');
const Availability = require('../src/models/Availability');

(async () => {
  try {
    await connectDB();
    const cleanAll = process.argv.includes('--all');

    if (cleanAll) {
      console.log('🧹 Purging all collections for a fresh empty database...');
      await Appointment.deleteMany({});
      await Availability.deleteMany({});
      await Doctor.deleteMany({});
      await User.deleteMany({});
      console.log('✨ All collections successfully cleared! Database is completely empty.');
      process.exit(0);
    }

    console.log('🔍 Identifying legacy demo records...');
    const demoEmails = [
      'admin@example.com',
      'patient@medicare.com',
      'doctor@medicare.com',
      'alice@example.com',
    ];

    const deletedUsers = await User.deleteMany({ email: { $in: demoEmails } });
    const deletedDoctors = await Doctor.deleteMany({ email: { $in: demoEmails } });
    
    console.log(`🗑️ Removed ${deletedUsers.deletedCount} demo user(s).`);
    console.log(`🗑️ Removed ${deletedDoctors.deletedCount} demo doctor(s).`);
    console.log('✅ Demo cleanup complete. Real user records preserved.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during cleanup:', err.message);
    process.exit(1);
  }
})();
