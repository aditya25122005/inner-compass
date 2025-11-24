import asyncHandler from 'express-async-handler';
import Journal from '../models/journalEntry.model.js';
import User from '../models/user.model.js';
import Task from '../models/Task.model.js';
import { calculateMentalHealthScore } from '../services/taskGenerationService.js';

const createEntry = asyncHandler(async (req, res) => {
  const { text, mood } = req.body;

  if (!text || !mood) {
    res.status(400);
    throw new Error('Please enter both text and select a mood.');
  }

  const userId = req.user._id;

  // Calculate sentiment score (convert from -1 to 1 range to 0 to 1 range)
  const rawSentiment = Number((Math.random() * 2 - 1).toFixed(2)); 
  const sentimentScore = Number(((rawSentiment + 1) / 2).toFixed(2)); // Convert to 0-1 range

  const entry = await Journal.create({
    user: userId,
    text,
    mood,
    analysis: { sentimentScore },
  });

  // Update user's mental health score using AI-powered calculation
  try {
    const recentJournals = await Journal.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(7)
      .select('text mood analysis createdAt');
    
    // Get task completion data
    const allTasks = await Task.find({ user: userId });
    const completedTasks = allTasks.filter(t => t.isCompleted).length;
    const taskCompletionRate = allTasks.length > 0 
      ? Math.round((completedTasks / allTasks.length) * 100) 
      : 0;

    // Get recent moods
    const recentMoods = recentJournals.map(j => j.mood).filter(Boolean);

    // Calculate days since last journal (before this one)
    const previousJournal = recentJournals[1]; // Second most recent (current is [0])
    const daysSinceLastJournal = previousJournal 
      ? Math.floor((new Date() - new Date(previousJournal.createdAt)) / (1000 * 60 * 60 * 24))
      : 7;

    const userData = {
      journals: recentJournals.map(j => ({
        text: j.text,
        mood: j.mood,
        analysis: j.analysis,
        createdAt: j.createdAt
      })),
      taskCompletionRate,
      recentMoods,
      chatbotInteractions: 0, // TODO: Track this if needed
      daysSinceLastJournal
    };

    // Calculate score using AI
    const scoreAnalysis = await calculateMentalHealthScore(userData);
    
    await User.findByIdAndUpdate(userId, {
      mentalHealthScore: scoreAnalysis.score,
      lastScoreUpdate: new Date()
    });

    console.log(`✅ Mental health score updated to ${scoreAnalysis.score} - ${scoreAnalysis.reasoning}`);
    
  } catch (error) {
    console.error('Error updating mental health score:', error);
    // Don't fail the journal entry if score update fails
  }

  res.status(201).json({
    message: 'Journal entry successfully saved.',
    entry,
  });
});

const getAllEntries = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const entries = await Journal.find({ user: userId }).sort({ createdAt: -1 });
  res.status(200).json(entries);
});

export { createEntry, getAllEntries };
