const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    roles: {
      type: [String],
      enum: ['driver', 'rider'],
      default: ['rider'],
    },
    totalEarnings: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model('User', userSchema);
