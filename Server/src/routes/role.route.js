import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { CreateRole, deleteRole, getAllRoles, getSingleRole, updateRole } from '../controllers/role.controller.js'
import { createRoleValidator, deleteRoleValidator, getAllRolesValidator, getSingleRoleValidator, updateRoleValidator } from '../validators/role.validator.js'
import { validate } from '../middleware/validate.middleware.js'

const router = express.Router()

router.post('/createRole/:serverId', authMiddleware,createRoleValidator, validate, CreateRole)
router.get('/getAllRoles/:serverId', authMiddleware,getAllRolesValidator,validate, getAllRoles)
router.get('/getSingleRole/:roleId', authMiddleware,getSingleRoleValidator,validate, getSingleRole)
router.patch('/updateRole/:roleId', authMiddleware,updateRoleValidator, validate, updateRole)
router.delete('/deleteRole/:roleId', authMiddleware,deleteRoleValidator,validate, deleteRole)



export default router