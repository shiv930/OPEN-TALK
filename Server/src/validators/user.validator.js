import { body, param } from "express-validator";

// Get User Profile (by username)
export const getUserProfileValidator = [
  param("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
];

// Update Profile
export const updateProfileValidator = [
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 32 })
    .withMessage("Username must be between 3 and 32 characters"),

  body("fullname")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Full name must be between 2 and 50 characters"),

  body("mobile_no")
    .optional({ checkFalsy: true })
    .isMobilePhone()
    .withMessage("Please provide a valid mobile number"),

  body("dob")
    .optional()
    .isISO8601()
    .withMessage("Date of birth must be a valid date"),

  body("bio")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Bio must be less than 200 characters"),
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

// Update Profile Picture
export const updateProfilePictureValidator = [
  body("file")
    .custom((value, { req }) => {
      if (!req.file) {
        throw new Error("Profile picture file is required");
      }
      return true;
    }),
];

// Delete Account
export const deleteAccountValidator = [
  param("id")
    .optional() // usually req.user.id se delete hota hai, param optional hai
    .isMongoId()
    .withMessage("Invalid user ID"),
];
