import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createMessageValidator,
  deleteMessageValidator,
  getAllChannelMessageValidator,
  getAllMessageValidator,
  updateMessageValidator,
} from "../validators/message.validator.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createMessage,
  deleteMessage,
  getAllChannelMessage,
  getAllMessage,
  updateMessage,
} from "../controllers/message.controller.js";
import upload from "../config/multer.js";

const router = express.Router();

router.post(
  "/create-message/:channelId",
  authMiddleware,
  upload.array("files", 5),
  createMessageValidator,
  validate,
  createMessage,
);

router.get(
  "/get-all-message/:channelId",
  authMiddleware,
  getAllMessageValidator,
  validate,
  getAllMessage,
);

router.get(
  "/get-all-channel-message/:channelId",
  authMiddleware,
  getAllChannelMessageValidator,
  validate,
  getAllChannelMessage,
);

router.patch(
  "/update-message/:messageId",
  authMiddleware,
  updateMessageValidator,
  validate,
  updateMessage,
);

router.delete(
  "/delete-message/:messageId",
  authMiddleware,
  deleteMessageValidator,
  validate,
  deleteMessage,
);

export default router;
