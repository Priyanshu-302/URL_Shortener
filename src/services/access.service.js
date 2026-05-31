const ShortUrl = require("../models/ShortUrl");
const AccessToken = require("../models/AccessToken");
const { generateRandomToken } = require("../utils/generateToken");
const { hashToken } = require("../utils/hashToken");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");

// External user requesting permission for accessing the link
const requestAccess = async ({ shortCode, email }) => {
  // Find the url by short code
  const url = await ShortUrl.findOne({ shortCode });
  if (!url) {
    throw new ApiError(404, "Url not found");
  }

  // Check if it is protected or public
  if (!url.isProtected) {
    throw new ApiError(400, "Url is public");
  }

  // Check if the email is authorized or not (if list is empty, anyone can request)
  const isAuthorized = url.authorizedEmails.length === 0 || url.authorizedEmails.includes(email);
  if (!isAuthorized) {
    throw new ApiError(403, "Email not authorized");
  }

  // Generate a random token that will go to the external user
  const randomToken = generateRandomToken();

  // Hash the token
  const hashedToken = hashToken(randomToken);

  // Store it as a access token i.e. short-lived
  const accessToken = await AccessToken.create({
    shortUrlId: url._id,
    email,
    token: hashedToken,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  });

  return {
    accessToken,
    randomToken,
    url,
  };
};

// Verify the magic link to provide permission of accessing the url
const verifyMagicLink = async (token) => {
  // Hash the random token
  const hashedToken = hashToken(token);

  // Find the token
  const accessToken = await AccessToken.findOne({
    token: hashedToken,
  });

  if (!accessToken) {
    throw new ApiError(400, "Invalid token");
  }

  if (accessToken.used) {
    throw new ApiError(400, "Token already used");
  }

  if (Date.now() > accessToken.expiresAt) {
    throw new ApiError(400, "Token expired");
  }

  accessToken.used = true;
  await accessToken.save();

  // Find the Url
  const url = await ShortUrl.findById(accessToken.shortUrlId);
  if (url) {
    url.clicks = (url.clicks || 0) + 1;
    await url.save();
  }

  return url;
};

module.exports = {
  requestAccess,
  verifyMagicLink,
};
