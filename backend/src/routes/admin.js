const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getAdminStats, getAllUsers, deleteUser } = require('../controllers/adminController');

// All routes require Admin authorization
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;
