const asyncHandler = require('express-async-handler');
const Availability = require('../models/Availability');
const Doctor = require('../models/Doctor');

// Helper to resolve the Doctor record for the current user
const resolveDoctorId = async (req, fallbackDocId) => {
  if (fallbackDocId) return fallbackDocId;
  if (!req.user) return null;

  const doctor =
    (await Doctor.findOne({ user: req.user._id })) ||
    (await Doctor.findOne({ email: req.user.email })) ||
    (await Doctor.findOne({ name: req.user.name }));

  return doctor ? doctor._id : null;
};

// @desc    Get logged‑in doctor availability (private)
// @route   GET /api/availability/me
// @access  Private (doctor)
exports.getDoctorAvailability = asyncHandler(async (req, res) => {
  const doctorId = await resolveDoctorId(req);
  if (!doctorId) {
    return res.json([]);
  }
  const avail = await Availability.find({ doctor: doctorId }).sort({ date: 1 });
  res.json(avail);
});

// @desc    Get public availability for a specific doctor
// @route   GET /api/availability/doctor/:doctorId
// @access  Public
exports.getAvailabilityByDoctor = asyncHandler(async (req, res) => {
  const { doctorId } = req.params;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const avail = await Availability.find({
    doctor: doctorId,
    date: { $gte: today },
  }).sort({ date: 1 });

  res.json(avail);
});

// @desc    Add availability slots for a specific date (private)
// @route   POST /api/availability
// @access  Private (doctor or admin)
exports.addAvailability = asyncHandler(async (req, res) => {
  let { date, slots, doctorId } = req.body;

  if (!date) {
    return res.status(400).json({ message: 'Date is required.' });
  }

  // Handle both array of strings and comma-separated string
  let parsedSlots = [];
  if (Array.isArray(slots)) {
    parsedSlots = slots.map((s) => String(s).trim()).filter(Boolean);
  } else if (typeof slots === 'string') {
    parsedSlots = slots
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  if (parsedSlots.length === 0) {
    return res.status(400).json({ message: 'At least one valid time slot is required.' });
  }

  const targetDocId = await resolveDoctorId(req, doctorId);
  if (!targetDocId) {
    return res.status(400).json({ message: 'Target doctor record could not be resolved.' });
  }

  const day = new Date(date);
  day.setHours(0, 0, 0, 0);

  let record = await Availability.findOne({ doctor: targetDocId, date: day });
  if (record) {
    record.slots = Array.from(new Set([...record.slots, ...parsedSlots]));
    await record.save();
  } else {
    record = await Availability.create({ doctor: targetDocId, date: day, slots: parsedSlots });
  }

  res.status(201).json(record);
});

// @desc    Remove a specific slot from a date (private)
// @route   DELETE /api/availability
// @access  Private (doctor or admin)
exports.removeAvailabilitySlot = asyncHandler(async (req, res) => {
  const { id, date, slot, doctorId } = req.body;

  if (!slot) {
    return res.status(400).json({ message: 'Time slot to remove is required.' });
  }

  const targetDocId = await resolveDoctorId(req, doctorId);

  let record = null;
  if (id) {
    record = await Availability.findById(id);
  }

  if (!record && date && targetDocId) {
    const day = new Date(date);
    day.setHours(0, 0, 0, 0);
    record = await Availability.findOne({ doctor: targetDocId, date: day });
  }

  if (!record) {
    return res.status(404).json({ message: 'Availability schedule record not found.' });
  }

  const trimmedSlot = String(slot).trim();
  record.slots = record.slots.filter((s) => s.trim() !== trimmedSlot);

  if (record.slots.length === 0) {
    await Availability.findByIdAndDelete(record._id);
    return res.json({ message: 'All slots removed for date.', deleted: true, _id: record._id });
  }

  await record.save();
  res.json({ message: 'Slot removed successfully.', record });
});
