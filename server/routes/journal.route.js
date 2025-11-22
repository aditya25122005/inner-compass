import express from 'express';
import { createEntry, getAllEntries, getJournalHistory  } from '../controllers/journal.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Route: POST /api/journal (Requires token)
router.post('/', protect, createEntry);


// Route: GET /api/journal (Requires token)
router.get('/', protect, getAllEntries);


router.get("/history", protect, getJournalHistory);

export default router;