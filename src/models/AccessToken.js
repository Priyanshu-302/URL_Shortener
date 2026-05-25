const mongoose = require("mongoose");

// Store the access token i.e. short-lived
const accessTokenSchema = new mongoose.Schema(
  {
    shortUrlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShortUrl",
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("AccessToken", accessTokenSchema);