/**
 * Self-hosted visitor analytics Worker (ClustrMaps-style).
 *
 * Endpoints:
 *   POST /visit  -> record a visit using Cloudflare edge geo (request.cf)
 *   GET  /stats  -> public aggregated stats for the globe + counters
 *
 * Storage: Cloudflare D1 (see schema.sql).
 * Privacy: no raw IP is stored. Visitors are pseudonymised via a salted
 * SHA-256 hash (HASH_SALT secret). Coordinates are coarsened to ~1 decimal.
 */

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' };

function parseAllowedOrigins(env) {
  // Comma-separated list. Falls back to the production homepage only.
  const raw = (env.ALLOWED_ORIGINS || 'https://dl-m9.github.io').trim();
  return raw.split(',').map((o) => o.trim()).filter(Boolean);
}

function corsHeaders(request, env) {
  const allowed = parseAllowedOrigins(env);
  const origin = request.headers.get('Origin') || '';
  const ok = allowed.includes('*') || allowed.includes(origin);
  return {
    'Access-Control-Allow-Origin': ok ? (allowed.includes('*') ? '*' : origin) : allowed[0],
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function json(body, init, request, env) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { ...JSON_HEADERS, ...corsHeaders(request, env), ...((init && init.headers) || {}) },
  });
}

async function sha256Hex(input) {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function coarse(value) {
  // Coarsen a coordinate to ~1 decimal (~11 km) for privacy + point grouping.
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? Math.round(n * 10) / 10 : null;
}

async function handleVisit(request, env) {
  const cf = request.cf || {};
  const ip = request.headers.get('CF-Connecting-IP') || '';
  const ua = request.headers.get('User-Agent') || '';
  const salt = env.HASH_SALT || 'change-me';

  // Pseudonymous, stable per (ip, ua). No raw IP persisted.
  const visitorHash = await sha256Hex(`${salt}|${ip}|${ua}`);

  const country = cf.country || null;
  const region = cf.region || null;
  const city = cf.city || null;
  const lat = coarse(cf.latitude);
  const lng = coarse(cf.longitude);
  const ts = Math.floor(Date.now() / 1000);

  await env.DB.prepare(
    `INSERT INTO visits (ts, visitor_hash, country, region, city, lat, lng)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(ts, visitorHash, country, region, city, lat, lng)
    .run();

  return json({ ok: true }, { status: 201 }, request, env);
}

async function handleStats(request, env) {
  const db = env.DB;

  const totals = await db
    .prepare(
      `SELECT
         COUNT(*) AS totalVisits,
         COUNT(DISTINCT visitor_hash) AS uniqueVisitors,
         COUNT(DISTINCT country) AS countryCount
       FROM visits`
    )
    .first();

  const topCountries = (
    await db
      .prepare(
        `SELECT country, COUNT(*) AS count
         FROM visits WHERE country IS NOT NULL
         GROUP BY country ORDER BY count DESC LIMIT 10`
      )
      .all()
  ).results;

  const topCities = (
    await db
      .prepare(
        `SELECT city, country, COUNT(*) AS count
         FROM visits WHERE city IS NOT NULL
         GROUP BY city, country ORDER BY count DESC LIMIT 10`
      )
      .all()
  ).results;

  const geoPoints = (
    await db
      .prepare(
        `SELECT lat, lng,
                MAX(country) AS country,
                MAX(city) AS city,
                COUNT(*) AS count
         FROM visits WHERE lat IS NOT NULL AND lng IS NOT NULL
         GROUP BY lat, lng ORDER BY count DESC LIMIT 500`
      )
      .all()
  ).results;

  return json(
    {
      totalVisits: totals?.totalVisits || 0,
      uniqueVisitors: totals?.uniqueVisitors || 0,
      countryCount: totals?.countryCount || 0,
      topCountries,
      topCities,
      geoPoints,
    },
    { status: 200, headers: { 'Cache-Control': 'public, max-age=60' } },
    request,
    env
  );
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request, env) });
    }

    try {
      if (request.method === 'POST' && url.pathname === '/visit') {
        return await handleVisit(request, env);
      }
      if (request.method === 'GET' && url.pathname === '/stats') {
        return await handleStats(request, env);
      }
      if (request.method === 'GET' && url.pathname === '/') {
        return json({ ok: true, service: 'visitor-analytics' }, { status: 200 }, request, env);
      }
    } catch (err) {
      return json({ ok: false, error: 'internal_error' }, { status: 500 }, request, env);
    }

    return json({ ok: false, error: 'not_found' }, { status: 404 }, request, env);
  },
};
