// src/models/Group.js
const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['program', 'department', 'custom'],
    default: 'custom',
  },
  scope: {
    type: String,
    enum: ['company', 'department', 'private'],
    default: 'company',
  },
  createdBy: { type: String, required: true }, // userId
  admins: [String], // userIds
  members: [String], // userIds
  isArchived: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Group', GroupSchema);
