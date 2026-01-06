// ===========================
// User Shadow Model
// ===========================

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true }, // من HR System
    name: { type: String, required: true },
    role: { type: String, required: true }, // HR System role
    chatRole: { type: String, required: true }, // Chat service role
    companyId: { type: String },
    department: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
