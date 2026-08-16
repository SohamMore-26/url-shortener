const urlsRepository = require("../db/urls.repository");
const clicksRepository = require("../db/clicks.repository");
const { GoneError, NotFoundError, ValidationError } = require("../utils/errors");
const { generateShortCode } = require("./shortCode.service");

function validateLongUrl(longUrl) {
  if (typeof longUrl !== "string" || longUrl.trim() === "") {
    throw new ValidationError("longUrl must be a non-empty string.");
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(longUrl.trim());
  } catch {
    throw new ValidationError("longUrl must be a valid URL.");
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol) || !parsedUrl.hostname) {
    throw new ValidationError("longUrl must use the http or https protocol.");
  }

  return parsedUrl.toString();
}

function validateShortCode(shortCode) {
  if (typeof shortCode !== "string" || !/^[0-9A-Za-z]{1,10}$/.test(shortCode)) {
    throw new ValidationError("shortCode must contain 1 to 10 Base62 characters.");
  }

  return shortCode;
}

async function createShortUrl(longUrl) {
  const validatedLongUrl = validateLongUrl(longUrl);
  const urlId = await urlsRepository.getNextUrlId();
  const shortCode = generateShortCode(urlId);

  return urlsRepository.createUrl({
    id: urlId,
    shortCode,
    longUrl: validatedLongUrl,
  });
}

async function getUrlForRedirect(shortCode) {
  const validatedShortCode = validateShortCode(shortCode);
  const url = await urlsRepository.findUrlByShortCode(validatedShortCode);

  if (!url) {
    throw new NotFoundError("Short URL was not found.");
  }

  const isExpired = url.expires_at && new Date(url.expires_at) <= new Date();

  if (!url.is_active || isExpired) {
    throw new GoneError("Short URL is inactive or has expired.");
  }

  return url;
}

async function recordClick({ urlId, referrer, ipAddress, userAgent }) {
  return clicksRepository.createClick({
    urlId,
    referrer,
    ipAddress,
    userAgent,
  });
}

module.exports = {
  validateLongUrl,
  validateShortCode,
  createShortUrl,
  getUrlForRedirect,
  recordClick,
};
