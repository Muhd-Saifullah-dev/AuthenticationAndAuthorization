const { ACCESS_SECRET, REFRESH_SECRET } = require("../config/config");
const { AppError, validationError } = require("../customError");
const JWT = require("jsonwebtoken");
const User = require("../models/user.model");

const verifyJwt = async (req, __, next) => {
  try {
    const verifyToken =
      req.cookies?.accessToken ||
      req.header("Authorization").replace("Bearer ", "");
    if (!verifyToken) {
      throw new AppError(400, "Token is not valid");
    }
    const decoded = JWT.verify(verifyToken, ACCESS_SECRET);
    const user = await User.findById(decoded?.id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new validationError("Invalid access token");
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error In Verify Access Token :: ", error);
    next(error);
  }
};

const refreshAccessToken = async (req, _, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    console.log("Refresh Token ",refreshToken)
    if (!refreshToken) {
      throw new AppError(400, "Invalid refresh token");
    }
    const decode = JWT.verify(refreshToken, REFRESH_SECRET);
    console.log("decoded",decode.id)
    req.user = decode;
    next();
  } catch (error) {
    console.log("ERROR IN REFRESH ACCESS TOKEN :: ", error);
    next(error);
  }
};

module.exports = {
  verifyJwt,
  refreshAccessToken,
};
