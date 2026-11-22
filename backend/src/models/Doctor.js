const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, default: '' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    fee: { type: Number, required: true },
    photoUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
    },
    qualifications: { type: [String], default: [] },
    bio: { type: String, default: 'Experienced and dedicated medical healthcare specialist.' },
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: Number, default: 45 },
    hospital: { type: String, default: 'MediCare Multispecialty Hospital' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'blocked'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
