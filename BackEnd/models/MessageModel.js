const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation", // optional for future group chat
      default: null
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    message: {
      type: String,
      trim: true
    },

    messageType: {
      type: String,
      enum: ["text", "image", "file", "audio", "video"],
      default: "text"
    },

    mediaUrl: {
      type: String,
      default: null
    },

    status: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent"
    },

    isEdited: {
      type: Boolean,
      default: false
    },

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

/* Performance index for fast 2-user chat lookup */
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);