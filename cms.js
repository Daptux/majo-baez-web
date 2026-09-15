// Utilidades compartidas para pintar el contenido editable desde /admin
(function () {
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // Texto con **negrilla**
  function rich(s) {
    return esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  }

  function url(u) {
    u = String(u || "").trim();
    if (/^(https?:|mailto:|tel:)/i.test(u) || /^[\/#]/.test(u)) return u;
    if (/^www\./i.test(u)) return "https://" + u;
    return "#";
  }

  function img(u) {
    u = String(u || "").trim();
    if (/^\/img\//.test(u)) return u;
    if (/^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i.test(u)) return u;
    return "";
  }

  function isExternal(u) {
    return /^https?:/i.test(u);
  }

  function linkAttrs(u) {
    var safe = url(u);
    return 'href="' + esc(safe) + '"' + (isExternal(safe) ? ' target="_blank" rel="noopener"' : "");
  }

  function wa(number, text) {
    var n = String(number || "").replace(/\D/g, "");
    return "https://wa.me/" + n + (text ? "?text=" + encodeURIComponent(text) : "");
  }

  function load() {
    return fetch("/api/content", { headers: { Accept: "application/json" } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { return d && d.saved && d.content ? d.content : null; })
      .catch(function () { return null; });
  }

  window.CMS = { esc: esc, rich: rich, url: url, img: img, linkAttrs: linkAttrs, wa: wa, load: load };
})();
