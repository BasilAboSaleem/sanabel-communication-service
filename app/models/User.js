const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true }, // from core system
    name: { type: String, required: true },

    systemRole: { type: String, required: true },
    chatRole: { type: String, required: true },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
