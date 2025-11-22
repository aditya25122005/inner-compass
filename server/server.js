import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import path from "path";

// Load env
dotenv.config();
import "./services/geminiService.js";
import axios from "axios";
// Initialize app
const app = express();

// -----------------------------
// CORS CONFIG (Express v5 safe)
// -----------------------------
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ⭐ HANDLE PRE-FLIGHT (MUST BE REGEX IN EXPRESS v5)
app.options(/.*/, (req, res) => {
  res.header("Access-Control-Allow-Origin", process.env.CORS_ORIGIN);
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res.sendStatus(200);
});

// -----------------------------
// Middlewares
// -----------------------------
app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// Serve uploaded images
app.use("/uploads", express.static("uploads"));



// -----------------------------
// Connect Database
// -----------------------------
connectDB()
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("DB Connection Error:", err.message);
    process.exit(1);
  });

// -----------------------------
// Import Routes
// -----------------------------
import authRoutes from "./routes/user.route.js";
import chatbotRoutes from "./routes/chatbot.route.js";
import journalRoutes from "./routes/journal.route.js";
import resourceRoutes from "./routes/resource.route.js";
import taskRoutes from "./routes/task.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";

// -----------------------------
// Route Middleware
// -----------------------------
app.use("/api/auth", authRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

// -----------------------------
// Default Route
// -----------------------------
app.get("/", (req, res) => {
  res.send("Server is running...");
});



// Check

app.get("/google-models", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({
      error: err.response?.data || err.message
    });
  }
});

// -----------------------------
// Global Error Handler
// -----------------------------
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});

// -----------------------------
// Start Server
// -----------------------------
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
