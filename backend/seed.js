// seed.js (Manual utility with confirmation safeguard)
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');

if (!process.argv.includes('--confirm')) {
  console.log('⚠️  Automatic seeding is permanently disabled.');
  console.log('   To populate demo test data manually, pass the --confirm flag:');
  console.log('   node seed.js --confirm');
  process.exit(0);
}

const Doctor = require('./src/models/Doctor');
const Availability = require('./src/models/Availability');
const User = require('./src/models/User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for manual seeding');

    // Clean existing demo data
    await Doctor.deleteMany({ email: { $in: ['dr.maya@medicare.com', 'dr.james@medicare.com'] } });
    await User.deleteMany({ email: { $in: ['alice@example.com', 'admin@medicare.com'] } });

    console.log('✅ Demo records refreshed');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
})();
