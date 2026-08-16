const { getUrlStatistics } = require("../services/stats.service");

async function getUrlStats(req, res, next) {
  const statistics = await getUrlStatistics(req.params.shortCode);

  return res.status(200).json(statistics);
}

module.exports = { getUrlStats };
