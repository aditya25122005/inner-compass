const JournalEntry= require('../models/JournalEntry');

const createJournalEntry= async(req,res)=>{
    try{
        const{content}= req.body;
        if(!content){
            return res.status(400).json({msg:'Please enter some content'});
        }

        const newEntry= new JournalEntry({content});
        await newEntry.save();
        res.status(201).json({msg:'Journal entry saved successfully',data:newEntry})
        // data object contains info added by mongoDB along with the content
    }
    catch(e){
        console.log(e.message);
        res.status(500).send('Server-Error')
    }
}

module.exports={createJournalEntry};