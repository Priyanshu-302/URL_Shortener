const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // No token
  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }

  // Verify token
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);

  // Find user by id
  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  // Attach the user to the payload
  req.user = user;

  next();
});

module.exports = { authMiddleware };
