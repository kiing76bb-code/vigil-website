/* ============================================================
   VIGIL — browser-side Supabase data layer (no framework).
   Uses the PUBLIC anon key (same one scenario 5364208 uses) — safe in the browser.
   Exposes window.VIGIL with fetch + format helpers.
   ============================================================ */
(function () {
  "use strict";

  var SUPABASE_URL = "https://vqjrwdnffqzwhzjswvic.supabase.co";
  // Public anon key — read-only by RLS policy; safe to ship to the browser.
  var ANON =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxanJ3ZG5mZnF6d2h6anN3dmljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyMDQ5MDIsImV4cCI6MjA5Njc4MDkwMn0.Rzpn_wtzWMCsGMVQlNnbtBuHPf-afeamkM0a_guKwsE";

  var AMAZON_TAG = "vigildrop-20";

  function sb(path) {
    return fetch(SUPABASE_URL + "/rest/v1/" + path, {
      headers: { apikey: ANON, Authorization: "Bearer " + ANON },
    }).then(function (r) {
      if (!r.ok) throw new Error("Supabase " + r.status);
      return r.json();
    });
  }

  function getProducts() {
    return sb("products?select=*").catch(function () { return []; });
  }
  // Exclude the -1 "not found" sentinel rows written by Branch B.
  function getPriceHistory() {
    return sb(
      "price_history?select=product_id,recorded_price,recorded_at&recorded_price=gt.-1&order=recorded_at.asc"
    ).catch(function () { return []; });
  }

  function money(n) {
    if (n === null || n === undefined || isNaN(Number(n))) return "—";
    return "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function pctDrop(from, to) {
    if (!from || !to || from <= 0) return null;
    return Math.round(((from - to) / from) * 100);
  }
  function timeAgo(iso) {
    if (!iso) return "—";
    var then = new Date(iso).getTime();
    if (isNaN(then)) return "—";
    var s = Math.max(0, Math.floor((Date.now() - then) / 1000));
    if (s < 60) return s + "s ago";
    var m = Math.floor(s / 60); if (m < 60) return m + "m ago";
    var h = Math.floor(m / 60); if (h < 24) return h + "h ago";
    return Math.floor(h / 24) + "d ago";
  }
  function addAmazonTag(url, tag) {
    tag = tag || AMAZON_TAG;
    try {
      var u = new URL(url);
      if (!/amazon\./i.test(u.hostname)) return url;
      u.searchParams.set("tag", tag);
      return u.toString();
    } catch (e) { return url; }
  }
  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function sparkPoints(values, w, h, pad) {
    w = w || 120; h = h || 32; pad = pad || 2;
    if (!values.length) return "";
    if (values.length === 1) { var y = h / 2; return pad + "," + y + " " + (w - pad) + "," + y; }
    var min = Math.min.apply(null, values), max = Math.max.apply(null, values);
    var span = (max - min) || 1, stepX = (w - pad * 2) / (values.length - 1);
    return values.map(function (v, i) {
      var x = pad + i * stepX;
      var yy = h - pad - ((v - min) / span) * (h - pad * 2);
      return x.toFixed(1) + "," + yy.toFixed(1);
    }).join(" ");
  }
  function seriesByProduct(history) {
    var map = {};
    history.forEach(function (p) {
      var k = String(p.product_id);
      (map[k] = map[k] || []).push(p);
    });
    return map;
  }

  window.VIGIL = {
    AMAZON_TAG: AMAZON_TAG,
    getProducts: getProducts,
    getPriceHistory: getPriceHistory,
    seriesByProduct: seriesByProduct,
    money: money, pctDrop: pctDrop, timeAgo: timeAgo,
    addAmazonTag: addAmazonTag, escapeHtml: escapeHtml, sparkPoints: sparkPoints,
  };
})();
