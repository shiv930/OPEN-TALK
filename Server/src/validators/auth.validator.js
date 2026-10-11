import { body } from "express-validator";

// Register
export const registerValidator = [
    body("username")
    .trim()
    .notEmpty()
    .withMessage("username is required")
    .isLength({min:3,max:20})
    .withMessage("username must be between 3 and 20 charcters"),

    body("email")
        .trim()
        .normalizeEmail()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email"),

    body("password")    
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    body("fullname")
        .notEmpty()
        .withMessage("Full name is required"),
];


// Login
export const loginValidator = [
    body("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("Please provide a valid email"),
    body("password")
        .isString()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
];


// Forgot Password
export const forgotPasswordValidator = [
   body("email").trim().normalizeEmail().isEmail().withMessage("Please provide a valid email"),
];


// Verify OTP
export const verifyOtpValidator = [
    body("email").trim().normalizeEmail().isEmail().withMessage("Please provide a valid email"),
    body("otp").isLength({ min: 4, max: 8 }).withMessage("OTP is invalid"),
];


// Reset Password
export const resetPasswordValidator = [
    body("email").trim().normalizeEmail().isEmail().withMessage("Please provide a valid email"),
    body("resetToken").trim().notEmpty().withMessage("Reset token is required"),
    body("newPassword").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];


// Resend OTP
export const resendOtpValidator = [
    body("email")
        .trim()
        .normalizeEmail()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email"),
];


// Change Password
export const changePasswordValidator = [
    body("password")
        .notEmpty()
        .withMessage("Current password is required"),

    body("newPassword")
        .notEmpty()
        .withMessage("New password is required")
        .isLength({ min: 6 })
        .withMessage("New password must be at least 6 characters"),
];