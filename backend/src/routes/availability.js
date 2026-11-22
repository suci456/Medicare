const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getDoctorAvailability,
  getAvailabilityByDoctor,
  addAvailability,
  removeAvailabilitySlot,
} = require('../controllers/availabilityController');

// Public availability check
router.get('/doctor/:doctorId', getAvailabilityByDoctor);

// Authenticated doctor/admin routes
router.get('/me', protect, authorize('doctor'), getDoctorAvailability);
router.post('/', protect, authorize('doctor', 'admin'), addAvailability);
router.delete('/', protect, authorize('doctor', 'admin'), removeAvailabilitySlot);

module.exports = router;
