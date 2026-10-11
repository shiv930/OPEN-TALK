import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      throw new ApiError(401, "Authentication required");
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
      if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
        throw new ApiError(401, "Session expired or invalid");
      }
      throw error;
    }

    const user = await userModel
      .findById(decoded.id)
      .select("-password");

    if (!user) {
    throw new ApiError(401, "Session user not found");
    }

    req.user = user;

    next();

  } catch (error) {
   next(error)
  }
};