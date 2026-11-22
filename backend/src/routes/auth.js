const express = require('express');
const router = express.Router();
const { registerPatient, loginPatient, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// @route POST /api/auth/register
router.post('/register', registerPatient);

// @route POST /api/auth/login
router.post('/login', loginPatient);

// @route GET /api/auth/me (protected)
router.get('/me', protect, getProfile);

module.exports = router;
