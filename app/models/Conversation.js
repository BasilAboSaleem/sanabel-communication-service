const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["direct", "group"],
      required: true,
    },

    title: { type: String }, // only for groups
    participants: [{
  userId: String,
  chatRole: String,
}],

scope: {
  type: String,
  enum: ["Global", "Department", "Program", "Project", "Personal"],
},

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
