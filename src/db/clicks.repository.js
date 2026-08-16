const pool = require("./pool");

async function createClick({ urlId, referrer = null, ipAddress = null, userAgent = null }) {
  const query = `
    INSERT INTO clicks (url_id, referrer, ip_address, user_agent)
    VALUES ($1, $2, $3, $4)
    RETURNING id, url_id, clicked_at, referrer, ip_address, user_agent
  `;
  const values = [urlId, referrer, ipAddress, userAgent];
  const result = await pool.query(query, values);

  return result.rows[0];
}

async function countClicksByUrlId(urlId) {
  const query = `
    SELECT COUNT(*)::integer AS total_clicks
    FROM clicks
    WHERE url_id = $1
  `;
  const result = await pool.query(query, [urlId]);

  return result.rows[0];
}

async function findClicksPerDayByUrlId(urlId) {
  const query = `
    SELECT
      DATE_TRUNC('day', clicked_at) AS day,
      COUNT(*)::integer AS click_count
    FROM clicks
    WHERE url_id = $1
    GROUP BY day
    ORDER BY day ASC
  `;
  const result = await pool.query(query, [urlId]);

  return result.rows;
}

async function findReferrerCountsByUrlId(urlId) {
  const query = `
    SELECT referrer, COUNT(*)::integer AS click_count
    FROM clicks
    WHERE url_id = $1
      AND referrer IS NOT NULL
    GROUP BY referrer
    ORDER BY click_count DESC, referrer ASC
  `;
  const result = await pool.query(query, [urlId]);

  return result.rows;
}

module.exports = {
  createClick,
  countClicksByUrlId,
  findClicksPerDayByUrlId,
  findReferrerCountsByUrlId,
};
