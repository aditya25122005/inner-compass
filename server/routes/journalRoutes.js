const express= require('express');
const router= express.Router();
const{createJournalEntry, getAllJournalEntries}= require('../controllers/journalController');

router.post('/',createJournalEntry);


// GET all journal entries
router.get('/', getAllJournalEntries);

module.exports= router;