const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");

const { findByShortCode, incrementClicks } = require("../services/url.service");

// Redirect to original url
const redirectToOriginal = asyncHandler(async (req, res) => {
  const shortCode = req.params.shortCode;

  if (!shortCode) {
    throw new ApiError(400, "Short code parameter is missing");
  }

  const url = await findByShortCode(shortCode);

  if (!url) {
    throw new ApiError(404, "Url not found");
  }

  if (url.isProtected) {
    return res.status(200).json({
      success: true,
      isProtected: true,
      message:
        "This link is locked. Magic link email verification is required to gain entry.",
    });
  }

  incrementClickCount(shortCode).catch((error) => {
    console.error(
      `Background analytics tracking failed for code [${shortCode}]:`,
      error.message,
    );
  });

  return res.status(302).redirect(url.originalUrl);
});

module.exports = {
  redirectToOriginal,
};