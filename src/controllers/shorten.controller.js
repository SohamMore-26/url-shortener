const { createShortUrl } = require("../services/url.service");

function buildShortUrl(shortCode) {
  const baseUrl = process.env.BASE_URL?.replace(/\/$/, "");

  if (!baseUrl) {
    throw new Error("BASE_URL is required to create a short URL.");
  }

  return `${baseUrl}/${shortCode}`;
}

async function shortenUrl(req, res, next) {
  try {
    if (!req.body || !Object.hasOwn(req.body, "longUrl")) {
      return res.status(400).json({
        error: "longUrl is required.",
      });
    }

    const url = await createShortUrl(req.body.longUrl);
    const shortUrl = buildShortUrl(url.short_code);

    return res
      .status(201)
      .location(shortUrl)
      .json({
        id: url.id,
        shortCode: url.short_code,
        longUrl: url.long_url,
        shortUrl,
        createdAt: url.created_at,
        expiresAt: url.expires_at,
        isActive: url.is_active,
      });
  } catch (error) {
    return next(error);
  }
}

module.exports = { shortenUrl };
