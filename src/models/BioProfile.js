const mongoose = require("mongoose");

const bioProfileSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
      match: [/^[a-zA-Z0-9-_]+$/, "Username can only contain letters, numbers, dashes, and underscores"],
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
      default: "My Links Profile",
    },
    bio: {
      type: String,
      trim: true,
      default: "",
    },
    avatarUrl: {
      type: String,
      trim: true,
      default: "",
    },
    theme: {
      type: String,
      enum: ["minimal", "midnight", "sunset", "neon"],
      default: "minimal",
    },
    links: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Url",
      },
    ],
    socials: {
      instagram: { type: String, trim: true, default: "" },
      twitter: { type: String, trim: true, default: "" },
      github: { type: String, trim: true, default: "" },
      linkedin: { type: String, trim: true, default: "" },
      youtube: { type: String, trim: true, default: "" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BioProfile", bioProfileSchema);