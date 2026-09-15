(function () {
  var C = window.CMS;
  var WA = "573215086945";
  var $ = function (id) { return document.getElementById(id); };

  // ---------- Nav: fondo al hacer scroll + menú móvil ----------
  var nav = $("nav");
  var burger = $("burger");
  var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 30); };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  burger.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  });
  document.querySelectorAll("#menu a").forEach(function (a) {
    a.addEventListener("click", function () {
      nav.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    });
  });

  // ---------- Aparición al hacer scroll ----------
  var io = "IntersectionObserver" in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" })
    : null;
  function reveal(root) {
    (root || document).querySelectorAll(".rv:not(.in)").forEach(function (el) {
      if (io) io.observe(el); else el.classList.add("in");
    });
  }
  reveal();

  // ---------- Seguimiento de clics (GA4 / Meta Pixel cuando se instalen) ----------
  function trackEvent(name) {
    if (window.gtag) window.gtag("event", name);
    if (window.fbq) window.fbq("trackCustom", name);
  }
  document.addEventListener("click", function (ev) {
    var el = ev.target.closest("[data-track]");
    if (el) trackEvent(el.dataset.track);
    var kit = ev.target.closest("[data-kit]");
    if (kit) $("f-tipo").value = "Solicitar media kit";
  });

  // ---------- Filtro de contenido ----------
  $("feed-tabs").addEventListener("click", function (ev) {
    var t = ev.target.closest(".tab");
    if (!t) return;
    var f = t.dataset.f;
    this.querySelectorAll(".tab").forEach(function (x) { x.setAttribute("aria-pressed", x === t); });
    $("feed").querySelectorAll(".reel").forEach(function (r) {
      r.hidden = f !== "all" && r.dataset.c !== f;
      if (!r.hidden) r.classList.add("in");
    });
  });

  // ---------- Formulario -> WhatsApp ----------
  var form = $("form");
  var note = $("form-note");
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var d = new FormData(form);
    var nombre = (d.get("nombre") || "").trim();
    if (!nombre) {
      note.textContent = "Escribe tu nombre para continuar.";
      $("f-nombre").focus();
      return;
    }
    var lines = ["Hola Majo ✨ te escribo desde tu página web.", "", "*Nombre:* " + nombre];
    if (d.get("empresa")) lines.push("*Empresa/marca:* " + d.get("empresa"));
    if (d.get("correo")) lines.push("*Correo:* " + d.get("correo"));
    if (d.get("telefono")) lines.push("*Teléfono:* " + d.get("telefono"));
    lines.push("*Interés:* " + d.get("tipo"));
    if (d.get("mensaje")) lines.push("", d.get("mensaje"));
    trackEvent("formulario_contacto");
    window.open(C.wa(WA, lines.join("\n")), "_blank", "noopener");
    note.textContent = "¡Listo! Se abrió WhatsApp con tu mensaje.";
  });

  // ---------- Marcas: fila en movimiento + botón para ver todas ----------
  var all = $("logos-all");
  var logoTrack = $("logo-track");
  var more = $("logos-more");
  function buildMarquee() {
    logoTrack.innerHTML = "";
    for (var r = 0; r < 2; r++) {
      Array.prototype.forEach.call(all.children, function (li) {
        var copy = li.cloneNode(true);
        if (r === 1) { copy.setAttribute("aria-hidden", "true"); copy.querySelector("img").alt = ""; }
        logoTrack.appendChild(copy);
      });
    }
    // Velocidad constante sin importar cuántas marcas haya
    logoTrack.style.animationDuration = Math.max(20, all.children.length * 2.5) + "s";
    all.hidden = more.getAttribute("aria-expanded") !== "true";
    $("logo-marquee").hidden = false;
    more.hidden = false;
  }
  more.addEventListener("click", function () {
    var open = all.hidden;
    all.hidden = !open;
    all.classList.toggle("is-open", open);
    if (open) all.classList.add("in");
    more.setAttribute("aria-expanded", open);
    more.textContent = open ? "Ver menos ↑" : "Ver todas las marcas →";
  });
  buildMarquee();

  var y = $("y");
  if (y) y.textContent = new Date().getFullYear();

  // ---------- Contenido editable desde /admin ----------
  function set(id, html) { var el = $(id); if (el) el.innerHTML = html; }
  function list(arr) { return Array.isArray(arr) ? arr : []; }
  function slug(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }
  function pad(n) { return String(n).padStart(2, "0"); }

  function render(c) {
    var ct = c.contact || {};
    WA = String(ct.whatsapp || WA).replace(/\D/g, "");
    var ig = String(ct.instagram || "").replace(/^@/, "");
    var moIg = String((c.mariaOliva || {}).instagram || "").replace(/^@/, "");

    set("hero-lede", C.rich(c.hero && c.hero.lede));

    // Sobre mí
    var ab = c.about || {};
    set("about-hello", C.esc(ab.hello));
    set("about-chip", C.esc(ab.chip));
    set("about-lede", C.rich(ab.lede));
    set("about-text", C.rich(ab.text));
    set("about-facts", list(ab.facts).map(function (f) {
      return "<li><b>" + C.esc(f.label) + "</b><span>" + C.esc(f.value) + "</span></li>";
    }).join(""));
    set("about-photos", list(ab.photos).slice(0, 7).filter(function (p) { return C.img(p.img); }).map(function (p) {
      return '<figure class="polaroid"><img src="' + C.esc(C.img(p.img)) + '" alt="' + C.esc(p.caption || "Foto de Majo") + '" loading="lazy"><figcaption>' + C.esc(p.caption) + "</figcaption></figure>";
    }).join(""));

    // Taller
    var t = c.taller || {};
    set("taller-intro", C.rich(t.intro));
    set("taller-pillars", list(t.pillars).map(function (p, i) {
      return '<article class="pillar rv in"><div class="n">' + pad(i + 1) + "</div><h3>" + C.esc(p.title) + "</h3><p>" + C.esc(p.text) + "</p></article>";
    }).join(""));
    var ev = t.event || {};
    var evEl = $("taller-event");
    evEl.hidden = !ev.show;
    if (ev.show) {
      var meta = [["Horario", ev.time], ["Lugar", ev.place], ["Cupos", ev.capacity]].filter(function (m) { return m[1]; });
      evEl.innerHTML =
        '<div><p class="spaced" style="color:var(--pink)">' + C.esc(ev.label) + "</p><h3>" + C.esc(ev.title) + '</h3><div class="event-meta">' +
        meta.map(function (m) { return "<div><b>" + m[0] + "</b>" + C.esc(m[1]) + "</div>"; }).join("") +
        "</div></div><div>" +
        (ev.price ? '<div class="price">' + C.esc(ev.price) + "<small>" + C.esc(ev.priceNote) + "</small></div>" : "") +
        (ev.link ? '<a class="btn btn-yellow" ' + C.linkAttrs(ev.link) + ' data-track="taller_inscripcion">' + C.esc(ev.button || "Reservar") + "</a>" : "") +
        "</div>";
    }

    // Servicios
    var sv = c.services || {};
    set("services-intro", C.esc(sv.intro));
    set("services-also", C.esc(sv.also));
    set("services-list", list(sv.items).map(function (s, i) {
      var link = s.link ? s.link : C.wa(WA, "Hola Majo ✨ quiero información sobre " + s.title);
      var src = C.img(s.img);
      return '<article class="item rv in">' +
        '<div class="item-img">' + (src ? '<img src="' + C.esc(src) + '" alt="' + C.esc(s.title) + '" loading="lazy">' : "") + '<span class="item-n">' + pad(i + 1) + "</span></div>" +
        '<div class="item-body"><span class="item-tag">' + C.esc(s.tag) + "</span><h3>" + C.esc(s.title) + "</h3><p>" + C.esc(s.text) + "</p>" +
        "<ul>" + list(s.bullets).filter(Boolean).map(function (b) { return "<li>" + C.esc(b) + "</li>"; }).join("") + "</ul>" +
        '<div class="item-foot"><span class="item-price">' + C.esc(s.price) + "</span>" +
        '<a class="btn btn-red" ' + C.linkAttrs(link) + ' data-track="servicio_' + slug(s.title) + '">' + C.esc(s.button || "Más info") + "</a></div></div></article>";
    }).join(""));

    // Marcas
    all.innerHTML = list(c.brands).filter(function (b) { return C.img(b.img); }).map(function (b) {
      return '<li><img src="' + C.esc(C.img(b.img)) + '" alt="' + C.esc(b.name) + '" loading="lazy"></li>';
    }).join("");
    buildMarquee();

    // Contenido
    var feed = list(c.feed).filter(function (f) { return C.img(f.img); });
    var cats = [];
    feed.forEach(function (f) { if (f.category && cats.indexOf(f.category) < 0) cats.push(f.category); });
    set("feed-tabs", '<button class="tab" aria-pressed="true" data-f="all">Todo</button>' + cats.map(function (k) {
      return '<button class="tab" aria-pressed="false" data-f="' + slug(k) + '">' + C.esc(k) + "</button>";
    }).join(""));
    set("feed", feed.map(function (f) {
      var inner = '<img src="' + C.esc(C.img(f.img)) + '" alt="' + C.esc(f.title) + '" loading="lazy"><figcaption><b>' + C.esc(f.category) + "</b>" + C.esc(f.title) + "</figcaption>";
      if (f.link) inner = '<a ' + C.linkAttrs(f.link) + ' style="display:block;height:100%">' + inner + "</a>";
      return '<figure class="reel rv in" data-c="' + slug(f.category) + '">' + inner + "</figure>";
    }).join(""));

    // María Oliva
    var mo = c.mariaOliva || {};
    set("mo-text", C.esc(mo.text));
    set("mo-stores", list(mo.stores).map(function (s) {
      return "<div><b>" + C.esc(s.city) + "</b><span>en " + (s.link ? "<a " + C.linkAttrs(s.link) + ">" + C.esc(s.name) + "</a>" : C.esc(s.name)) + "</span></div>";
    }).join(""));
    if (mo.store) $("mo-store").setAttribute("href", C.url(mo.store));
    var moIgEl = $("mo-ig");
    moIgEl.hidden = !moIg;
    if (moIg) { moIgEl.href = "https://www.instagram.com/" + encodeURIComponent(moIg) + "/"; moIgEl.textContent = "@" + moIg; }

    // Contacto, footer y botón flotante
    var contacts = [];
    if (WA) contacts.push(['<a href="' + C.wa(WA) + '" target="_blank" rel="noopener" data-track="whatsapp">', "i-wa", ct.whatsappLabel || "+" + WA]);
    if (ct.email) contacts.push(['<a href="mailto:' + C.esc(ct.email) + '" data-track="correo">', "i-mail", ct.email]);
    if (ig) contacts.push(['<a href="https://www.instagram.com/' + C.esc(ig) + '/" target="_blank" rel="noopener">', "i-ig", "@" + ig]);
    if (ct.tiktok) contacts.push(['<a href="https://www.tiktok.com/@' + C.esc(String(ct.tiktok).replace(/^@/, "")) + '" target="_blank" rel="noopener">', "i-ig", "TikTok @" + String(ct.tiktok).replace(/^@/, "")]);
    if (moIg) contacts.push(['<a href="https://www.instagram.com/' + C.esc(moIg) + '/" target="_blank" rel="noopener">', "i-bag", "@" + moIg]);
    set("contact-list", contacts.map(function (x) {
      return "<li>" + x[0] + '<svg aria-hidden="true"><use href="#' + x[1] + '"/></svg>' + C.esc(x[2]) + "</a></li>";
    }).join(""));
    var social = [];
    if (ig) social.push('<a href="https://www.instagram.com/' + C.esc(ig) + '/" target="_blank" rel="noopener" aria-label="Instagram"><svg><use href="#i-ig"/></svg></a>');
    if (WA) social.push('<a href="' + C.wa(WA) + '" target="_blank" rel="noopener" aria-label="WhatsApp"><svg><use href="#i-wa"/></svg></a>');
    if (ct.email) social.push('<a href="mailto:' + C.esc(ct.email) + '" aria-label="Correo"><svg><use href="#i-mail"/></svg></a>');
    if (mo.store) social.push('<a ' + C.linkAttrs(mo.store) + ' aria-label="Tienda María Oliva"><svg><use href="#i-bag"/></svg></a>');
    set("social", social.join(""));
    $("wa-float").href = C.wa(WA, "Hola Majo, vengo de tu página web ✨");

    reveal();
  }

  C.load().then(function (content) {
    if (content) {
      try { render(content); } catch (e) { console.error("No se pudo aplicar el contenido", e); }
    }
  });
})();
