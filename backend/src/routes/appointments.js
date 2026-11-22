const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  getAllAppointments,
  cancelAppointment,
} = require('../controllers/appointmentController');

// Patient can book an appointment
router.post('/', protect, authorize('patient'), bookAppointment);

// Patient view own appointments
router.get('/my', protect, authorize('patient'), getPatientAppointments);

// Patient can cancel own appointment
router.delete('/:id', protect, authorize('patient'), cancelAppointment);

// Doctor view appointments for them
router.get('/doctor', protect, authorize('doctor'), getDoctorAppointments);

// Doctor or admin can update status (accept/reject/cancel)
router.put('/:id', protect, authorize('doctor', 'admin'), updateAppointmentStatus);

// Admin can view all appointments
router.get('/', protect, authorize('admin'), getAllAppointments);

module.exports = router;

