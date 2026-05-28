const { ApiResponse } = require("../utils/ApiResponse");
const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");
const { cookieOptions } = require("../utils/cookieOptions");

const {
  register,
  login,
  logout,
  refreshAccessToken,
} = require("../services/auth.service");

// Register User
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const createdUser = await register({ name, email, password });

  const safeData = {
    _id: createdUser._id,
    name: createdUser.name,
    email: createdUser.email,
    createdAt: createdUser.createdAt,
  };

  return res.status(201).json(new ApiResponse(201, safeData, "User created"));
});

// Login User
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const { user, accessToken, refreshToken } = await login({ email, password });

  const accessTokenMaxAge = 1 * 24 * 60 * 60 * 1000;
  const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000;

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: accessTokenMaxAge,
    })
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: refreshTokenMaxAge,
    })
    .json(new ApiResponse(200, { user }, "Login successful"));
});

// Logout User
const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!refreshToken) {
    throw new ApiError(400, "Refresh token is required");
  }

  await logout(refreshToken);

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, null, "Logout successful"));
});

// Refresh the access token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!refreshToken) {
    throw new ApiError(400, "Refresh token is required");
  }

  const newAccessToken = await refreshAccessToken(refreshToken);

  const accessTokenMaxAge = 1 * 24 * 60 * 60 * 1000;

  return res
    .status(200)
    .cookie("accessToken", newAccessToken, {
      ...cookieOptions,
      maxAge: accessTokenMaxAge,
    })
    .json(
      new ApiResponse(
        200,
        { accessToken: newAccessToken },
        "Access token refreshed",
      ),
    );
});

module.exports = {
  register,
  login,
  logout,
  refreshAccessToken,
};