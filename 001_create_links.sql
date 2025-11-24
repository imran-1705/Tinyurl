-- migrations/001_create_links.sql
CREATE TABLE IF NOT EXISTS links (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(8) NOT NULL UNIQUE,         -- [A-Za-z0-9]{6,8}
  target TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_clicks BIGINT NOT NULL DEFAULT 0,
  last_clicked TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_links_code ON links(code);
