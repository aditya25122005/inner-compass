const mongoose= require('mongoose');

const JournalEntrySchema= new mongoose.Schema({
    content:{
        type:String,
        required:true,
    },
    mood: { 
    type: String,
    required: true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    
    //user_id
});
const JournalEntry= mongoose.model('JournalEntry',JournalEntrySchema);
module.exports= JournalEntry;