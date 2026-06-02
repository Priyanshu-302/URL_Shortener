const ShortUrl = require("../models/ShortUrl");
const { generateShortCode } = require("../utils/generateShortCode");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const bcrypt = require("bcrypt");

// Create the short url
const createShortUrl = async ({
  originalUrl,
  owner,
  isProtected,
  authorizedEmails,
  expiresAt,
  maxClicks,
  selfDestruct,
  password,
  customCode,
}) => {
  let shortCode;

  if (customCode && customCode.trim() !== "") {
    const cleanCode = customCode.trim();

    const codeRegex = /^[a-zA-Z0-9-_]+$/;
    if (!codeRegex.test(cleanCode)) {
      throw new ApiError(
        400,
        "Custom code can only contain letters, numbers, dashes, and underscores.",
      );
    }

    let existingCode = await ShortUrl.findOne({ shortCode: cleanCode });
    if (existingCode) {
      throw new ApiError(400, "Short code already exists");
    }

    shortCode = cleanCode;
  } else {
    shortCode = generateShortCode();
    let existingCode = await ShortUrl.findOne({ shortCode });
    if (existingCode) {
      throw new ApiError(
        400,
        "Generated short code already exists. Please try again.",
      );
    }
  }

  let hashedPassword = null;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  const shortUrl = await ShortUrl.create({
    originalUrl,
    shortCode,
    owner,
    isProtected,
    authorizedEmails,
    expiresAt,
    maxClicks,
    selfDestruct,
    password: hashedPassword,
  });

  return shortUrl;
};

// Get single url
const getSingleUrl = async (userId) => {
  const url = await ShortUrl.findOne({
    owner: userId,
  });

  if (!url) {
    throw new ApiError(404, "Url not found");
  }

  return url;
};

// Delete url
const deleteUrl = async (userId) => {
  // Delete the url
  const url = await ShortUrl.deleteOne({ owner: userId });

  if (!url) {
    throw new ApiError(404, "Url not found");
  }

  return url;
};

// Update url
const updateUrl = async (userId, data) => {
  // Update the url
  const url = await ShortUrl.findOneAndUpdate(
    {
      owner: userId,
    },
    data,
    { new: true },
  );

  if (!url) {
    throw new ApiError(404, "Url not found");
  }

  return url;
};

// Find by short code
const findByShortCode = async (shortCode) => {
  // Find the url by short code
  const url = await ShortUrl.findOne({
    shortCode,
  });

  if (!url) {
    throw new ApiError(404, "Url not found");
  }

  return url;
};

// Increment clicks to 1 to make sure that it is used and corrupted
const incrementClicks = async (shortCode) => {
  // Update the clicks to 1 using aggregate pipeline
  const url = await ShortUrl.findOneAndUpdate(
    {
      shortCode,
    },
    {
      $inc: {
        clicks: 1,
      },
    },
  );
};

module.exports = {
  createShortUrl,
  getSingleUrl,
  deleteUrl,
  updateUrl,
  findByShortCode,
  incrementClicks,
};
