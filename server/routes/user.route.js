import { Router } from "express";
import { login, logout, refreshAccessToken, register } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshAccessToken);
router.post("/logout", verifyJWT, logout);

// Protected route
router.get("/profile", verifyJWT, (req, res) => {
  res.json({ message: "This is your profile", user: req.user });
});


export default router;
