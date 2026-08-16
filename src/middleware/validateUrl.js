function validateUrl(req, res, next) {
  if (!req.body || !Object.hasOwn(req.body, "longUrl")) {
    return res.status(400).json({
      error: "longUrl is required.",
    });
  }

  return next();
}

module.exports = { validateUrl };
