import userModel from "../models/user.model.js";
import { generateToken, verifyToken } from "../utils/token.js";
import { compare } from "bcrypt";
import bcrypt from "bcrypt";
import sendFiles from "../services/storage.service.js";
import redis from "../config/redis.js";
import { generateOtp } from "../utils/otp.js";
import sendEmail from "../services/email.service.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { DEFAULT_CLIENT_URL } from "../config/cors.js";

const getAuthCookieOptions = (req) => ({
  httpOnly: true,
  secure: req.secure,
  sameSite: req.secure ? "none" : "lax",
});

export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, dob, fullname, mobile_no } = req.body;
    const file = req.file;

    //   if (!username || !email || !fullname) {
    //     throw new ApiError(400, "Fields are required");
    // }

    let uploadImage = null;

    if (file) {
      uploadImage = await sendFiles(file.buffer, file.originalname);
    }

    const user = await userModel.create({
      username,
      fullname,
      email,
      password,
      profile_pic: uploadImage?.url || "",
      mobile_no,
      dob,
    });

    const accessToken = generateToken(user._id, "15min");
    const refreshToken = generateToken(user._id, "2d");

    res.cookie("accessToken", accessToken, {
      ...getAuthCookieOptions(req),
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      ...getAuthCookieOptions(req),
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, user, "User registered successfully"));
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await userModel.findOne({ email }).select("+password");


    if(!user.password || user.authProvider==='google') return res.status(400).json({
        success:false,
        message:"continue with google"
    })

    const isPasswordCorrect = user.comparePass(password);
    // console.log(isPasswordCorrect);

    if (!isPasswordCorrect) {
      throw new ApiError(401, " invalid credentials");
    }

    const accessToken = generateToken(user._id, "15min");
    const refreshToken = generateToken(user._id, "2d");

    res.cookie("accessToken", accessToken, {
      ...getAuthCookieOptions(req),
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      ...getAuthCookieOptions(req),
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });
    let userData = user.toObject();
    delete userData.password;

    return res
      .status(200)
      .json(new ApiResponse(200, userData, "User logged in successfully"));
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const profile = req.user?._json || {};
    const { email, displayName, name, given_name, picture, sub } = profile;
    let user = await userModel.findOne({ email });

     if (!user) {
      user = await userModel.create({
        username: given_name || email?.split('@')[0],
        email,
        fullname: name || displayName || given_name,
        profile_pic: picture,
        googleId: sub,
        authProvider: 'google',
      });
    }

    const accessToken = generateToken(user._id, "15min");
    const refreshToken = generateToken(user._id, "2d");

    res.cookie("accessToken", accessToken, {
      ...getAuthCookieOptions(req),
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      ...getAuthCookieOptions(req),
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    const clientUrl = (
      process.env.CLIENT_URL ||
      process.env.FRONTEND_URL ||
      DEFAULT_CLIENT_URL
    )
      .split(",")[0]
      .trim()
      .replace(/\/+$/, "");
    return res.redirect(`${clientUrl}/auth/google/callback`);
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = req.cookies;

    if (accessToken) {
      await redis.set(`Bearer:accessToken:${accessToken}`, "true");
    }
    if (refreshToken) {
      await redis.set(`bearer: refreshToken:${refreshToken}`, "true");
    }
    const cookieOptions = getAuthCookieOptions(req);
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    return res
      .status(200)
      .json(new ApiResponse(200, "User logout successfully"));
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    

    const user = await userModel.findOne({ email });
    if (!user) {
      throw new ApiError(400, "user is not found");
    }

    const otp = generateOtp();
    const hashedOtp = bcrypt.hashSync(otp, 10);
    const otpKey = `reset-password-hashedOtp-${email}`;
    console.log("Generated OTP:", otp);
console.log("Redis Key:", otpKey);

    await redis.set(otpKey, hashedOtp, "EX", 10 * 60);

    await sendEmail(
      user.email,
      "Reset Your Discord Password",
      `Your password reset OTP is: ${otp}. This OTP will expire in 10 minutes.`,
      `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
</head>

<body style="
    margin: 0;
    padding: 0;
    background-color: #f4f5f7;
    font-family: Arial, Helvetica, sans-serif;
">

    <div style="
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    ">

        <!-- Header -->
        <div style="
            background-color: #5865F2;
            padding: 30px 20px;
            text-align: center;
        ">
            <h1 style="
                margin: 0;
                color: #ffffff;
                font-size: 28px;
                font-weight: 700;
            ">
                Discord
            </h1>

            <p style="
                margin: 8px 0 0;
                color: #e8e9ff;
                font-size: 14px;
            ">
                Password Reset
            </p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 35px;">

            <h2 style="
                margin: 0 0 15px;
                color: #23272a;
                font-size: 24px;
            ">
                Reset Your Password 🔐
            </h2>

            <p style="
                color: #555555;
                font-size: 15px;
                line-height: 1.6;
                margin-bottom: 25px;
            ">
                We received a request to reset the password for your
                Discord account. Use the verification code below to
                continue with the password reset.
            </p>

            <!-- OTP Box -->
            <div style="
                background-color: #f2f3f5;
                border: 1px solid #e3e5e8;
                border-radius: 10px;
                padding: 25px 15px;
                text-align: center;
                margin: 25px 0;
            ">

                <p style="
                    margin: 0 0 10px;
                    color: #666666;
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-weight: 600;
                ">
                    Your Verification Code
                </p>

                <h1 style="
                    margin: 0;
                    color: #5865F2;
                    font-size: 36px;
                    letter-spacing: 8px;
                    font-weight: 700;
                ">
                    ${otp}
                </h1>

            </div>

            <!-- Expiry -->
            <p style="
                color: #555555;
                font-size: 14px;
                line-height: 1.6;
                text-align: center;
            ">
                ⏱️ This OTP will expire in
                <strong style="color: #23272a;">10 minutes</strong>.
            </p>

            <hr style="
                border: none;
                border-top: 1px solid #eeeeee;
                margin: 30px 0;
            ">

            <!-- Security Notice -->
            <div style="
                background-color: #fff8e1;
                border-left: 4px solid #f0b429;
                padding: 15px;
                border-radius: 5px;
            ">
                <p style="
                    margin: 0;
                    color: #6b5a00;
                    font-size: 13px;
                    line-height: 1.5;
                ">
                    <strong>Security Notice:</strong><br>
                    If you did not request a password reset, you can safely
                    ignore this email. Never share this OTP with anyone.
                </p>
            </div>

        </div>

        <!-- Footer -->
        <div style="
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #eeeeee;
        ">

            <p style="
                margin: 0 0 8px;
                color: #888888;
                font-size: 12px;
            ">
                This is an automated email. Please do not reply.
            </p>

            <p style="
                margin: 0;
                color: #aaaaaa;
                font-size: 11px;
            ">
                © 2026 Discord Clone. All rights reserved.
            </p>

        </div>

    </div>

</body>
</html>
`,
    );

    return res.status(200).json(
      new ApiResponse(
        200,

        "Email sent successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    // console.log("🔥 VERIFY OTP API HIT");
    const { email, otp } = req.body;
   

    const otpKey = `reset-password-hashedOtp-${email}`;
    const hashedOtp = await redis.get(otpKey);

    if (!hashedOtp) {
      throw new ApiError(400, "OTP expired or not found");
    }

    const isValid = await bcrypt.compare(otp, hashedOtp);
    if (!isValid) {
      throw new ApiError(400, "Invalid OTP");
    }
    console.log("Client OTP:", otp);
console.log("Redis Key:", otpKey);
console.log("Hashed OTP from Redis:", hashedOtp);


    // OTP verified → delete old OTP
    await redis.del(otpKey);

    // Generate reset token
    const resetToken = generateToken(email, "15min");
    const hashedResetToken = await bcrypt.hash(resetToken, 10);

    // Save hashed reset token in Redis
    await redis.set(
      `reset-token-hashedResetToken-${email}`,
      hashedResetToken,
      "EX",
      15 * 60
    );

    // Return resetToken to client
    return res.status(200).json(
      new ApiResponse(200, { resetToken }, "OTP verified successfully")
    );
  } catch (error) {
    next(error);
  }
};



export const resetPassword = async (req, res, next) => {
  try {
    const { email, resetToken, newPassword } = req.body;
    

    const hashedResetToken = await redis.get(
      `reset-token-hashedResetToken-${email}`,
    );
    if (!hashedResetToken) {
      throw new ApiError(400, "your reset session has expired");
    }

    const isValid =  bcrypt.compareSync(resetToken, hashedResetToken)
    if (!isValid) {
      throw new ApiError(400, "Invalid or expired reset token");
    }

    

    const user = await userModel.findOne({ email }).select("password");
    if (!user) {
      throw new ApiError(404, "user not found");
    }


    user.password = newPassword;
    await user.save();
    await redis.del(`reset-token-hashedResetToken-${email}`);

    return res
      .status(200)
      .json(new ApiResponse(200, "password reset successfully"));
  } catch (error) {
    next(error);
  }
};



export const regenratedAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new ApiError(401, "Refresh token not found");
    }

    const isBlackListed = await redis.get(
      `bearer:refreshToken :${refreshToken}`,
    );
    if (isBlackListed) {
      throw new ApiError(403, "refresh token is invalid");
    }

    const decoded = verifyToken(refreshToken)

     if (!decoded) {
      throw new ApiError(
        401,
        "Invalid refresh token"
      );
    }

    const newAccessToken = generateToken(decoded.id, "15min");

    res.cookie("accessToken", newAccessToken, {
      ...getAuthCookieOptions(req),
      maxAge: 15 * 60 * 1000,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { accessToken: newAccessToken },
          "Access token regenerated successfully",
        ),
      );
  } catch (error) {
    next(error);
  }
};



export const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    

    const user = await userModel.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const otp = generateOtp();
    const hashedOtp = bcrypt.hashSync(otp, 10);

    await redis.set(
      `reset-password-hashedOtp-${email}`,
      hashedOtp,
      "EX",
      10 * 60,
    );

    await sendEmail(
      user.email,
      "Resend Password Reset OTP",
      `Your new OTP is: ${otp}. It will expire in 10 minutes.`,
      `<p>Your new OTP is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
    );

    return res
      .status(200)
      .json(new ApiResponse(200, null, "OTP resent successfully"));
  } catch (error) {
    next(error);
  }
};
