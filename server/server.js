import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import journalRoutes from './routes/journal.route.js'; 
import resourceRoutes from './routes/resource.route.js';
import taskRoutes from './routes/task.route.js'; 
import dashboardRoutes from './routes/dashboard.route.js';
import Task from './models/Task.model.js';

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Middlewares
app.use(
  cors({
    origin: "*",
    credentials: true, 
  })
);
app.use(express.json()); 
app.use(cookieParser()); 

// Connect Database
connectDB()
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error(" DB Connection Error:", err.message);
    process.exit(1);
  });

// Routes
import authRoutes from "./routes/user.route.js";
import chatbotRoutes from "./routes/chatbot.route.js";

app.use("/api/auth", authRoutes); 
app.use("/api/chatbot", chatbotRoutes); 
app.use('/api/journal', journalRoutes); 
app.use('/api/resources', resourceRoutes); 
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes); 

// Config endpoint for frontend
app.get("/api/config", (req, res) => {
  res.json({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
  });
});

// Default route
app.get("/", (req, res) => {
  res.send(" Server is running...");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});

// Task cleanup scheduler - runs every hour to remove expired tasks
const cleanupExpiredTasks = async () => {
  try {
    const result = await Task.deleteMany({
      expiresAt: { $lt: new Date() }
    });
    if (result.deletedCount > 0) {
      console.log(`🧹 Cleaned up ${result.deletedCount} expired tasks`);
    }
  } catch (error) {
    console.error('Error cleaning up expired tasks:', error);
  }
};

// Run cleanup every hour
setInterval(cleanupExpiredTasks, 60 * 60 * 1000);

// Run cleanup on server start
cleanupExpiredTasks();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
  console.log('⏰ Task auto-generation system active');
  console.log('🧠 AI-powered mental health scoring enabled');
});
