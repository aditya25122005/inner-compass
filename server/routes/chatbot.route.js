import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { ChatMessage } from '../models/chatBot.model.js';
import geminiService from '../services/geminiService.js';
import mongoose from 'mongoose';

const router = express.Router();

// All chatbot routes require authentication (temporarily disabled for testing)
// router.use(verifyJWT);

// Send a message to the chatbot
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    // Use a default user ID for testing without authentication
    const userId = req.user?._id || new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Get recent conversation history for context
    const recentMessages = await ChatMessage
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Reverse to get chronological order
    const context = recentMessages.reverse();

    // Save user message
    const userMessage = new ChatMessage({
      userId,
      sender: 'user',
      message: message.trim()
    });
    await userMessage.save();

    // Generate bot response using Gemini
    console.log(`🤖 Generating response for ${req.user?.email || 'test user'}...`);
    const botResponse = await geminiService.generateResponse(message, context);

    // Save bot message
    const botMessage = new ChatMessage({
      userId,
      sender: 'bot',
      message: botResponse
    });
    await botMessage.save();

    res.json({
      success: true,
      data: {
        userMessage: {
          id: userMessage._id,
          message: userMessage.message,
          sender: userMessage.sender,
          createdAt: userMessage.createdAt
        },
        botMessage: {
          id: botMessage._id,
          message: botMessage.message,
          sender: botMessage.sender,
          createdAt: botMessage.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Error in chatbot conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process chat message',
      error: error.message
    });
  }
});

// Get conversation history
router.get('/history', async (req, res) => {
  try {
    const userId = req.user?._id || new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await ChatMessage
      .find({ userId })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .select('message sender createdAt')
      .lean();

    const totalMessages = await ChatMessage.countDocuments({ userId });
    const totalPages = Math.ceil(totalMessages / limit);

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          currentPage: page,
          totalPages,
          totalMessages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat history',
      error: error.message
    });
  }
});

// Clear conversation history
router.delete('/history', async (req, res) => {
  try {
    const userId = req.user?._id || new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');
    
    const result = await ChatMessage.deleteMany({ userId });
    
    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} messages`,
      data: {
        deletedCount: result.deletedCount
      }
    });

  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear chat history',
      error: error.message
    });
  }
});

// Analyze mood from a message
router.post('/analyze-mood', async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user?._id || new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message is required for mood analysis'
      });
    }

    // Get recent conversation history for context
    const recentMessages = await ChatMessage
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const moodAnalysis = await geminiService.analyzeMood(message, recentMessages.reverse());

    res.json({
      success: true,
      data: {
        message,
        analysis: moodAnalysis,
        analyzedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Error analyzing mood:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze mood',
      error: error.message
    });
  }
});

// Generate journal prompt
router.get('/journal-prompt', async (req, res) => {
  try {
    const topic = req.query.topic;
    
    const journalPrompt = await geminiService.generateJournalPrompt(topic);

    res.json({
      success: true,
      data: {
        prompt: journalPrompt,
        topic: topic || 'general',
        generatedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Error generating journal prompt:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate journal prompt',
      error: error.message
    });
  }
});

// Health check for chatbot service
router.get('/health', async (req, res) => {
  try {
    const healthCheck = await geminiService.testConnection();
    
    res.json({
      success: true,
      data: {
        service: 'InnerCompass Chatbot',
        status: healthCheck.success ? 'healthy' : 'unhealthy',
        geminiApi: healthCheck.success ? 'connected' : 'error',
        error: healthCheck.error || null,
        timestamp: new Date()
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message
    });
  }
});

// Get chatbot statistics for the user
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user?._id || new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');
    
    const totalMessages = await ChatMessage.countDocuments({ userId });
    const userMessages = await ChatMessage.countDocuments({ userId, sender: 'user' });
    const botMessages = await ChatMessage.countDocuments({ userId, sender: 'bot' });
    
    // Get first and last message dates
    const firstMessage = await ChatMessage.findOne({ userId }).sort({ createdAt: 1 }).select('createdAt');
    const lastMessage = await ChatMessage.findOne({ userId }).sort({ createdAt: -1 }).select('createdAt');

    // Get messages from the last 7 days
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentMessages = await ChatMessage.countDocuments({ 
      userId, 
      createdAt: { $gte: weekAgo } 
    });

    res.json({
      success: true,
      data: {
        totalMessages,
        userMessages,
        botMessages,
        recentMessages: recentMessages,
        firstMessageDate: firstMessage?.createdAt || null,
        lastMessageDate: lastMessage?.createdAt || null,
        averageMessagesPerDay: firstMessage ? 
          totalMessages / Math.max(1, Math.ceil((new Date() - firstMessage.createdAt) / (1000 * 60 * 60 * 24))) : 0
      }
    });

  } catch (error) {
    console.error('Error fetching chatbot stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chatbot statistics',
      error: error.message
    });
  }
});

export default router;
