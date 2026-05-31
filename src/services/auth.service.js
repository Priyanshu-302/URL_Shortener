const bcrypt = require("bcrypt");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");

// Register User
const register = async ({ name, email, password }) => {
  // Check for existing user
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(400, "User already exists");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the User
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return user;
};

// Login User
const login = async ({ email, password }) => {
  // Find the user
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "Invalid Credentials");
  }

  // Match the password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(400, "Invalid Credentials");
  }

  // Generate Tokens
  const accessToken = generateAccessToken({
    userId: user._id,
  });

  const refreshToken = generateRefreshToken({
    userId: user._id,
  });

  // Store the refresh token
  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { user, accessToken, refreshToken };
};

// Logout User
const logout = async (refreshToken) => {
  await RefreshToken.findOneAndDelete({
    token: refreshToken,
  });

  return true;
};

// Refresh access token
const refreshAccessToken = async (refreshToken) => {
  // Find the refresh token
  const storedToken = await RefreshToken.findOne({
    token: refreshToken,
  });

  if (!storedToken) {
    throw new ApiError(400, "Invalid refresh token");
  }

  const newAccessToken = generateAccessToken({
    userId: storedToken.userId,
  });

  return newAccessToken;
};

module.exports = {
  register,
  login,
  logout,
  refreshAccessToken,
};
