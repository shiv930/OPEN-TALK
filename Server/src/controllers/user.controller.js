import userModel from "../models/user.model.js";
import bcrypt from 'bcrypt'
import sendFiles from "../services/storage.service.js";
import ApiError from '../utils/ApiError.js'
import ApiResponse from "../utils/ApiResponse.js";


export  const getMe = async(req, res, next )=>{
    try {
        const user=  await userModel.findById(req. user.id)
    if (!user){
      throw new ApiError(404, "user is not found ")
    }
      

   return res.status(200).json(
    new ApiResponse(
        200,
        user,
        "User fetched successfully"
    )
);

  } catch (error) {
    next(error)
  }
}

export const updateProfile = async (req, res, next ) => {
  try {
    const { username, fullname, mobile_no, dob } = req.body;
    const updateData = {};
    if (username !== undefined) updateData.username = username;
    if (fullname !== undefined) updateData.fullname = fullname;
    if (mobile_no !== undefined) updateData.mobile_no = mobile_no;
    if (dob !== undefined) updateData.dob = dob;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true },
    ).select("-password")
   if (!updatedUser) {
    throw new ApiError(404, "User not found");
}

   return res.status(200).json(
    new ApiResponse(
        200,
        updatedUser,
        "User profile updated successfully"
    )
);
  } catch (error) {
    next(error)
  }
};

export const getUserProfile = async (req, res, next ) => {
  try {
    const { username } = req.params;
    const user = await userModel.findOne({ username }).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
}
    return res.status(200).json(
    new ApiResponse(
        200,
        user,
        "User profile fetched successfully"
    )
);
  } catch (error) {
   next(error)
  }
};

export const changePassword = async(req, res, next )=>{
  try {
    const {password, newPassword}= req.body;
    if (!password || !newPassword) {
    throw new ApiError(400, "Both fields are required");
}

  if (password === newPassword) {
    throw new ApiError(409, "Enter a different password");
}

  const user = await userModel.findById(req.user.id).select("+password");

  if (!user) {
    throw new ApiError(404, "User details not found");
}

  const isPasswordMatched = user.comparePass(password)
 if (!isPasswordMatched) {
    throw new ApiError(400, "Incorrect password");
}
  const hashedNewPassword = bcrypt.hashSync(newPassword,10)
  user.password = hashedNewPassword
  await user.save()

  return res.status(200).json(
    new ApiResponse(
        200,
        null,
        "Password changed successfully"
    )
);
    
  } catch (error) {
    next(error)
  }
}

export const updateProfilePicture = async( req, res, next )=>{
  try {
    const file = req.file
   if (!file) {
    throw new ApiError(400, "File is required");
}
    
    const user = await userModel.findById(req.user.id)
    if (!user) {
    throw new ApiError(404, "User not found");
}

    const upload = await sendFiles(file.buffer, file.originalname)
   if (!upload) {
    throw new ApiError(400, "File was not uploaded");
}
    user.profile_pic = upload.url
     await user.save()
    return res.status(200).json(
    new ApiResponse(
        200,
        { profile_pic: user.profile_pic },
        "Profile picture updated successfully"
    )
);

  } catch (error) {
   next(error)
  }
}

export const deleteAccount = async (req, res, next ) => {
  try {
    const user = await userModel.findByIdAndDelete(req.user.id);

    if (!user) {
    throw new ApiError(404, "User does not exist");
}

   return res.status(200).json(
    new ApiResponse(
        200,
        null,
        "User account deleted successfully"
    )
);
  } catch (error) {
    next(error)
  }
};

