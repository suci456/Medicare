// scripts/createAdmin.js
// Secure script to create or update the first Administrator account in MongoDB.
// Usage:
//   node scripts/createAdmin.js
//   node scripts/createAdmin.js admin@medicare.com customPassword "Admin Name"

const fs = require('fs');
const path = require('path');

// Ensure .env is loaded
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

(async () => {
  try {
    await connectDB();

    const adminEmail = (process.argv[2] || process.env.ADMIN_EMAIL || 'admin@medicare.com').toLowerCase().trim();
    const rawPassword = process.argv[3] || process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.argv[4] || 'System Administrator';

    if (!adminEmail || !rawPassword) {
      console.error('❌ Email and password are required to create an admin account.');
      process.exit(1);
    }

    if (rawPassword.length < 6) {
      console.error('❌ Password must be at least 6 characters long.');
      process.exit(1);
    }

    let existing = await User.findOne({ email: adminEmail });
    if (existing) {
      // Update existing admin account
      existing.name = adminName;
      existing.password = rawPassword; // User schema pre('save') hook hashes this once
      existing.role = 'admin';
      await existing.save();
      console.log('🛡️  Admin account updated successfully:');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${rawPassword}`);
      console.log(`   Role: ${existing.role}`);
      process.exit(0);
    }

    // Create new admin user
    const newAdmin = await User.create({
      name: adminName,
      email: adminEmail,
      password: rawPassword, // User schema pre('save') hook hashes this once
      role: 'admin',
    });

    console.log('🛡️  Admin user created successfully:');
    console.log(`   Email: ${newAdmin.email}`);
    console.log(`   Password: ${rawPassword}`);
    console.log(`   Role: ${newAdmin.role}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating/updating admin user:', err.message);
    process.exit(1);
  }
})();
