import express from 'express'
import upload from '../config/multer.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { 
  changePassword, 
  deleteAccount, 
  getMe, 
  getUserProfile, 
  updateProfile, 
  updateProfilePicture 
} from '../controllers/user.controller.js'

import { 
  updateProfileValidator, 
  getUserProfileValidator, 
  changePasswordValidator, 
  updateProfilePictureValidator, 
  deleteAccountValidator 
} from '../validators/user.validator.js'
import { validate } from '../middleware/validate.middleware.js'

const router = express.Router()

router.get("/get-me", authMiddleware, getMe)
router.post("/update-profile", authMiddleware, updateProfileValidator,validate, updateProfile)
router.get('/get-user-profile/:username', authMiddleware, getUserProfileValidator,validate, getUserProfile)
router.post('/change-password', authMiddleware, changePasswordValidator,validate, changePassword)
router.post('/update-profile-picture', authMiddleware, upload.single('image'), updateProfilePictureValidator,validate, updateProfilePicture)
router.delete('/delete-account', authMiddleware, deleteAccountValidator,validate, deleteAccount)

export default router
