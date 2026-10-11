import express from "express";
import upload from "../config/multer.js";
import passport from "passport";
import {
    forgetPassword,
  googleAuth,
  loginController,
  logoutController,
  regenratedAccessToken,
  registerUser,
  resendOtp,
  resetPassword,
  verifyOtp,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { forgotPasswordValidator, loginValidator, registerValidator, resendOtpValidator, resetPasswordValidator, verifyOtpValidator } from "../validators/auth.validator.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

router.post("/register", upload.single("image"),registerValidator,validate, registerUser);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  googleAuth,
);
router.post("/login",loginValidator,validate, loginController);
router.post("/logout",authMiddleware, logoutController);
router.post('/forget-password',forgotPasswordValidator, validate, forgetPassword)
router.post('/verify-otp',verifyOtpValidator, validate, verifyOtp)
router.post('/resetPassword',resetPasswordValidator,validate, resetPassword)
router.post("/regenrate-access-token", regenratedAccessToken);
router.post("/resend-otp", resendOtpValidator, validate, resendOtp);
export default router;
