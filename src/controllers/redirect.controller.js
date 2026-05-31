const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");

const { findByShortCode, incrementClicks } = require("../services/url.service");

// Redirect to original url
const redirectToOriginalController = asyncHandler(async (req, res, next) => {
  const shortCode = req.params.shortCode;

  if (!shortCode) {
    throw new ApiError(400, "Short code parameter is missing");
  }

  const url = await findByShortCode(shortCode);

  if (!url) {
    throw new ApiError(404, "Url not found");
  }

  if (url.isProtected) {
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    return res.redirect(`${clientUrl}/access/${shortCode}`);
  }

  incrementClicks(shortCode).catch((error) => {
    console.error(
      `Background analytics tracking failed for code [${shortCode}]:`,
      error.message,
    );
  });

  return res.status(302).redirect(url.originalUrl);
});

module.exports = {
  redirectToOriginalController,
};