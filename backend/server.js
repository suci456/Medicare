// Simple .env loader (no external deps)
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
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

const express = require('express');
const cors = require('cors');
const { connectDB, getDbInfo } = require('./src/config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./src/routes/auth');
const doctorRoutes = require('./src/routes/doctors');
const appointmentRoutes = require('./src/routes/appointments');
const availabilityRoutes = require('./src/routes/availability');
const adminRoutes = require('./src/routes/admin');

// Health Check
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/admin', adminRoutes);

// Contact Inquiry API
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }
  console.log('📩 Contact Inquiry Received:', { name, email, subject, message, receivedAt: new Date() });
  res.status(200).json({
    success: true,
    message: 'Thank you! Your inquiry has been submitted to the MediCare clinical team.',
  });
});

// Database Status Endpoint
app.get('/api/db-status', async (req, res) => {
  try {
    const info = await getDbInfo();
    res.json({
      status: 'success',
      ...info,
      viewOptions: {
        inAppAdminDashboard: 'http://localhost:3000/admin/dashboard',
        cloudAtlasGuide: 'Configure persistent MONGODB_URI in backend/.env',
      },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Root API Explorer
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    project: 'MediCare - Doctor Appointment & Healthcare Management System',
    timestamp: new Date(),
    endpoints: [
      '/api/auth',
      '/api/doctors',
      '/api/appointments',
      '/api/availability',
      '/api/admin',
      '/api/contact',
      '/health',
    ],
  });
});

// Centralized Error Handling Middleware (must be after all routes)
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack || err.message);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? null : err.message,
  });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 MediCare API server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to start server due to DB error:', err);
    process.exit(1);
  });
