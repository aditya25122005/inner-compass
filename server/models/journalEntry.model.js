import mongoose from "mongoose";

const journalEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mood: {
      type: String,
      enum: ["Happy", "Sad", "Anxious", "Calm", "Angry", "neutral"],
      required: true,
    },
    content: { type: String, required: true }, // The journal text
    analysis: {
      sentimentScore: String, // e.g., from -1 (negative) to 1 (positive)
      stressLevel: String, // e.g., from 0 (low) to 1 (high)
      keywords: [String],
    },
    aiReport : {type: String}
  },
  { timestamps: true }
);
