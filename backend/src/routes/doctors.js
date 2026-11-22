const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllDoctors,
  getDepartments,
  getDoctorById,
  getMyDoctorProfile,
  updateMyDoctorProfile,
  createDoctor,
  updateDoctor,
  updateDoctorStatus,
  deleteDoctor,
} = require('../controllers/doctorController');

// Doctor profile (for logged-in doctor)
router.get('/me/profile', protect, authorize('doctor'), getMyDoctorProfile);
router.put('/me/profile', protect, authorize('doctor'), updateMyDoctorProfile);

// Public routes
router.get('/', getAllDoctors);
router.get('/departments', getDepartments);
router.get('/:id', getDoctorById);

// Admin-only management routes
router.post('/', protect, authorize('admin'), createDoctor);
router.put('/:id', protect, authorize('admin'), updateDoctor);
router.put('/:id/status', protect, authorize('admin'), updateDoctorStatus);
router.delete('/:id', protect, authorize('admin'), deleteDoctor);

module.exports = router;
