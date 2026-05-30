# dl-m9 Visitor Analytics Worker

Self-hosted, ClustrMaps-style visitor analytics for the `dl-m9.github.io` homepage.
Runs on **Cloudflare Workers + D1**. No third-party analytics service, no raw IPs stored.

- `POST /visit` records a visit using Cloudflare edge geolocation (`request.cf`).
- `GET /stats` returns public aggregated stats consumed by the frontend globe.

Visitor identity is a salted SHA-256 of `ip|user-agent` (the salt is a secret, the raw IP is never persisted). Coordinates are coarsened to ~1 decimal (~11 km).

---

## 1. Prerequisites

- A Cloudflare account (free tier is enough).
- Node.js 18+.
- Wrangler CLI:

```bash
cd analytics-worker
npm install
npx wrangler login
```

## 2. Create the D1 database

```bash
npx wrangler d1 create visitor_analytics
```

Copy the printed `database_id` into `wrangler.toml`, replacing `REPLACE_WITH_YOUR_D1_DATABASE_ID`.

## 3. Apply the schema (migration)

```bash
# local dev database
npm run db:init:local
# production database
npm run db:init:remote
```

## 4. Configure the hashing salt (secret)

Never commit this. Set it as a Worker secret:

```bash
npx wrangler secret put HASH_SALT
# paste a long random string when prompted, e.g. output of: openssl rand -hex 32
```

## 5. Configure CORS (allowed origins)

`ALLOWED_ORIGINS` in `wrangler.toml` is a comma-separated allow-list of browser
Origins permitted to call the Worker. Production default:

```toml
[vars]
ALLOWED_ORIGINS = "https://dl-m9.github.io"
```

For local homepage development add your local origin, e.g.:

```toml
ALLOWED_ORIGINS = "https://dl-m9.github.io,http://localhost:8001"
```

The Worker echoes the matching Origin in `Access-Control-Allow-Origin` and answers
`OPTIONS` preflight requests automatically.

## 6. Deploy

```bash
npm run deploy
```

Wrangler prints the Worker URL, e.g. `https://dl-m9-analytics.<your-subdomain>.workers.dev`.

## 7. Point the frontend at the Worker

In the repo root `analytics.js`, set `API_BASE` to the deployed URL (no trailing slash):

```js
var API_BASE =
  window.VISITOR_ANALYTICS_API ||
  'https://dl-m9-analytics.<your-subdomain>.workers.dev';
```

(Alternatively define `window.VISITOR_ANALYTICS_API` in the page before `analytics.js` loads.)

## 8. Test the API

```bash
# Local dev server (uses the local D1 db)
npm run dev

# Record a visit
curl -X POST http://127.0.0.1:8787/visit

# Fetch stats
curl http://127.0.0.1:8787/stats | jq

# Production smoke test (CORS preflight + stats)
curl -i -X OPTIONS https://dl-m9-analytics.<your-subdomain>.workers.dev/visit \
  -H "Origin: https://dl-m9.github.io" -H "Access-Control-Request-Method: POST"
curl https://dl-m9-analytics.<your-subdomain>.workers.dev/stats | jq
```

> Note: in local `wrangler dev`, `request.cf` geo fields may be empty, so
> `country`/`city`/`lat`/`lng` can be null. Real geo data appears once deployed.

---

## API reference

### `POST /visit`
Records one visit. Body is ignored. Returns `201 { "ok": true }`.

### `GET /stats`
Returns aggregated public stats (cached 60s):

```json
{
  "totalVisits": 1234,
  "uniqueVisitors": 567,
  "countryCount": 42,
  "topCountries": [{ "country": "US", "count": 300 }],
  "topCities": [{ "city": "Hong Kong", "country": "HK", "count": 120 }],
  "geoPoints": [{ "lat": 22.3, "lng": 114.2, "count": 120, "country": "HK", "city": "Hong Kong" }]
}
```

## Privacy

- No raw IP addresses are stored, only a salted, non-reversible hash.
- Latitude/longitude are coarsened to ~1 decimal before storage.
- Only aggregated data is exposed via `/stats`.
