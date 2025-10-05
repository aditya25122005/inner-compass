import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import journalRoutes from './routes/journal.route.js'; 
import resourceRoutes from './routes/resource.route.js';
import taskRoutes from './routes/task.route.js'; 
import dashboardRoutes from './routes/dashboard.route.js'; 

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // your frontend URL (e.g. http://localhost:3000)
    credentials: true, // allow cookies & auth headers
  })
);
app.use(express.json()); // parse JSON body
app.use(cookieParser()); // parse cookies

// Connect Database
connectDB()
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ DB Connection Error:", err.message);
    process.exit(1);
  });

// Routes
import authRoutes from "./routes/user.route.js";
import chatbotRoutes from "./routes/chatbot.route.js";

app.use("/api/auth", authRoutes); // localhost:(5000 OR 8000)/api/auth/... ( register, login, logout, refresh-token, etc.)
app.use("/api/chatbot", chatbotRoutes); // localhost:(5000 OR 8000)/api/chatbot/... ( chat, history, mood-analysis, etc.)
app.use('/api/journal', journalRoutes); 
app.use('/api/resources', resourceRoutes); 
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes); 

// Default route
app.get("/", (req, res) => {
  res.send("🚀 Server is running...");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
