const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const Availability = require('../models/Availability');
const Doctor = require('../models/Doctor');

// @desc    Patient books an appointment
// @route   POST /api/appointments
// @access  Private (patient)
exports.bookAppointment = asyncHandler(async (req, res) => {
  const { doctorId, date, timeSlot, slot, reason } = req.body;
  const chosenSlot = (timeSlot || slot || '').trim();

  if (!doctorId || !date || !chosenSlot) {
    return res.status(400).json({ message: 'Doctor, appointment date, and time slot are required.' });
  }

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return res.status(404).json({ message: 'Selected doctor was not found.' });
  }

  // Only approved doctors can accept appointments
  if (doctor.status && doctor.status !== 'approved') {
    return res.status(400).json({
      message: 'This doctor is currently not accepting appointments (Pending Approval).',
    });
  }

  // Parse target date boundaries (start and end of day)
  const appDate = new Date(date);
  const startOfDay = new Date(appDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(appDate);
  endOfDay.setHours(23, 59, 59, 999);

  // PREVENT DOUBLE BOOKING: Check if slot already has an active appointment
  const existingAppointment = await Appointment.findOne({
    doctor: doctorId,
    date: { $gte: startOfDay, $lte: endOfDay },
    timeSlot: chosenSlot,
    status: { $in: ['pending', 'accepted'] },
  });

  if (existingAppointment) {
    return res.status(409).json({
      message: 'This time slot is already booked for this doctor. Please select another time slot.',
    });
  }

  // Also prevent patient from booking overlapping appointment
  const patientConflict = await Appointment.findOne({
    patient: req.user._id,
    date: { $gte: startOfDay, $lte: endOfDay },
    timeSlot: chosenSlot,
    status: { $in: ['pending', 'accepted'] },
  });

  if (patientConflict) {
    return res.status(409).json({
      message: 'You already have another active appointment booked at this exact time slot.',
    });
  }

  const appointment = await Appointment.create({
    patient: req.user._id,
    doctor: doctorId,
    date: startOfDay,
    timeSlot: chosenSlot,
    reason: reason || 'General Consultation',
    status: 'pending',
  });

  // Pull booked slot from availability so other users immediately see it's taken
  await Availability.updateOne(
    {
      doctor: doctorId,
      date: { $gte: startOfDay, $lte: endOfDay },
    },
    { $pull: { slots: chosenSlot } }
  );

  const populated = await Appointment.findById(appointment._id)
    .populate('doctor', 'name specialization fee photoUrl hospital')
    .populate('patient', 'name email');

  res.status(201).json(populated);
});

// @desc    Patient view their own appointments
// @route   GET /api/appointments/my
// @access  Private (patient)
exports.getPatientAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ patient: req.user._id })
    .populate('doctor', 'name specialization fee photoUrl hospital experience')
    .sort({ date: -1, createdAt: -1 });

  res.json(appointments);
});

// @desc    Doctor view appointments assigned to them
// @route   GET /api/appointments/doctor
// @access  Private (doctor)
exports.getDoctorAppointments = asyncHandler(async (req, res) => {
  // Find doctor record linked to this logged-in user
  let doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) {
    doctor = await Doctor.findOne({ email: req.user.email }) || await Doctor.findOne({ name: req.user.name });
  }

  let filter = {};
  if (doctor) {
    filter = { doctor: doctor._id };
  } else {
    filter = { doctor: req.user._id };
  }

  const appointments = await Appointment.find(filter)
    .populate('patient', 'name email phone')
    .populate('doctor', 'name specialization fee photoUrl hospital phone')
    .sort({ date: 1, createdAt: -1 });

  res.json(appointments);
});

// @desc    Update appointment status (accept / reject / cancel / complete)
// @route   PUT /api/appointments/:id
// @access  Private (doctor or admin)
exports.updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'accepted', 'rejected', 'cancelled', 'completed'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  const appointment = await Appointment.findById(req.params.id)
    .populate('doctor')
    .populate('patient', 'name email phone');

  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found.' });
  }

  appointment.status = status;
  await appointment.save();

  // If rejected or cancelled, return the slot back to the doctor's availability
  if (status === 'cancelled' || status === 'rejected') {
    const startOfDay = new Date(appointment.date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(appointment.date);
    endOfDay.setHours(23, 59, 59, 999);

    await Availability.updateOne(
      {
        doctor: appointment.doctor._id,
        date: { $gte: startOfDay, $lte: endOfDay },
      },
      { $addToSet: { slots: appointment.timeSlot } }
    );
  }

  res.json(appointment);
});

// @desc    Patient cancels their own appointment
// @route   DELETE /api/appointments/:id
// @access  Private (patient)
exports.cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found.' });
  }

  if (appointment.patient.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'You are not authorized to cancel this appointment.' });
  }

  appointment.status = 'cancelled';
  await appointment.save();

  // Restore time slot to availability
  const startOfDay = new Date(appointment.date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(appointment.date);
  endOfDay.setHours(23, 59, 59, 999);

  await Availability.updateOne(
    {
      doctor: appointment.doctor,
      date: { $gte: startOfDay, $lte: endOfDay },
    },
    { $addToSet: { slots: appointment.timeSlot } }
  );

  res.json({ message: 'Appointment cancelled successfully.', appointment });
});

// @desc    Admin view all appointments
// @route   GET /api/appointments
// @access  Private (admin)
exports.getAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find()
    .populate('patient', 'name email')
    .populate('doctor', 'name specialization fee photoUrl')
    .sort({ date: -1, createdAt: -1 });

  res.json(appointments);
});
