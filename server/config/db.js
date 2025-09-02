const mongoose= require('mongoose');

// handle database connection process
const connectDB= async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected Successfully');
        
    }
    catch(e){
        console.log(e.message);
        process.exit(1);
        
    }
}

module.exports= connectDB;
// call this function from server.js