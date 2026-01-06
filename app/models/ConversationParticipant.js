const mongoose = require("mongoose");

const ConversationParticipantSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["owner", "admin", "member"],
      default: "member",
    },

    joinedAt: { type: Date, default: Date.now },

    isMuted: { type: Boolean, default: false },
    isRemoved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ConversationParticipantSchema.index(
  { conversationId: 1, userId: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "ConversationParticipant",
  ConversationParticipantSchema
);
