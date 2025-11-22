import { Router } from "express";
import multer from "multer";
import {
  login,
  logout,
  refreshAccessToken,
  register,
  updateProfile,
  uploadProfileImage,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

// -----------------------
// Multer Config
// -----------------------
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// -----------------------
// Auth Routes
// -----------------------
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshAccessToken);
router.post("/logout", protect, logout);

// -----------------------
// Profile Update Routes
// -----------------------
router.put("/profile", protect, updateProfile);

// Image Upload Route (IMPORTANT)
router.post(
  "/profile/image",
  protect,
  upload.single("profileImage"),
  uploadProfileImage
);

// -----------------------
// Protected Profile Test Route
// -----------------------
router.get("/profile", protect, (req, res) => {
  res.json({ message: "This is your profile", user: req.user });
});

export default router;
