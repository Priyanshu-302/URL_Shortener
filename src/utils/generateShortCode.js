const nanoid = require("nanoid");

// Generate a short code for url shortening
const generateShortCode = () => {
  return nanoid(7);
};

module.exports = { generateShortCode };
