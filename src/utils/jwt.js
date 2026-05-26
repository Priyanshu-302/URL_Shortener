const jwt = require("jsonwebtoken");

// Generate the access token
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN, {
    expiresIn: "15m",
  });
};

// Generate the refresh token
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN, {
    expiresIn: "7d",
  });
};

// Verify the Access Token
const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN);
};

// Verify the Refresh Token
const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
