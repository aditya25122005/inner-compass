const mongoose= require('mongoose');

const JournalEntrySchema= new mongoose.Schema({
    content:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    //mood_score
    //user_id
});
const JournalEntry= mongoose.model('JournalEntry',JournalEntrySchema);
module.exports= JournalEntry;