const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    passwordHash: { type: String, default: null },

    otpHash: { type: String, default: null },
    otpExpiresAt: { type: Date, default: null },
    otpVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model('User', UserSchema);
