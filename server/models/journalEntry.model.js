import mongoose from "mongoose";

const journalEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mood: {
      type: String,
      enum: ["happy", "sad", "anxious", "calm", "angry", "neutral"],
      required: true,
    },
    text: { type: String, required: true },
    analysis: {
      sentimentScore: Number,
      stressLevel: Number,
      keywords: [String],
    },
    aiReport: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("JournalEntry", journalEntrySchema);
