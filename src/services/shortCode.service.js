const { toBase62 } = require("../utils/base62");

function generateShortCode(urlId) {
  if (!Number.isSafeInteger(urlId) || urlId < 1) {
    throw new TypeError("A short code requires a positive URL id.");
  }

  const shortCode = toBase62(urlId);

  if (shortCode.length > 10) {
    throw new RangeError("Generated short code exceeds the database limit.");
  }

  return shortCode;
}

module.exports = { generateShortCode };
