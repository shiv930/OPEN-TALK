
import { body, param } from "express-validator";
import mongoose from "mongoose";

// ==========================================
// CREATE ROLE VALIDATOR
// ==========================================

export const createRoleValidator = [
  param("serverId")
    .notEmpty()
    .withMessage("Server ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid server ID");
      }
      return true;
    }),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Role name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Role name must be between 2 and 50 characters"),

  body("permission")
    .notEmpty()
    .withMessage("Permission is required")
    .isArray()
    .withMessage("Permission must be an array"),

  body("color")
    .optional()
    .trim()
    .matches(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/)
    .withMessage("Color must be a valid HEX color"),

  body("position")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Position must be a non-negative integer"),
];


// ==========================================
// GET ALL ROLES VALIDATOR
// ==========================================

export const getAllRolesValidator = [
  param("serverId")
    .notEmpty()
    .withMessage("Server ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid server ID");
      }
      return true;
    }),
];


// ==========================================
// GET SINGLE ROLE VALIDATOR
// ==========================================

export const getSingleRoleValidator = [
  param("roleId")
    .notEmpty()
    .withMessage("Role ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid role ID");
      }
      return true;
    }),
];


// ==========================================
// UPDATE ROLE VALIDATOR
// ==========================================

export const updateRoleValidator = [
  param("roleId")
    .notEmpty()
    .withMessage("Role ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid role ID");
      }
      return true;
    }),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Role name must be between 2 and 50 characters"),

  body("serverId")
    .optional()
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid server ID");
      }
      return true;
    }),

  body("userId")
    .optional()
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid user ID");
      }
      return true;
    }),

  body("permission")
    .optional()
    .isArray()
    .withMessage("Permission must be an array"),

  body("color")
    .optional()
    .trim()
    .matches(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/)
    .withMessage("Color must be a valid HEX color"),

  body("position")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Position must be a non-negative integer"),
];


// ==========================================
// DELETE ROLE VALIDATOR
// ==========================================

export const deleteRoleValidator = [
  param("roleId")
    .notEmpty()
    .withMessage("Role ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid role ID");
      }
      return true;
    }),
];

