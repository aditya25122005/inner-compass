import { Router } from "express";
import { 
  logout, 
  refreshAccessToken, 
  register, 
  getPhoneEmailConfig,
  sendEmailOTP,
  verifyEmailOTPAndLogin,
  completeRegistration,
  getUserProfile,
  updateUserProfile,
  updateMentalScore
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

// OTP-only authentication
router.post("/register", register);
router.post("/send-otp", sendEmailOTP);
router.post("/verify-otp-login", verifyEmailOTPAndLogin);
router.post("/complete-registration", completeRegistration);

// Token management
router.post("/refresh", refreshAccessToken);
router.post("/logout", protect, logout);

// Configuration
router.get("/phone-email-config", getPhoneEmailConfig);

// User Profile Management
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.put("/mental-score", protect, updateMentalScore);

// Verify token endpoint
router.get("/verify-token", protect, (req, res) => {
  res.json({ valid: true, user: req.user });
});


export default router;
