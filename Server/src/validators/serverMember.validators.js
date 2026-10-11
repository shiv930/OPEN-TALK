
import { body, param } from "express-validator";
import mongoose from "mongoose";


// ==========================================
// COMMON OBJECT ID VALIDATOR
// ==========================================

const validObjectId = (fieldName) => {
  return param(fieldName)
    .notEmpty()
    .withMessage(`${fieldName} is required`)
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error(`Invalid ${fieldName}`);
      }

      return true;
    });
};


// ==========================================
// GET SERVER MEMBERS
// GET /:serverId/members
// ==========================================

export const getServerMembersValidator = [
  validObjectId("serverId"),
];


// ==========================================
// REMOVE MEMBER
// DELETE /:serverId/members/:userId
// ==========================================

export const removeMemberValidator = [
  validObjectId("serverId"),

  validObjectId("userId"),
];


// ==========================================
// UPDATE MEMBER ROLE
// PATCH /:serverId/members/:userId/role
// ==========================================

export const updateMemberRoleValidator = [
  validObjectId("serverId"),

  validObjectId("userId"),

  body("roleId")
    .notEmpty()
    .withMessage("Role ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid role ID");
      }

      return true;
    }),
];
