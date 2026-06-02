const mongoose = require("mongoose");

// Create the schema for storing the shortened url and also the access to specific users
const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
      trim: true,
    },
    shortCode: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isProtected: {
      type: Boolean,
      default: false,
    },
    authorizedEmails: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    clicks: {
      type: Number,
      default: 0,
    },
    maxClicks: {
      type: Number,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    selfDestruct: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Url", urlSchema);
