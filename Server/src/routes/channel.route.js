import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { requireNitroForVoiceChannel } from '../middleware/nitro.middleware.js'
import { createChannel, deleteChannel, getAllChannel, getSingleChannel, updateChannel } from '../controllers/channel.controller.js'

const router = express.Router()

router.post('/createChannel/:serverId', authMiddleware, requireNitroForVoiceChannel, createChannel)
router.get('/getAllChannel/:serverId', authMiddleware, getAllChannel)
router.get('/getSingleChannel/:serverId/:channelId', authMiddleware, getSingleChannel)
router.patch('/updateChannel/:serverId/:channelId', authMiddleware, requireNitroForVoiceChannel, updateChannel)
router.delete('/deleteChannel/:serverId/:channelId', authMiddleware, deleteChannel)

export default router;