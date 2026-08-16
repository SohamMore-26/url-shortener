const pool = require("./pool");

async function getNextUrlId() {
  const query = "SELECT nextval(pg_get_serial_sequence('urls', 'id')) AS id";
  const result = await pool.query(query);

  return Number(result.rows[0].id);
}

async function createUrl({ id, shortCode, longUrl, expiresAt = null }) {
  const query = `
    INSERT INTO urls (id, short_code, long_url, expires_at)
    VALUES ($1, $2, $3, $4)
    RETURNING id, short_code, long_url, created_at, expires_at, is_active
  `;
  const values = [id, shortCode, longUrl, expiresAt];
  const result = await pool.query(query, values);

  return result.rows[0];
}

async function findUrlByShortCode(shortCode) {
  const query = `
    SELECT id, short_code, long_url, created_at, expires_at, is_active
    FROM urls
    WHERE short_code = $1
  `;
  const result = await pool.query(query, [shortCode]);

  return result.rows[0] ?? null;
}

module.exports = {
  getNextUrlId,
  createUrl,
  findUrlByShortCode,
};
