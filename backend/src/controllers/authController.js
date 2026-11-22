const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Availability = require('../models/Availability');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'medicare_default_jwt_secret_2026', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user (patient or doctor)
// @route   POST /api/auth/register
// @access  Public
exports.registerPatient = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    phone,
    specialization,
    qualifications,
    experience,
    fee,
    hospital,
    bio,
  } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    return res.status(400).json({ message: 'An account with this email address already exists.' });
  }

  // Do NOT allow public creation of admin accounts
  let assignedRole = 'patient';
  if (role && ['patient', 'doctor'].includes(role)) {
    assignedRole = role;
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    phone: phone ? phone.trim() : '',
    role: assignedRole,
  });

  let doctorRecord = null;

  // If registering as doctor, create the Doctor profile and 7 days initial slots
  if (assignedRole === 'doctor') {
    doctorRecord = await Doctor.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone ? phone.trim() : '',
      user: user._id,
      specialization: specialization || 'General Medicine',
      experience: Number(experience) || 1,
      fee: Number(fee) || 100,
      photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
      qualifications: Array.isArray(qualifications)
        ? qualifications
        : qualifications
        ? qualifications.split(',').map((q) => q.trim())
        : ['MBBS'],
      bio: bio || 'Licensed medical practitioner dedicated to healthcare excellence.',
      hospital: hospital || 'MediCare Multispecialty Hospital',
      status: 'pending', // Starts as pending Admin approval
      rating: 4.9,
      reviewsCount: 1,
    });

    // Create 7 days of default availability
    const today = new Date();
    const defaultSlots = ['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '04:30 PM'];
    const availDocs = [];

    for (let i = 0; i < 7; i++) {
      const slotDate = new Date(today);
      slotDate.setDate(today.getDate() + i);
      slotDate.setHours(0, 0, 0, 0);

      availDocs.push({
        doctor: doctorRecord._id,
        date: slotDate,
        slots: [...defaultSlots],
      });
    }
    await Availability.insertMany(availDocs);
  }

  const token = generateToken(user._id);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    doctorStatus: doctorRecord ? doctorRecord.status : undefined,
    doctorId: doctorRecord ? doctorRecord._id : undefined,
    token,
  });
});

// @desc    Login user & return JWT token
// @route   POST /api/auth/login
// @access  Public
exports.loginPatient = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  let doctorRecord = null;
  if (user.role === 'doctor') {
    doctorRecord = (await Doctor.findOne({ user: user._id })) || (await Doctor.findOne({ email: normalizedEmail }));
  }

  const token = generateToken(user._id);

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    doctorStatus: doctorRecord ? doctorRecord.status : undefined,
    doctorId: doctorRecord ? doctorRecord._id : undefined,
    token,
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getProfile = asyncHandler(async (req, res) => {
  const user = req.user.toObject ? req.user.toObject() : { ...req.user };
  if (user.role === 'doctor') {
    const doctorRecord =
      (await Doctor.findOne({ user: user._id })) || (await Doctor.findOne({ email: user.email }));
    user.doctorProfile = doctorRecord;
  }
  res.json(user);
});
