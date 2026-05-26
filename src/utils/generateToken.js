const crypto = require("crypto");

// Generate a random token
const generateRandomToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

module.exports = { generateRandomToken };
