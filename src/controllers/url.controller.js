const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");

const {
  createShortUrl,
  getSingleUrl,
  updateUrl,
  deleteUrl,
} = require("../services/url.service");

// Create the short url
const createShortUrl = asyncHandler(async (req, res) => {
  const { originalUrl, data } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!originalUrl) {
    throw new ApiError(400, "Original url is required");
  }

  const shortUrl = await createShortUrl({
    originalUrl,
    data,
    owner: userId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, shortUrl, "Short URL generated successfully"));
});

// Get a single url
const getSingleUrl = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const url = await getSingleUrl(userId);

  if (!url) {
    throw new ApiError(404, "Url not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, url, "URL fetched successfully"));
});

// Update the url
const updateUrl = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const data = req.body;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  // No valid fields were provided for Update
  if (Object.keys(data).length === 0) {
    throw new ApiError(400, "No valid fields were provided for update");
  }

  const updatedUrl = await updateUrl(userId, data);

  if (!updatedUrl) {
    throw new ApiError(404, "Url not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUrl, "URL updated successfully"));
});

// Delete the url
const deleteUrl = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const deletionState = await deleteUrl(userId);

  if (!deletionState) {
    throw new ApiError(404, "Url not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "URL deleted successfully"));
});

module.exports = {
  createShortUrl,
  getSingleUrl,
  updateUrl,
  deleteUrl,
};