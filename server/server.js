require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors'); 

const app = express();
const port = process.env.PORT || 5000;

// connect to database
connectDB();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// import routes
const journalRoutes = require('./routes/journalRoutes');
const authRoutes = require('./routes/authRoutes');

// use routes
app.use('/api/journal', journalRoutes);
app.use('/api/auth', authRoutes);

// test route
app.get('/', (req, res) => {
    res.send("Server Running");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`); 
});