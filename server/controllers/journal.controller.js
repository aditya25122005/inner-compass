import asyncHandler from "express-async-handler";
import Journal from "../models/journalEntry.model.js";
import Task from "../models/Task.model.js";
import axios from "axios";

// --------------------------------------------------------
// CREATE JOURNAL ENTRY + ML ANALYSIS + AI TASK GENERATION
// --------------------------------------------------------
export const createEntry = asyncHandler(async (req, res) => {
  const { text, mood } = req.body;

  if (!text || !mood) {
    res.status(400);
    throw new Error("Please enter both text and select a mood.");
  }

  const userId = req.user._id;

  // ---------------------------------------------
  // 1) ML SERVER → ANALYZE JOURNAL
  // ---------------------------------------------
  let sentimentScore = 0;
  let stressLevel = 50;
  let emotion = "neutral";
  let keywords = [];

  try {
    const mlResponse = await axios.post(
      "http://127.0.0.1:5000/analyze",
      { text },
      { timeout: 8000 }
    );

    sentimentScore = mlResponse.data.sentimentScore;
    stressLevel = mlResponse.data.stressLevel;
    emotion = mlResponse.data.emotion;
    keywords = mlResponse.data.keywords;

    console.log("🔥 ML ANALYZE:", mlResponse.data);
  } catch (err) {
    console.error("❌ ML analyze error:", err.message);
  }

  // ---------------------------------------------
  // 2) SAVE JOURNAL ENTRY
  // ---------------------------------------------
  const entry = await Journal.create({
    user: userId,
    text,
    mood,
    analysis: {
      sentimentScore,
      stressLevel,
      emotion,
      keywords,
    },
  });

  // ---------------------------------------------
  // 3) ML SERVER → GENERATE NEW AI TASKS
  // ---------------------------------------------
  let suggestedTasks = [];

  try {
    const taskResponse = await axios.post(
      "http://127.0.0.1:5000/generate-tasks",
      { text },
      { timeout: 8000 }
    );

    suggestedTasks = taskResponse.data.tasks || [];
    console.log("🧠 AI GENERATED TASKS:", suggestedTasks);

    // ---------------------------------------------
    // 4) REMOVE OLD AI TASKS & ADD THE NEW ONES
    // ---------------------------------------------
    await Task.deleteMany({ user: userId, category: "AI" });

    for (let taskText of suggestedTasks) {
      await Task.create({
        user: userId,
        title: taskText,
        category: "AI",
        isCompleted: false,
      });
    }
  } catch (err) {
    console.error("❌ ML task generation error:", err.message);
  }

  res.status(201).json({
    message: "Journal saved + ML analysis done + AI tasks generated",
    entry,
    tasks: suggestedTasks,
  });
});

// --------------------------------------------------------
// OLD API — COMPACT VIEW USES THIS
// --------------------------------------------------------
export const getAllEntries = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const entries = await Journal.find({ user: userId }).sort({ createdAt: -1 });
  res.status(200).json(entries);
});

// --------------------------------------------------------
// JOURNAL HISTORY API — Pagination + Search + Filter
// --------------------------------------------------------
export const getJournalHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const page = parseInt(req.query.page || "1");
  const limit = parseInt(req.query.limit || "8");

  const q = req.query.q || null;
  const mood = req.query.mood || null;
  const dateFrom = req.query.dateFrom || null;
  const dateTo = req.query.dateTo || null;

  const filter = { user: userId };

  // ---------------------------------------------
  // TEXT SEARCH
  // ---------------------------------------------
  if (q) {
    filter.$or = [
      { text: { $regex: q, $options: "i" } },
      { "analysis.keywords": { $regex: q, $options: "i" } },
    ];
  }

  // ---------------------------------------------
  // MOOD FILTER
  // ---------------------------------------------
  if (mood && mood !== "all") {
    filter.mood = mood;
  }

  // ---------------------------------------------
  // DATE RANGE FILTER
  // ---------------------------------------------
  if (dateFrom || dateTo) {
    filter.createdAt = {};
    if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
    if (dateTo) {
      const d = new Date(dateTo);
      d.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = d;
    }
  }

  // ---------------------------------------------
  // PAGINATION LOGIC
  // ---------------------------------------------
  const totalCount = await Journal.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const skip = (page - 1) * limit;

  const entries = await Journal.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  res.status(200).json({
    entries,
    page,
    limit,
    totalPages,
    totalCount,
  });
});
