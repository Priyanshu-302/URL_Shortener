const { ApiResponse } = require("../utils/ApiResponse");
const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");
const { cookieOptions } = require("../utils/cookieOptions");
const { welcomeEmailTemplate } = require("../templates/welcomeEmailTemplate");
const { sendEmail } = require("../services/email.service");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const {
  register,
  login,
  logout,
  refreshAccessToken,
} = require("../services/auth.service");

// Register User
const registerController = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  console.log(req.body);

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const createdUser = await register({ name, email, password });

  const html = welcomeEmailTemplate({
    name: createdUser.name,
  });

  try {
    await sendEmail({
      to: createdUser.email,
      subject: "Welcome Email",
      html,
    });
  } catch (error) {
    console.error(`Email dispatch system failed: ${error.message}`);
    throw new ApiError(
      500,
      "The welcome email could not be delivered. Please try again later.",
    );
  }

  const safeData = {
    _id: createdUser._id,
    name: createdUser.name,
    email: createdUser.email,
    createdAt: createdUser.createdAt,
  };

  return res.status(201).json(new ApiResponse(201, safeData, "User created"));
});

// Login User
const loginController = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const { user, accessToken, refreshToken } = await login({ email, password });

  const accessTokenMaxAge = 1 * 24 * 60 * 60 * 1000;
  const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000;

  const safeData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    accessToken,
    refreshToken,
  };

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
    .json(new ApiResponse(200, { safeData }, "Login successful"));
});

// Logout User
const logoutController = asyncHandler(async (req, res, next) => {
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
const refreshAccessTokenController = asyncHandler(async (req, res, next) => {
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

// Update Profile
const updateProfileController = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { name, email, currentPassword, newPassword } = req.body;
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Update name if provided
  if (name) {
    user.name = name;
  }

  // Update email if provided
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      throw new ApiError(400, "Email is already taken");
    }
    user.email = email;
  }

  // Change password if currentPassword and newPassword are provided
  if (currentPassword && newPassword) {
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
      throw new ApiError(400, "Current password is incorrect");
    }
    if (newPassword.length < 6) {
      throw new ApiError(400, "New password must be at least 6 characters long");
    }
    user.password = await bcrypt.hash(newPassword, 10);
  }

  await user.save();

  const safeData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    updatedAt: user.updatedAt,
  };

  return res.status(200).json(new ApiResponse(200, safeData, "Profile updated successfully"));
});

module.exports = {
  registerController,
  loginController,
  logoutController,
  refreshAccessTokenController,
  updateProfileController,
};
