const asyncHandler = require('express-async-handler');
const Doctor = require('../models/Doctor');
const Availability = require('../models/Availability');

// Helper to seed 7 days of default availability
const seedDoctorAvailability = async (doctorId) => {
  const existingCount = await Availability.countDocuments({ doctor: doctorId });
  if (existingCount > 0) return;

  const today = new Date();
  const defaultSlots = ['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '04:30 PM'];
  const availDocs = [];

  for (let i = 0; i < 7; i++) {
    const slotDate = new Date(today);
    slotDate.setDate(today.getDate() + i);
    slotDate.setHours(0, 0, 0, 0);

    availDocs.push({
      doctor: doctorId,
      date: slotDate,
      slots: [...defaultSlots],
    });
  }
  await Availability.insertMany(availDocs);
};

// @desc    Get all doctors (approved only for public, all for admin if requested)
// @route   GET /api/doctors
// @access  Public
exports.getAllDoctors = asyncHandler(async (req, res) => {
  const { name, specialization, department, maxFee, search, includeAll } = req.query;
  const filter = {};

  // For public patients, show only approved doctors (or doctors with no status set yet for legacy)
  if (includeAll !== 'true') {
    filter.$or = [{ status: 'approved' }, { status: { $exists: false } }];
  }

  if (name || search) {
    const term = name || search;
    const searchFilter = [
      { name: { $regex: term, $options: 'i' } },
      { specialization: { $regex: term, $options: 'i' } },
      { bio: { $regex: term, $options: 'i' } },
    ];
    if (filter.$or) {
      filter.$and = [{ $or: filter.$or }, { $or: searchFilter }];
      delete filter.$or;
    } else {
      filter.$or = searchFilter;
    }
  }

  const spec = specialization || department;
  if (spec && spec !== 'All' && spec !== 'all') {
    filter.specialization = { $regex: spec, $options: 'i' };
  }

  if (maxFee) {
    filter.fee = { $lte: Number(maxFee) };
  }

  const doctors = await Doctor.find(filter)
    .populate('user', 'email name')
    .sort({ rating: -1, experience: -1 });

  res.json(doctors);
});

// @desc    Get unique list of departments / specializations (from approved doctors)
// @route   GET /api/doctors/departments
// @access  Public
exports.getDepartments = asyncHandler(async (req, res) => {
  const departments = await Doctor.distinct('specialization', {
    $or: [{ status: 'approved' }, { status: { $exists: false } }],
  });
  res.json(departments);
});

// @desc    Get a single doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
exports.getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).populate('user', 'name email phone');
  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found.' });
  }
  res.json(doctor);
});

// @desc    Get logged-in doctor profile
// @route   GET /api/doctors/me/profile
// @access  Private (doctor)
exports.getMyDoctorProfile = asyncHandler(async (req, res) => {
  let doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) {
    doctor = await Doctor.findOne({ email: req.user.email }) || await Doctor.findOne({ name: req.user.name });
  }

  if (!doctor) {
    return res.status(404).json({ message: 'Doctor profile not found for current user.' });
  }

  res.json(doctor);
});

// @desc    Update logged-in doctor profile
// @route   PUT /api/doctors/me/profile
// @access  Private (doctor)
exports.updateMyDoctorProfile = asyncHandler(async (req, res) => {
  let doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) {
    doctor = await Doctor.findOne({ email: req.user.email }) || await Doctor.findOne({ name: req.user.name });
  }

  if (!doctor) {
    return res.status(404).json({ message: 'Doctor profile not found.' });
  }

  const { fee, phone, bio, hospital, qualifications, experience } = req.body;
  if (fee) doctor.fee = Number(fee);
  if (phone) doctor.phone = phone.trim();
  if (bio) doctor.bio = bio;
  if (hospital) doctor.hospital = hospital;
  if (experience) doctor.experience = Number(experience);
  if (qualifications) {
    doctor.qualifications = Array.isArray(qualifications)
      ? qualifications
      : qualifications.split(',').map((q) => q.trim());
  }

  await doctor.save();
  res.json(doctor);
});

// @desc    Create a new doctor (admin only - automatically approved + creates User login)
// @route   POST /api/doctors
// @access  Private/Admin
exports.createDoctor = asyncHandler(async (req, res) => {
  const { name, email, password, phone, specialization, experience, fee, photoUrl, qualifications, bio, hospital } = req.body;

  if (!name || !specialization || !experience || !fee) {
    return res.status(400).json({ message: 'Name, specialization, experience, and fee are required.' });
  }

  const User = require('../models/User');
  let linkedUserId = null;
  const docEmail = email ? email.toLowerCase().trim() : '';

  // If email is provided, automatically create or link the Doctor's User login account
  if (docEmail) {
    let existingUser = await User.findOne({ email: docEmail });
    if (!existingUser) {
      existingUser = await User.create({
        name: name.trim(),
        email: docEmail,
        password: password || 'doctor123',
        phone: phone ? phone.trim() : '',
        role: 'doctor',
      });
      console.log(`👤 Created doctor login credentials: ${docEmail} / ${password || 'doctor123'}`);
    } else {
      existingUser.role = 'doctor';
      if (password) {
        existingUser.password = password;
      }
      await existingUser.save();
    }
    linkedUserId = existingUser._id;
  }

  const doctor = await Doctor.create({
    name,
    email: docEmail,
    phone: phone || '',
    user: linkedUserId,
    specialization,
    experience: Number(experience),
    fee: Number(fee),
    photoUrl: photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
    qualifications: Array.isArray(qualifications)
      ? qualifications
      : qualifications
      ? qualifications.split(',').map((q) => q.trim())
      : ['MBBS'],
    bio: bio || 'Qualified specialist dedicated to excellence in patient care.',
    hospital: hospital || 'MediCare Multispecialty Hospital',
    status: 'approved',
    rating: 4.9,
    reviewsCount: 1,
  });

  await seedDoctorAvailability(doctor._id);

  res.status(201).json(doctor);
});

// @desc    Update doctor status (admin only - approve, reject, block)
// @route   PUT /api/doctors/:id/status
// @access  Private/Admin
exports.updateDoctorStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ['pending', 'approved', 'rejected', 'blocked'];

  if (!allowed.includes(status)) {
    return res.status(400).json({ message: `Invalid status. Must be one of: ${allowed.join(', ')}` });
  }

  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found.' });
  }

  doctor.status = status;
  await doctor.save();

  // If approved, ensure they have availability slots ready for patients
  if (status === 'approved') {
    await seedDoctorAvailability(doctor._id);
  }

  res.json(doctor);
});

// @desc    Update doctor details (admin only)
// @route   PUT /api/doctors/:id
// @access  Private/Admin
exports.updateDoctor = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  if (typeof updates.qualifications === 'string') {
    updates.qualifications = updates.qualifications.split(',').map((q) => q.trim());
  }

  const doctor = await Doctor.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found.' });
  }

  res.json(doctor);
});

// @desc    Delete a doctor (admin only)
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
exports.deleteDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findByIdAndDelete(req.params.id);
  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found.' });
  }

  await Availability.deleteMany({ doctor: req.params.id });
  res.json({ message: 'Doctor and their availability schedule removed.' });
});
