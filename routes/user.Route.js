const { Router } = require("express");
const userController = require("../controllers/user.controller");
const {
  SignupValidation,
  ResetPassword,
} = require("../validations/signup.validation");
const { ErrorResult } = require("../validations/result.validation");
const tokens = require("../middleware/auth.middleware");

const userRoute = Router();

userRoute.post(
  "/register",
  SignupValidation,
  ErrorResult,
  userController.regiterUser
);
userRoute.get("/verify/:verificationToken", userController.verifiedUser);
userRoute.post("/login", userController.loginUser);
userRoute.post("/forget-password", userController.forgetPassword);
userRoute.post(
  "/verify-otp",
  ResetPassword,
  ErrorResult,
  userController.verifyOtp
);
userRoute.get(
  "/incoming-refreshed-tokens",
  tokens.refreshAccessToken,
  userController.incomingAccessAndRefreshToken
);
userRoute.post(
  "/change-password",
  tokens.verifyJwt,
  userController.changeProfilePassword
);
module.exports = userRoute;
