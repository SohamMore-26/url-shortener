-- =========================================
-- Migration: 001_init
-- Description: Create urls and clicks tables
-- =========================================

-- urls: one row per shortened link
CREATE TABLE urls (
    id          BIGSERIAL PRIMARY KEY,
    short_code  VARCHAR(10)  NOT NULL,
    long_url    TEXT         NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    expires_at  TIMESTAMPTZ,
    is_active   BOOLEAN      NOT NULL DEFAULT true,

    CONSTRAINT urls_short_code_unique UNIQUE (short_code),
    CONSTRAINT urls_long_url_valid CHECK (long_url ~ '^https?://')
);

-- Redirect lookups filter on short_code; UNIQUE already creates a B-tree index.
CREATE INDEX idx_urls_created_at ON urls (created_at DESC);


-- clicks: one row per redirect event
CREATE TABLE clicks (
    id          BIGSERIAL PRIMARY KEY,
    url_id      BIGINT       NOT NULL REFERENCES urls(id) ON DELETE CASCADE,
    clicked_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    referrer    TEXT,
    ip_address  INET,
    user_agent  TEXT
);

CREATE INDEX idx_clicks_url_id_clicked_at ON clicks (url_id, clicked_at);

CREATE INDEX idx_clicks_referrer ON clicks (url_id, referrer)
    WHERE referrer IS NOT NULL;
