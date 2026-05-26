const crypto = require("crypto");

// Hash the token for the magic link
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

module.exports = { hashToken };