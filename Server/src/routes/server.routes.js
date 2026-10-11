import express from 'express'
import upload from "../config/multer.js";
import { authMiddleware } from '../middleware/auth.middleware.js'
import { createServer, deleteServer, getPublicServers, getServer, getServerDetails, joinServer, leaveServer, updateServer } from '../controllers/server.controller.js'
import { createServerValidator, deleteServerValidator, joinServerValidator, leaveServerValidator, updateServerValidator } from '../validators/server.validator.js'
import { validate } from '../middleware/validate.middleware.js'

const router = express.Router()

router.post("/create-server", authMiddleware,upload.fields([{name:"icon"}, {name:"banner"}]),createServerValidator,validate, createServer)
router.get('/get-server', authMiddleware,getServer)
router.get('/public', authMiddleware, getPublicServers)
router.get('/get-server-details/:id',authMiddleware, getServerDetails)
router.patch('/update-server/:serverId', authMiddleware, upload.fields([{name:"icon"}, {name:"banner"}]) ,updateServerValidator,validate,  updateServer)
router.delete('/delete-server/:serverId', authMiddleware,deleteServerValidator,validate, deleteServer)
router.post('/join/:inviteCode', authMiddleware,joinServerValidator,validate,  joinServer)
router.delete('/leave/:serverId', authMiddleware,leaveServerValidator, validate,  leaveServer)




export default router