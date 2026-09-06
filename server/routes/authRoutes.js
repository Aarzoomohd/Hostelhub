import express from "express";

import {
  registerOwner,
  loginOwner,
  sendVerificationOtp,
  verifyEmailOtp,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerOwner);

router.post("/login", loginOwner);

router.post("/send-otp", sendVerificationOtp);

router.post("/verify-otp", verifyEmailOtp);

router.post("/forgot-password/send-otp",sendForgotPasswordOtp);

router.post( "/forgot-password/verify-otp", verifyForgotPasswordOtp);

router.post(  "/forgot-password/reset", resetPassword);

export default router;