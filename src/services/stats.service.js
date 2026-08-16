const clicksRepository = require("../db/clicks.repository");
const urlsRepository = require("../db/urls.repository");
const { NotFoundError } = require("../utils/errors");
const { validateShortCode } = require("./url.service");

async function getUrlStatistics(shortCode) {
  const validatedShortCode = validateShortCode(shortCode);
  const url = await urlsRepository.findUrlByShortCode(validatedShortCode);

  if (!url) {
    throw new NotFoundError("Short URL was not found.");
  }

  const [totalClicks, clicksByDay, referrers] = await Promise.all([
    clicksRepository.countClicksByUrlId(url.id),
    clicksRepository.findClicksPerDayByUrlId(url.id),
    clicksRepository.findReferrerCountsByUrlId(url.id),
  ]);

  return {
    url: {
      shortCode: url.short_code,
      longUrl: url.long_url,
      createdAt: url.created_at,
      expiresAt: url.expires_at,
      isActive: url.is_active,
    },
    totalClicks: totalClicks.total_clicks,
    clicksByDay: clicksByDay.map((row) => ({
      day: row.day,
      clickCount: row.click_count,
    })),
    referrers: referrers.map((row) => ({
      referrer: row.referrer,
      clickCount: row.click_count,
    })),
  };
}

module.exports = { getUrlStatistics };
