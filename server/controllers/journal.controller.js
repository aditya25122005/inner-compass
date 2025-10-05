import asyncHandler from 'express-async-handler';
import Journal from '../models/journalEntry.model.js';

// @desc    Create a new journal entry
// @route   POST /api/journal
// @access  Private
const createEntry = asyncHandler(async (req, res) => {
  const { text, mood } = req.body;

  if (!text || !mood) {
    res.status(400);
    throw new Error('Please enter both text and select a mood.');
  }

  const userId = req.user._id;


  const sentimentScore = Number((Math.random() * 2 - 1).toFixed(2)); 

  const entry = await Journal.create({
    user: userId,
    text,
    mood,
    analysis: { sentimentScore },
  });

  res.status(201).json({
    message: 'Journal entry successfully saved.',
    entry,
  });
});

// @desc    Get all journal entries for the authenticated user
// @route   GET /api/journal
// @access  Private
const getAllEntries = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const entries = await Journal.find({ user: userId }).sort({ createdAt: -1 });
  res.status(200).json(entries);
});

export { createEntry, getAllEntries };
