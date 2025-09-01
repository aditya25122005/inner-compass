const express= require('express');
const router= express.Router();
const{createJournalEntry}= require('../controllers/journalController');

router.post('/',createJournalEntry);

module.exports= router;