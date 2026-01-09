const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true }, // from core system
    name: { type: String, required: true },
    systemRole: { type: String, required: true },
    chatRole: { type: String, required: true },
    scope: { type: String, required: true },
    department: { type: String },
    lastseen: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
