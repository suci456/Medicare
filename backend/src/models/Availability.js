const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: Date, required: true },
  slots: [{ type: String, required: true }], // e.g., "09:00", "09:30"
}, { timestamps: true });

module.exports = mongoose.model('Availability', availabilitySchema);
