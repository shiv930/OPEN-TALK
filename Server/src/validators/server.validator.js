import { body, param } from "express-validator";

// Create Server
export const createServerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Server name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Server name must be between 3 and 50 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Description must be less than 200 characters"),

  
];

// Update Server
export const updateServerValidator = [

  param("serverId")
    .notEmpty()
    .withMessage("Server ID is required")
    .isMongoId()
    .withMessage("Invalid server ID"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Server name must be between 3 and 50 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Description must be less than 200 characters"),

  body("isPublic")
    .optional()
    .isBoolean()
    .withMessage("isPublic must be true or false"),
];

// Join Server
export const joinServerValidator = [
  param("inviteCode")
    .notEmpty()
    .withMessage("Invite code is required"),
];

// Leave Server
export const leaveServerValidator = [
  param("serverId")
    .notEmpty()
    .withMessage("Server ID is required")
    .isMongoId()
    .withMessage("Invalid server ID"),
];

// Delete Server
export const deleteServerValidator = [
  param("serverId")
    .notEmpty()
    .withMessage("Server ID is required")
    .isMongoId()
    .withMessage("Invalid server ID"),
];
