const ShortUrl = require("../models/ShortUrl");
const { generateShortCode } = require("../utils/generateShortCode");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");

// Create the short url
const createShortUrl = asyncHandler(
  async ({ originalUrl, owner, isProtected, authorizedEmails, expiresAt }) => {
    let shortCode = generateShortCode();

    let existingCode = await ShortUrl.findOne({ shortCode });
    if (existingCode) {
      throw new ApiError(400, "Short code already exists");
    }

    const shortUrl = await ShortUrl.create({
      originalUrl,
      shortCode,
      owner,
      isProtected,
      authorizedEmails,
      expiresAt,
    });

    return shortUrl;
  },
);

// Get single url
const getSingleUrl = asyncHandler(async (userId) => {
  const url = await ShortUrl.findOne({
    owner: userId,
  });

  if (!url) {
    throw new ApiError(404, "Url not found");
  }

  return url;
});

// Delete url
const deleteUrl = asyncHandler(async (userId) => {
  // Delete the url
  const url = await ShortUrl.deleteOne({ owner: userId });

  if (!url) {
    throw new ApiError(404, "Url not found");
  }

  return url;
});

// Update url
const updateUrl = asyncHandler(async (userId, data) => {
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
});

// Find by short code
const findByShortCode = asyncHandler(async (shortCode) => {
  // Find the url by short code
  const url = await ShortUrl.findOne({
    shortCode,
  });

  if (!url) {
    throw new ApiError(404, "Url not found");
  }

  return url;
}) 

// Increment clicks to 1 to make sure that it is used and corrupted
const incrementClicks = asyncHandler(async (shortCode) => {
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
});

module.exports = {
  createShortUrl,
  getSingleUrl,
  deleteUrl,
  updateUrl,
  incrementClicks,
};