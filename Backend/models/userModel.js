const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other', ''] },
  address: { type: String },
  bloodGroup: { type: String },
  allergies: { type: String },
  emergencyContact: { type: String },
  emergencyContactName: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);