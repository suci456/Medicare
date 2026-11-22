const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @desc    Get dashboard statistics (admin)
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = asyncHandler(async (req, res) => {
  const totalDoctors = await Doctor.countDocuments();
  const pendingDoctors = await Doctor.countDocuments({ status: 'pending' });
  const approvedDoctors = await Doctor.countDocuments({
    $or: [{ status: 'approved' }, { status: { $exists: false } }],
  });
  const totalPatients = await User.countDocuments({ role: 'patient' });
  const totalAppointments = await Appointment.countDocuments();
  const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
  const acceptedAppointments = await Appointment.countDocuments({ status: 'accepted' });
  const cancelledAppointments = await Appointment.countDocuments({ status: 'cancelled' });

  // Calculate estimated total revenue from accepted appointments
  const acceptedAppts = await Appointment.find({ status: 'accepted' }).populate('doctor', 'fee');
  const totalRevenue = acceptedAppts.reduce((sum, app) => sum + (app.doctor?.fee || 0), 0);

  res.json({
    totalDoctors,
    pendingDoctors,
    approvedDoctors,
    totalPatients,
    totalAppointments,
    pendingAppointments,
    acceptedAppointments,
    cancelledAppointments,
    totalRevenue,
  });
});

// @desc    Get all registered users (admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

// @desc    Delete a user (admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  // Prevent admin from deleting themselves
  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({ message: 'Admin cannot delete their own account.' });
  }

  // Also remove associated appointments
  await Appointment.deleteMany({ patient: user._id });
  await User.findByIdAndDelete(req.params.id);

  res.json({ message: 'User and related records removed successfully.' });
});
