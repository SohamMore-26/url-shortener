const { getUrlForRedirect, recordClick } = require("../services/url.service");

async function redirectToLongUrl(req, res, next) {
  try {
    const url = await getUrlForRedirect(req.params.shortCode);

    await recordClick({
      urlId: url.id,
      referrer: req.get("referer") || null,
      ipAddress: req.ip || null,
      userAgent: req.get("user-agent") || null,
    });

    return res.redirect(302, url.long_url);
  } catch (error) {
    return next(error);
  }
}

module.exports = { redirectToLongUrl };
