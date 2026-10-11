import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js"
import { getServerMembers, removeMember, updateMemberRole } from "../controllers/serverMember.controller.js"
import { getServerMembersValidator, removeMemberValidator, updateMemberRoleValidator } from "../validators/serverMember.validators.js"
import { validate } from "../middleware/validate.middleware.js"


const router = express.Router()

router.get('/get-server-member/:serverId', authMiddleware,getServerMembersValidator,validate, getServerMembers)
router.delete('/remove-member/:serverId/:userId', authMiddleware,removeMemberValidator,validate, removeMember)
router.patch('/update-member-role/:serverId/:userId', authMiddleware,updateMemberRoleValidator,validate, updateMemberRole)








export default router