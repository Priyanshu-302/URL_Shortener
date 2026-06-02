const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const ShortUrl = require("../models/ShortUrl");
const { isUrlExpired } = require("../utils/checkExpiry");
const bcrypt = require("bcrypt");

const {
  createShortUrl,
  getSingleUrl,
  updateUrl,
  deleteUrl,
} = require("../services/url.service");

// Create the short url
const createShortUrlController = asyncHandler(async (req, res, next) => {
  const { originalUrl } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!originalUrl) {
    throw new ApiError(400, "Original url is required");
  }

  const shortUrl = await createShortUrl({
    ...req.body,
    owner: userId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, shortUrl, "Short URL generated successfully"));
});

// Get all urls for the authenticated user
const getMyUrlsController = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const urls = await ShortUrl.find({ owner: userId }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, urls, "User URLs fetched successfully"));
});

// Get a single url
const getSingleUrlController = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;
  const { id } = req.params;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const url = await ShortUrl.findOne({ _id: id, owner: userId });

  if (!url) {
    throw new ApiError(404, "Url not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, url, "URL fetched successfully"));
});

// Update the url
const updateUrlController = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;
  const { id } = req.params;
  const data = req.body;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  // No valid fields were provided for Update
  if (Object.keys(data).length === 0) {
    throw new ApiError(400, "No valid fields were provided for update");
  }

  if (data.shortCode && data.shortCode.trim() !== "") {
    const cleanCode = data.shortCode.trim();

    const codeRegex = /^[a-zA-Z0-9-_]+$/;
    if (!codeRegex.test(cleanCode)) {
      throw new ApiError(
        400,
        "Custom code can only contain letters, numbers, dashes, and underscores.",
      );
    }

    const duplicate = await ShortUrl.findOne({
      shortCode: cleanCode,
      _id: { $ne: id },
    });

    if (duplicate) {
      throw new ApiError(400, "This custom short code is already taken.");
    }

    data.shortCode = cleanCode;
  }

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  const updatedUrl = await ShortUrl.findOneAndUpdate(
    { _id: id, owner: userId },
    data,
    { new: true },
  );

  if (!updatedUrl) {
    throw new ApiError(404, "Url not found or unauthorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUrl, "URL updated successfully"));
});

// Delete the url
const deleteUrlController = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;
  const { id } = req.params;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const deletionState = await ShortUrl.deleteOne({ _id: id, owner: userId });

  if (deletionState.deletedCount === 0) {
    throw new ApiError(404, "Url not found or unauthorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "URL deleted successfully"));
});

// Check if short code exists and is protected (used by frontend router)
const checkShortCodeController = asyncHandler(async (req, res, next) => {
  const { shortCode } = req.params;

  if (!shortCode) {
    throw new ApiError(400, "Short code is required");
  }

  const url = await ShortUrl.findOne({ shortCode });

  if (!url) {
    throw new ApiError(404, "URL not found");
  }

  const validation = isUrlExpired(url);
  if (validation.expired) {
    throw new ApiError(410, validation.reason);
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        shortCode: url.shortCode,
        isProtected: url.isProtected,
        isPasswordProtected: !!url.password,
        originalUrl: url.isProtected || url.password ? null : url.originalUrl,
      },
      "URL state verified",
    ),
  );
});

// Password verification controller
const verifyPasswordController = asyncHandler(async (req, res, next) => {
  const { shortCode, password } = req.body;

  if (!shortCode || !password) {
    throw new ApiError(400, "Shortcode and password are required");
  }
  const url = await ShortUrl.findOne({ shortCode });
  if (!url) {
    throw new ApiError(404, "Link not found");
  }

  const validation = isUrlExpired(url);
  if (validation.expired) {
    throw new ApiError(410, validation.reason);
  }

  const isMatch = await bcrypt.compare(password, url.password);
  if (!isMatch) {
    throw new ApiError(401, "Incorrect password");
  }

  // Increment click count
  url.clicks = (url.clicks || 0) + 1;
  await url.save();
  return res
    .status(200)
    .json(
      new ApiResponse(200, { redirectUrl: url.originalUrl }, "Access granted"),
    );
});

module.exports = {
  createShortUrlController,
  getSingleUrlController,
  updateUrlController,
  deleteUrlController,
  getMyUrlsController,
  checkShortCodeController,
  verifyPasswordController,
};
