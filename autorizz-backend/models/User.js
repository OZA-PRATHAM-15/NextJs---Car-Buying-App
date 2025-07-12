const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: { type: String },
  address: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  role: {
    type: String,
    default: "User",
    enum: ["User", "Admin", "Agent"],
  },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiresAt: { type: Date },
  otpAttempts: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", UserSchema);
