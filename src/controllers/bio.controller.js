const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const BioProfile = require("../models/BioProfile");
const ShortUrl = require("../models/ShortUrl");

// Get logged-in user's profile settings
const getMyBioProfileController = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  let profile = await BioProfile.findOne({ owner: userId }).populate("links");
  
  // Auto-generate placeholder if new
  if (!profile) {
    // Generate a default unique username using slice of ObjectId
    const defaultUsername = `user_${userId.toString().slice(-6)}`;
    profile = await BioProfile.create({
      owner: userId,
      username: defaultUsername,
      displayName: req.user?.name || "My Links Profile",
      bio: "Welcome to my links space!",
      links: [],
      socials: {
        instagram: "",
        twitter: "",
        github: "",
        linkedin: "",
        youtube: ""
      }
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, profile, "Bio profile retrieved successfully"));
});

// Update bio profile configurations
const updateBioProfileController = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { username, displayName, bio, avatarUrl, theme, links, socials } = req.body;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  // Validate username
  if (username) {
    const cleanUsername = username.trim().toLowerCase();
    const usernameRegex = /^[a-zA-Z0-9-_]+$/;
    if (!usernameRegex.test(cleanUsername)) {
      throw new ApiError(400, "Username can only contain letters, numbers, dashes, and underscores.");
    }

    const duplicate = await BioProfile.findOne({
      username: cleanUsername,
      owner: { $ne: userId }
    });
    if (duplicate) {
      throw new ApiError(400, "This username is already taken.");
    }
  }

  // Sanitize links: ensure all exist and are owned by this user
  let validatedLinks = [];
  if (Array.isArray(links)) {
    const userUrls = await ShortUrl.find({ _id: { $in: links }, owner: userId });
    // Match the order submitted in links payload
    validatedLinks = links.filter(id => userUrls.some(u => u._id.toString() === id.toString()));
  }

  const updatedProfile = await BioProfile.findOneAndUpdate(
    { owner: userId },
    {
      $set: {
        username: username?.trim().toLowerCase(),
        displayName: displayName?.trim(),
        bio: bio?.trim(),
        avatarUrl: avatarUrl?.trim(),
        theme,
        links: validatedLinks,
        socials
      }
    },
    { new: true, upsert: true, runValidators: true }
  ).populate("links");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProfile, "Bio profile updated successfully"));
});

// Fetch public profile view
const getPublicBioProfileController = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username) {
    throw new ApiError(400, "Username parameter is required.");
  }

  const profile = await BioProfile.findOne({ username: username.toLowerCase() })
    .populate({
      path: "links",
      select: "originalUrl shortCode isProtected clicks expiresAt maxClicks selfDestruct password",
    });

  if (!profile) {
    throw new ApiError(404, "Bio profile not found");
  }

  // Filter active/non-expired URLs
  const now = new Date();
  const activeLinks = profile.links.filter((url) => {
    const isExpired = url.expiresAt && now > new Date(url.expiresAt);
    const isLimitReached = typeof url.maxClicks === "number" && url.clicks >= url.maxClicks;
    const isSelfDestructed = url.selfDestruct && url.clicks >= 1;
    
    // Protected behind magic links or passwords are also skipped or rendered differently
    return !isExpired && !isLimitReached && !isSelfDestructed;
  });

  const publicData = {
    username: profile.username,
    displayName: profile.displayName,
    bio: profile.bio,
    avatarUrl: profile.avatarUrl,
    theme: profile.theme,
    socials: profile.socials,
    links: activeLinks.map(link => ({
      _id: link._id,
      title: link.originalUrl.replace(/https?:\/\/(www\.)?/, "").split("/")[0], // Fallback label
      shortCode: link.shortCode,
      isProtected: link.isProtected,
      isPasswordProtected: !!link.password
    }))
  };

  return res
    .status(200)
    .json(new ApiResponse(200, publicData, "Public bio profile retrieved"));
});

module.exports = {
  getMyBioProfileController,
  updateBioProfileController,
  getPublicBioProfileController
};