-- D1 schema / migration for visitor analytics.
-- Apply with:
--   wrangler d1 execute visitor_analytics --file=./schema.sql            (local dev)
--   wrangler d1 execute visitor_analytics --remote --file=./schema.sql   (production)

CREATE TABLE IF NOT EXISTS visits (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  ts            INTEGER NOT NULL,           -- unix seconds
  visitor_hash  TEXT    NOT NULL,           -- salted SHA-256(ip|ua); no raw IP stored
  country       TEXT,                       -- ISO country code (e.g. "US")
  region        TEXT,                       -- region / state
  city          TEXT,
  lat           REAL,                       -- coarsened to ~1 decimal
  lng           REAL
);

CREATE INDEX IF NOT EXISTS idx_visits_hash    ON visits (visitor_hash);
CREATE INDEX IF NOT EXISTS idx_visits_country ON visits (country);
CREATE INDEX IF NOT EXISTS idx_visits_geo     ON visits (lat, lng);
