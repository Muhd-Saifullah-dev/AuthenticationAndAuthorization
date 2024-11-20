const User = require("../models/user.model");
const {
  VerifyEmail,
  VerifyEmailOtp,
} = require("../emailVerification/email.and.otp.verify");
const crypto = require("crypto");
const { handleError, okResponse } = require("../utils/handlers.utils");
const {
  generateAccessAndRefreshToken,
} = require("../utils/create.tokens.utils");
const { CookieOption } = require("../constant");
const { validationError, AppError } = require("../customError");

const regiterUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    let user = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (user) {
      return res
        .status(401)
        .json({ success: false, message: "User is already Exist" });
    }
    const verificationToken = crypto.randomBytes(20).toString("hex");
    const emailResponse = await VerifyEmail(email, verificationToken);
    if (!emailResponse.success) {
      return res
        .status(400)
        .json({ success: false, message: "EMAIL IS NOT SUCCESSFULY" });
    }

    user = await User.create({
      email,
      password,
      username,
      verificationToken, // Save the token
    });

    await user.save();

    return res
      .status(200)
      .json({ success: false, message: "success check your email" });
  } catch (error) {
    console.log("ERROR IN REGISTER USER", error);
  }
};

const verifiedUser = async (req, res) => {
  try {
    const { verificationToken } = req.params;
    console.log("VERIFY TOKEN", verificationToken);
    if (!verificationToken) {
      return res.status(400).json({ message: "failed" });
    }
    let user = await User.findOneAndUpdate(
      { verificationToken },
      {
        $set: {
          isVerified: true,
        },
        $unset: {
          verificationToken: "",
        },
      }
    );
    if (!user) {
      return res.status(400).json({ message: "Please verify your Email" });
    }
    await user.save();
    console.log("VERIFY USER SUCCESSFULLY");
    return res.status(200).json({ message: "your verification is done" });
  } catch (error) {
    console.log("ERROR IN VERIFIED USER", error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await User.findOne({ username });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }
    if (!user.isVerified === true) {
      return res
        .status(401)
        .json({ success: false, message: "please verify your Email" });
    }
    const passwordMatch = await user.isPasswordCorrect(password);
    if (!passwordMatch) {
      return res
        .status(400)
        .json({ success: false, message: "crediential failed" });
    }
    const { AccessToken, RefreshToken } = await generateAccessAndRefreshToken(
      user?._id
    );

    user.password = undefined;
    user.isVerified = undefined;
    user.refreshToken = undefined;

    res.cookie("accessToken", AccessToken, CookieOption);
    res.cookie("refreshToken", RefreshToken, CookieOption);
    okResponse(res, 200, "user Login Successfully !", user, {
      accessToken: AccessToken,
      refreshToken: RefreshToken,
    });
  } catch (error) {
    console.log("Error IN LOGIN USER", error);
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      handleError(res, 401, "email is invalid !");
    }

    const otpNumber = crypto.randomInt(10000, 100000);
    const sendOtp = await VerifyEmailOtp(email, otpNumber);
    if (!sendOtp) {
      handleError(res, 400, "Otp is not send your email check your email");
    }
    user.otp = otpNumber;
    await user.save();
    okResponse(res, 200, "OTP sent to your email");
  } catch (error) {
    console.log("Error", error);
    handleError(res, 500, "server error");
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;
    let user = await User.findOne({ otp });
    if (!user) {
      handleError(res, 400, "otp is incorrect");
    }

    user.password = newPassword;
    user.otp = 0;
    okResponse(res, 200, "new password set successfull");
  } catch (error) {
    console.log("Error", error);
    handleError(res, 500, "Server error");
  }
};

const incomingAccessAndRefreshToken = async (req, res, next) => {
  try {
    let user = await User.findById(req?.id);
    if (!user) {
      throw new validationError("user not found ");
    }
    if (user.refreshToken !== req.cookies?.refreshToken) {
      throw new AppError(401, "Invalid refresh token please login again");
    }
    const { AccessToken, RefreshToken } = await generateAccessAndRefreshToken(
      user._id
    );
    res.cookie("accessToken", AccessToken, CookieOption);
    res.cookie("refreshToken", RefreshToken, CookieOption);

    okResponse(
      res,
      200,
      "Access token refreshed successfull ",
      {},
      {
        accessToken: AccessToken,
        refreshToken: RefreshToken,
      }
    );
  } catch (error) {
    console.log(
      "ERRORS IN INCOMING ACCESS TOKEN AND REFRESH TOKEN ::  ",
      error
    );
    next(error);
  }
};

const changeProfilePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    let user = await User.findById(req.user?._id);
    if (!user) {
      throw new validationError("user not found");
    }
    const matchPassword = await user.isPasswordCorrect(currentPassword);
    if (!matchPassword) {
      throw new validationError("crediential failed");
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    okResponse(res, 200, "password changed successfully !", {});
  } catch (error) {
    console.log("ERROR IN CHANGE PROFILE PASSWORD :: ", error);
    next(error);
  }
};
module.exports = {
  regiterUser,
  verifiedUser,
  loginUser,
  verifyOtp,
  forgetPassword,
  incomingAccessAndRefreshToken,
  changeProfilePassword,
};
