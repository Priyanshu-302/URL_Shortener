const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { sendEmail } = require("../services/email.service");
const { accessEmailTemplate } = require("../templates/accessEmailTemplate");

const {
  requestAccess,
  verifyMagicLink,
} = require("../services/access.service");

// External user requesting permission for accessing the link
const requestAccess = asyncHandler(async (req, res) => {
  const { shortCode, email } = req.body;

  if (!shortCode || !email) {
    throw new ApiError(400, "All fields are required");
  }

  // Basic structural regex check for the incoming email address
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Provided email address format is invalid.");
  }

  const { randomToken } = await requestAccess({ shortCode, email });

  const baseUrl = process.env.CLIENT_URL?.replace(/\/$/, "");
  const accessLink = `${baseUrl}/access/${randomToken}`;

  const html = accessEmailTemplate({
    accessLink,
    shortCode,
  });

  try {
    await sendEmail({
      to: email,
      subject: "🔒 Protected Link Access Request",
      html,
    });
  } catch (error) {
    console.error(`Email dispatch system failed: ${emailError.message}`);
    throw new ApiError(
      500,
      "The access email could not be delivered. Please try again later.",
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "An access validation email has been sent successfully.",
      ),
    );
});

// Verify the magic link
const verifyMagicLink = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    throw new ApiError(400, "Token parameter is missing");
  }

  const url = await verifyMagicLink(token);

  if (!url) {
    throw new ApiError(404, "Url not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { redirectUrl: url.originalUrl },
        "Access authorization verified. Redirecting shortly...",
      ),
    );
});

module.exports = {
  requestAccess,
  verifyMagicLink,
};