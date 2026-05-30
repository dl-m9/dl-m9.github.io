/**
 * Visitor analytics client.
 *
 * Reports a visit (once per browser session) to the analytics Worker and
 * fetches public aggregated stats to render the counters + visitor globe.
 *
 * Backend is optional: if it is unreachable, the Visitors section degrades
 * gracefully to "Visitor stats unavailable" without throwing to the page.
 *
 * Configure the API base URL below (or set window.VISITOR_ANALYTICS_API
 * before this script loads).
 */
(function () {
  'use strict';

  // ---- Configuration -------------------------------------------------------
  // Replace with your deployed Worker URL, e.g.
  //   https://dl-m9-analytics.<your-subdomain>.workers.dev
  // or a custom route. No trailing slash.
  var API_BASE =
    window.VISITOR_ANALYTICS_API ||
    'https://dl-m9-analytics.example.workers.dev';

  var SESSION_KEY = 'visitorReported';
  var TIMEOUT_MS = 8000;

  function fetchWithTimeout(url, options) {
    options = options || {};
    var controller = new AbortController();
    var timer = setTimeout(function () {
      controller.abort();
    }, TIMEOUT_MS);
    return fetch(url, Object.assign({}, options, { signal: controller.signal })).finally(
      function () {
        clearTimeout(timer);
      }
    );
  }

  function reportVisit() {
    // Count one visit per browser session to avoid inflating on reloads.
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return Promise.resolve();
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch (e) {
      // sessionStorage may be unavailable (private mode); report anyway.
    }
    return fetchWithTimeout(API_BASE + '/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
      keepalive: true,
    }).catch(function () {
      /* non-fatal */
    });
  }

  function fetchStats() {
    return fetchWithTimeout(API_BASE + '/stats', { method: 'GET' }).then(function (res) {
      if (!res.ok) throw new Error('bad status ' + res.status);
      return res.json();
    });
  }

  function fmt(n) {
    return (Number(n) || 0).toLocaleString('en-US');
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function countryName(code) {
    if (!code) return 'Unknown';
    try {
      var dn = new Intl.DisplayNames(['en'], { type: 'region' });
      return dn.of(code) || code;
    } catch (e) {
      return code;
    }
  }

  function renderStats(stats) {
    var el = document.getElementById('visitor-stats');
    if (!el) return;

    var topCountries = (stats.topCountries || [])
      .slice(0, 5)
      .map(function (c) {
        return (
          '<li><span class="vs-name">' +
          esc(countryName(c.country)) +
          '</span><span class="vs-count">' +
          fmt(c.count) +
          '</span></li>'
        );
      })
      .join('');

    var topCities = (stats.topCities || [])
      .slice(0, 5)
      .map(function (c) {
        var label = esc(c.city) + (c.country ? ', ' + esc(c.country) : '');
        return (
          '<li><span class="vs-name">' +
          label +
          '</span><span class="vs-count">' +
          fmt(c.count) +
          '</span></li>'
        );
      })
      .join('');

    el.innerHTML =
      '<div class="visitor-counters">' +
      counter(fmt(stats.totalVisits), 'Total visits') +
      counter(fmt(stats.uniqueVisitors), 'Unique visitors') +
      counter(fmt(stats.countryCount), 'Countries') +
      '</div>' +
      '<div class="visitor-tops">' +
      topBlock('Top countries', topCountries) +
      topBlock('Top cities', topCities) +
      '</div>';
  }

  function counter(value, label) {
    return (
      '<div class="visitor-counter"><span class="vc-value">' +
      value +
      '</span><span class="vc-label">' +
      label +
      '</span></div>'
    );
  }

  function topBlock(title, itemsHtml) {
    return (
      '<div class="visitor-top">' +
      '<h4>' +
      title +
      '</h4>' +
      (itemsHtml ? '<ul>' + itemsHtml + '</ul>' : '<p class="vs-empty">No data yet</p>') +
      '</div>'
    );
  }

  function showFallback() {
    var stats = document.getElementById('visitor-stats');
    if (stats) {
      stats.innerHTML = '<p class="visitor-fallback">Visitor stats unavailable</p>';
    }
    var globe = document.getElementById('visitor-globe');
    if (globe) {
      globe.classList.add('visitor-globe--hidden');
    }
  }

  // Sample data for local visual preview without a deployed backend:
  //   open the page with ?visitorDemo=1
  var DEMO_STATS = {
    totalVisits: 12840,
    uniqueVisitors: 5321,
    countryCount: 47,
    topCountries: [
      { country: 'US', count: 3120 },
      { country: 'CN', count: 2870 },
      { country: 'HK', count: 1540 },
      { country: 'GB', count: 980 },
      { country: 'DE', count: 720 },
    ],
    topCities: [
      { city: 'Hong Kong', country: 'HK', count: 1500 },
      { city: 'Beijing', country: 'CN', count: 1100 },
      { city: 'New York', country: 'US', count: 860 },
      { city: 'London', country: 'GB', count: 640 },
      { city: 'Singapore', country: 'SG', count: 410 },
    ],
    geoPoints: [
      { lat: 22.3, lng: 114.2, count: 1500, country: 'HK', city: 'Hong Kong' },
      { lat: 39.9, lng: 116.4, count: 1100, country: 'CN', city: 'Beijing' },
      { lat: 40.7, lng: -74.0, count: 860, country: 'US', city: 'New York' },
      { lat: 51.5, lng: -0.1, count: 640, country: 'GB', city: 'London' },
      { lat: 1.35, lng: 103.8, count: 410, country: 'SG', city: 'Singapore' },
      { lat: 37.8, lng: -122.4, count: 380, country: 'US', city: 'San Francisco' },
      { lat: 35.7, lng: 139.7, count: 300, country: 'JP', city: 'Tokyo' },
      { lat: 52.5, lng: 13.4, count: 250, country: 'DE', city: 'Berlin' },
      { lat: -33.9, lng: 151.2, count: 160, country: 'AU', city: 'Sydney' },
      { lat: 19.1, lng: 72.9, count: 140, country: 'IN', city: 'Mumbai' },
    ],
  };

  function render(stats) {
    renderStats(stats);
    if (typeof window.renderVisitorGlobe === 'function') {
      window.renderVisitorGlobe(stats.geoPoints || []);
    }
  }

  function init() {
    if (/[?&]visitorDemo=1\b/.test(window.location.search)) {
      render(DEMO_STATS);
      return;
    }

    // Fire-and-forget visit report; do not block stats on it.
    reportVisit();

    fetchStats()
      .then(function (stats) {
        renderStats(stats);
        if (typeof window.renderVisitorGlobe === 'function') {
          window.renderVisitorGlobe(stats.geoPoints || []);
        }
      })
      .catch(function () {
        showFallback();
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
