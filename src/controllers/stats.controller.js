const { getUrlStatistics } = require("../services/stats.service");

async function getUrlStats(req, res, next) {
  try {
    const statistics = await getUrlStatistics(req.params.shortCode);

    return res.status(200).json(statistics);
  } catch (error) {
    return next(error);
  }
}

module.exports = { getUrlStats };
