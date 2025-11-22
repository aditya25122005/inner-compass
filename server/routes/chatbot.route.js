import express from "express";
import { ChatMessage } from "../models/chatBot.model.js";
import geminiService from "../services/geminiService.js";
import { protect } from "../middlewares/auth.middleware.js";
const router = express.Router();
router.use(protect);

// TEMPORARY FIX — always give a valid ObjectId
// router.use((req, res, next) => {
//   req.user = { _id: "676f1b2e12ab34cd56ef7890" }; 
//   next();
// });

// HEALTH CHECK
router.get("/health", (req, res) => {
  res.json({ success: true, data: "Chatbot service is healthy" });
});

// CHAT STATISTICS
// CHAT STATISTICS
router.get("/stats", async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all messages of this user
    const messages = await ChatMessage.find({ userId }).sort({ createdAt: 1 });

    const totalMessages = messages.length;
    const userMessages = messages.filter(m => m.sender === "user").length;
    const botMessages = messages.filter(m => m.sender === "bot").length;

    let firstMessageDate = null;
    let lastMessageDate = null;
    let daysActive = 0;
    let avgMessagesPerDay = 0;

    if (messages.length > 0) {
      firstMessageDate = messages[0].createdAt;
      lastMessageDate = messages[messages.length - 1].createdAt;

      const diffMs = Math.abs(lastMessageDate - firstMessageDate);
      daysActive = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

      avgMessagesPerDay = (totalMessages / daysActive).toFixed(1);
    }

    // Recent 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentMessages = await ChatMessage.countDocuments({
      userId,
      createdAt: { $gte: sevenDaysAgo }
    });

    return res.json({
      success: true,
      data: {
    totalMessages,
    userMessages,
    botMessages,
    firstMessageDate,
    lastMessageDate,
    daysActive,
    averageMessagesPerDay: Number(avgMessagesPerDay),
    recentMessages
}

    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to get stats",
      error: err.message,
    });
  }
});


// SEND MESSAGE
router.post("/chat", async (req, res) => {
  try {
    const userId = req.user._id;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message required" });
    }

    const history = await ChatMessage.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const formattedHistory = history.reverse();

    const userMsg = await ChatMessage.create({
      userId,
      sender: "user",
      message,
    });

    const botText = await geminiService.generateResponse(message, formattedHistory);

    const botMsg = await ChatMessage.create({
      userId,
      sender: "bot",
      message: botText,
    });

    res.json({
      success: true,
      data: {
        userMessage: userMsg,
        botMessage: botMsg,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Chat processing failed",
      error: err.message,
    });
  }
});

// MOOD ANALYSIS
router.post("/analyze-mood", async (req, res) => {
  try {
    const userId = req.user._id;
    const { message } = req.body;

    const history = await ChatMessage.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const result = await geminiService.analyzeMood(message, history.reverse());
  console.log("MOOD RAW RESULT:", result);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Mood analysis failed",
    });
  }
});

// JOURNAL PROMPT
router.get("/journal-prompt", async (req, res) => {
  try {
    const topic = req.query.topic || null;
    const json = await geminiService.generateJournalPrompt(topic);

    res.json({ success: true, data: json });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Prompt error",
      error: err.message
    });
  }
});


// HISTORY  (THIS WAS THE ROUTE BREAKING)
router.get("/history", async (req, res) => {
  try {
    const userId = req.user._id;
    const messages = await ChatMessage.find({ userId }).sort({ createdAt: 1 });

    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "History error",
    });
  }
});

// CLEAR HISTORY
router.delete("/history", async (req, res) => {
  try {
    const userId = req.user._id;
    await ChatMessage.deleteMany({ userId });

    res.json({ success: true, message: "Chat cleared" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Clear error",
    });
  }
});

export default router;
