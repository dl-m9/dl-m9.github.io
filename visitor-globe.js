/**
 * Visitor globe renderer (globe.gl / three.js).
 *
 * Exposes window.renderVisitorGlobe(geoPoints) where geoPoints is
 *   [{ lat, lng, count, country, city }, ...].
 *
 * Style mimics ClustrMaps: continents drawn as a dotted hex-polygon layer
 * (from a vendored countries GeoJSON) over a tinted ocean sphere, with
 * accent visitor points, slow auto-rotation, and drag-to-rotate.
 * If globe.gl failed to load, the globe container is hidden and the rest of
 * the Visitors section still works.
 */
(function () {
  'use strict';

  var ACCENT = '#0066cc'; // matches --primary-color
  var LAND = 'rgba(0, 102, 204, 0.55)'; // dotted continents
  var BORDER = 'rgba(0, 64, 140, 0.85)'; // country boundary lines
  var OCEAN = '#eaf1fb'; // light academic blue sphere
  var GEOJSON_URL = 'assets/vendor/world-countries-110m.geojson';
  var instance = null;

  function clamp(n, lo, hi) {
    return Math.max(lo, Math.min(hi, n));
  }

  function sizeFor(container) {
    var w = container.clientWidth || 320;
    var width = clamp(w, 220, 420);
    var height = Math.round(width * 0.92);
    return { width: width, height: height };
  }

  window.renderVisitorGlobe = function (geoPoints) {
    var container = document.getElementById('visitor-globe');
    if (!container) return;

    if (typeof window.Globe !== 'function') {
      container.classList.add('visitor-globe--hidden');
      return;
    }

    var points = (geoPoints || []).filter(function (p) {
      return typeof p.lat === 'number' && typeof p.lng === 'number';
    });

    var maxCount = points.reduce(function (m, p) {
      return Math.max(m, Number(p.count) || 1);
    }, 1);

    container.innerHTML = '';
    var dims = sizeFor(container);

    try {
      instance = window
        .Globe()(container)
        .width(dims.width)
        .height(dims.height)
        .backgroundColor('rgba(0,0,0,0)')
        .showAtmosphere(true)
        .atmosphereColor(ACCENT)
        .atmosphereAltitude(0.18)
        .pointsData(points)
        .pointLat(function (d) {
          return d.lat;
        })
        .pointLng(function (d) {
          return d.lng;
        })
        .pointColor(function () {
          return ACCENT;
        })
        .pointAltitude(0.01) // flat discs sitting on the surface, not bars
        .pointRadius(function (d) {
          return 0.25 + 0.7 * Math.sqrt((Number(d.count) || 1) / maxCount);
        })
        .pointLabel(function (d) {
          var place = [d.city, d.country].filter(Boolean).join(', ') || 'Unknown';
          return place + ': ' + (Number(d.count) || 0);
        });

      // Tinted ocean sphere (no external bitmap texture).
      var material = instance.globeMaterial();
      if (material && material.color && material.color.set) {
        material.color.set(OCEAN);
      }

      var controls = instance.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.6;
      controls.enableZoom = false;
      controls.enablePan = false;

      instance.pointOfView({ lat: 20, lng: 0, altitude: 2.4 }, 0);

      // Dotted continents: load countries GeoJSON and add a hex-polygon layer.
      fetch(GEOJSON_URL)
        .then(function (res) {
          if (!res.ok) throw new Error('geojson ' + res.status);
          return res.json();
        })
        .then(function (geo) {
          if (!instance) return;
          var features = (geo && geo.features) || [];
          instance
            .hexPolygonsData(features)
            .hexPolygonResolution(3)
            .hexPolygonMargin(0.3)
            .hexPolygonUseDots(true)
            .hexPolygonColor(function () {
              return LAND;
            })
            // Country borders: transparent fill, accent stroke outline.
            .polygonsData(features)
            .polygonCapColor(function () {
              return 'rgba(0,0,0,0)';
            })
            .polygonSideColor(function () {
              return 'rgba(0,0,0,0)';
            })
            .polygonStrokeColor(function () {
              return BORDER;
            })
            .polygonAltitude(0.006);
        })
        .catch(function () {
          /* no continents, tinted sphere still shows */
        });

      window.addEventListener('resize', onResize);
    } catch (e) {
      container.classList.add('visitor-globe--hidden');
    }
  };

  function onResize() {
    if (!instance) return;
    var container = document.getElementById('visitor-globe');
    if (!container) return;
    var dims = sizeFor(container);
    instance.width(dims.width).height(dims.height);
  }
})();
