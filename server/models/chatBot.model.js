import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sender: { type: String, enum: ["user", "bot"], required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);