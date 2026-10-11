
import { body, param } from "express-validator";
import mongoose from "mongoose";

// ==========================================
// CREATE MESSAGE VALIDATOR
// ==========================================

export const createMessageValidator = [
  param("channelId")
    .notEmpty()
    .withMessage("Channel ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid channel ID");
      }

      return true;
    }),

  body("content")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Message content cannot exceed 2000 characters"),
];


// ==========================================
// GET ALL MESSAGE VALIDATOR
// ==========================================

export const getAllMessageValidator = [
  param("channelId")
    .notEmpty()
    .withMessage("Channel ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid channel ID");
      }

      return true;
    }),
];


// ==========================================
// GET ALL CHANNEL MESSAGE VALIDATOR
// ==========================================

export const getAllChannelMessageValidator = [
  param("channelId")
    .notEmpty()
    .withMessage("Channel ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid channel ID");
      }

      return true;
    }),
];


// ==========================================
// UPDATE MESSAGE VALIDATOR
// ==========================================

export const updateMessageValidator = [
  param("messageId")
    .notEmpty()
    .withMessage("Message ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid message ID");
      }

      return true;
    }),

  body("content")
    .notEmpty()
    .withMessage("Message content is required")
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage(
      "Message content must be between 1 and 2000 characters"
    ),
];


// ==========================================
// DELETE MESSAGE VALIDATOR
// ==========================================

export const deleteMessageValidator = [
  param("messageId")
    .notEmpty()
    .withMessage("Message ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid message ID");
      }

      return true;
    }),
];

