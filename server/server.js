require('dotenv').config();
const express= require('express');
const connectDB= require('./config/db');// connectDB function imported
const cors = require('cors'); 
const app= express();
const port=process.env.PORT || 5000;

// connect to database
connectDB();

//middleware for parsing json
app.use(express.json());
app.use(cors()); 
// import route
const journalRoutes= require('./routes/journalRoutes');


// use routes
app.use('/api/journal',journalRoutes);

app.get('/',(req,res)=>{
    res.send("Server Running");
});

app.listen(port,()=>{
    console.log(`Server is running on port${port}`);
});