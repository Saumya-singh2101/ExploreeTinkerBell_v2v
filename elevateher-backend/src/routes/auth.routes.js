const express = require("express");
const {
  signup,
  login,
  completeOnboarding,
  getMe,
  refresh,
  logout,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");
const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.patch("/onboarding", requireAuth, completeOnboarding);
router.get("/me", requireAuth, getMe);

module.exports = router;
