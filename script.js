(function () {
  var WA = "573053331657";

  // Nav: fondo al hacer scroll + menú móvil
  var nav = document.getElementById("nav");
  var burger = document.getElementById("burger");
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

  // Aparición al hacer scroll
  var items = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  // Filtro de contenido
  var tabs = document.querySelectorAll(".tab");
  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      var f = t.dataset.f;
      tabs.forEach(function (x) { x.setAttribute("aria-pressed", x === t); });
      document.querySelectorAll(".reel").forEach(function (r) {
        r.hidden = f !== "all" && r.dataset.c !== f;
        if (!r.hidden) r.classList.add("in");
      });
    });
  });

  // "Pedir media kit" preselecciona la opción del formulario
  var tipo = document.getElementById("f-tipo");
  document.querySelectorAll("[data-kit]").forEach(function (a) {
    a.addEventListener("click", function () { tipo.value = "Solicitar media kit"; });
  });

  // Formulario -> WhatsApp
  var form = document.getElementById("form");
  var note = document.getElementById("form-note");
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var d = new FormData(form);
    var nombre = (d.get("nombre") || "").trim();
    if (!nombre) {
      note.textContent = "Escribe tu nombre para continuar.";
      document.getElementById("f-nombre").focus();
      return;
    }
    var lines = ["Hola Majo ✨ te escribo desde tu página web.", "", "*Nombre:* " + nombre];
    if (d.get("empresa")) lines.push("*Empresa/marca:* " + d.get("empresa"));
    if (d.get("correo")) lines.push("*Correo:* " + d.get("correo"));
    if (d.get("telefono")) lines.push("*Teléfono:* " + d.get("telefono"));
    lines.push("*Interés:* " + d.get("tipo"));
    if (d.get("mensaje")) lines.push("", d.get("mensaje"));
    var text = lines.join("\n");
    track("formulario_contacto");
    window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(text), "_blank", "noopener");
    note.textContent = "¡Listo! Se abrió WhatsApp con tu mensaje.";
  });

  // Seguimiento de clics (GA4 / Meta Pixel cuando se instalen)
  function track(name) {
    if (window.gtag) window.gtag("event", name);
    if (window.fbq) window.fbq("trackCustom", name);
  }
  document.querySelectorAll("[data-track]").forEach(function (el) {
    el.addEventListener("click", function () { track(el.dataset.track); });
  });

  var y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();
})();
