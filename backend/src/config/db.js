const mongoose = require('mongoose');
const dns = require('dns');

// Force Node DNS resolver to use public DNS servers (Google + Cloudflare)
// to resolve MongoDB SRV records reliably on Windows networks
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // fallback to system DNS if setServers fails
}

// Connect to MongoDB (persistent only). No in-memory fallback.
// AUTOMATIC SEEDING HAS BEEN PERMANENTLY REMOVED.
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medicare';
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    
    // Safely mask URI for logging (hide passwords and credentials)
    const sanitizedUri = uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
    console.log(`✅ MongoDB connected successfully to: ${sanitizedUri}`);
  } catch (err) {
    const sanitizedUri = uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
    console.error('❌ Failed to connect to MongoDB at', sanitizedUri);
    console.error('   Error detail:', err.message);
    throw err;
  }
};

const getDbInfo = async () => {
  const collections = {};
  for (const modelName of ['User', 'Doctor', 'Appointment', 'Availability']) {
    try {
      const model = mongoose.model(modelName);
      collections[modelName] = await model.countDocuments();
    } catch (e) {
      collections[modelName] = 0;
    }
  }
  return {
    connected: mongoose.connection.readyState === 1,
    readyStateText:
      mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting/Disconnected',
    databaseName: mongoose.connection.name || 'medicare',
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    documentCounts: collections,
  };
};

module.exports = { connectDB, getDbInfo };
