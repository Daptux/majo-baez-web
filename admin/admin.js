(function () {
  "use strict";

  // ---------- Qué se puede editar ----------
  var URL_HINT = "Pega el enlace completo, por ejemplo https://…";
  var SECTIONS = [
    { key: "contact", icon: "📞", title: "Contacto", desc: "WhatsApp, correo y redes", fields: [
      { k: "whatsapp", label: "Número de WhatsApp", hint: "Solo números, empezando por 57. Ej: 573215086945" },
      { k: "whatsappLabel", label: "Cómo se muestra el número", hint: "Ej: +57 321 508 6945" },
      { k: "email", label: "Correo", type: "email" },
      { k: "instagram", label: "Usuario de Instagram", hint: "Sin @" },
      { k: "tiktok", label: "Usuario de TikTok (opcional)", hint: "Sin @. Déjalo vacío si no quieres mostrarlo" }
    ]},
    { key: "hero", icon: "✨", title: "Inicio", desc: "La frase de presentación", fields: [
      { k: "lede", label: "Frase de presentación", type: "textarea" }
    ]},
    { key: "about", icon: "👋", title: "Sobre mí", desc: "Tu historia, datos y fotos", fields: [
      { k: "hello", label: "Saludo" },
      { k: "chip", label: "Palabra destacada (etiqueta roja)" },
      { k: "lede", label: "Primer párrafo", type: "textarea" },
      { k: "text", label: "Segundo párrafo", type: "textarea" },
      { k: "facts", label: "Datos", type: "list", add: "Agregar dato", titleKey: "label",
        item: [{ k: "label", label: "Título (ej: Base)" }, { k: "value", label: "Texto" }] },
      { k: "photos", label: "Fotos tipo polaroid", type: "list", max: 7, add: "Agregar foto", titleKey: "caption", thumbKey: "img",
        item: [{ k: "img", label: "Foto", type: "image", size: 900 }, { k: "caption", label: "Texto debajo de la foto" }] }
    ]},
    { key: "taller", icon: "🎤", title: "Taller Crea con estrategia", desc: "Descripción, pilares y próxima fecha", fields: [
      { k: "intro", label: "Descripción del taller", type: "textarea" },
      { k: "event", label: "Próxima fecha", type: "group", fields: [
        { k: "show", label: "Mostrar la próxima fecha en la página", type: "check" },
        { k: "label", label: "Texto pequeño superior", hint: "Ej: Próxima fecha · cupos limitados" },
        { k: "title", label: "Ciudad y fecha", hint: "Ej: Villavicencio · 3 de octubre" },
        { k: "time", label: "Horario" },
        { k: "place", label: "Lugar" },
        { k: "capacity", label: "Cupos" },
        { k: "price", label: "Precio", hint: "Ej: $350.000" },
        { k: "priceNote", label: "Nota del precio", hint: "Ej: COP por persona" },
        { k: "button", label: "Texto del botón" },
        { k: "link", label: "Link de inscripción", type: "url", hint: URL_HINT }
      ]},
      { k: "pillars", label: "Pilares", type: "list", add: "Agregar pilar", titleKey: "title",
        item: [{ k: "title", label: "Título" }, { k: "text", label: "Texto", type: "textarea" }] }
    ]},
    { key: "services", icon: "🛍️", title: "Servicios", desc: "Consultorías, taller, pauta…", fields: [
      { k: "intro", label: "Frase debajo del título" },
      { k: "items", label: "Servicios", type: "list", add: "Agregar servicio", titleKey: "title", thumbKey: "img",
        item: [
          { k: "img", label: "Foto", type: "image", size: 1000 },
          { k: "title", label: "Nombre del servicio" },
          { k: "tag", label: "Etiqueta pequeña", hint: "Ej: Para marcas y negocios" },
          { k: "text", label: "Descripción", type: "textarea" },
          { k: "bullets", label: "Qué incluye", type: "lines", hint: "Una cosa por renglón" },
          { k: "price", label: "Precio", hint: "Ej: $350.000 COP · A la medida · Mensual" },
          { k: "button", label: "Texto del botón", hint: "Ej: Agendar, Reservar, Cotizar" },
          { k: "link", label: "Link del botón (opcional)", type: "url", hint: "Si lo dejas vacío, el botón abre tu WhatsApp con un mensaje sobre este servicio" }
        ] },
      { k: "also", label: "Texto del recuadro “También”", type: "textarea" }
    ]},
    { key: "brands", icon: "🤝", title: "Marcas", desc: "Logos de marcas con las que has trabajado", list: {
      add: "Agregar marca", titleKey: "name", thumbKey: "img", contain: true,
      item: [{ k: "img", label: "Logo", type: "image", size: 600, hint: "Ideal: logo con fondo blanco o transparente" }, { k: "name", label: "Nombre de la marca" }]
    }},
    { key: "feed", icon: "🎬", title: "Contenido", desc: "Tus videos y publicaciones destacadas", list: {
      add: "Agregar contenido", titleKey: "title", thumbKey: "img",
      item: [
        { k: "img", label: "Portada (vertical)", type: "image", size: 900 },
        { k: "title", label: "Título" },
        { k: "category", label: "Categoría", hint: "Ej: Lifestyle, Llano, Viajes, Consultoría. Los filtros se crean solos" },
        { k: "link", label: "Link al video (opcional)", type: "url", hint: "Ej: link del reel en Instagram o TikTok" }
      ]
    }},
    { key: "mariaOliva", icon: "🦫", title: "María Oliva", desc: "Texto, tienda y puntos de venta", fields: [
      { k: "text", label: "Descripción", type: "textarea" },
      { k: "store", label: "Link de la tienda online", type: "url", hint: URL_HINT },
      { k: "instagram", label: "Instagram de María Oliva", hint: "Sin @" },
      { k: "stores", label: "Puntos de venta", type: "list", add: "Agregar punto de venta", titleKey: "city",
        item: [{ k: "city", label: "Ciudad" }, { k: "name", label: "Nombre de la tienda", hint: "Ej: @coconutvaqueria" }, { k: "link", label: "Link (opcional)", type: "url" }] }
    ]},
    { key: "links", icon: "🔗", title: "Links (link in bio)", desc: "Los botones de majo-baez-web.vercel.app/links", list: {
      add: "Agregar link", titleKey: "text",
      item: [
        { k: "text", label: "Texto del botón" },
        { k: "sub", label: "Texto pequeño (opcional)", hint: "Ej: 3 de octubre · Villavicencio" },
        { k: "url", label: "Link", type: "url", hint: "Enlace completo (https://…) o una sección de tu página, ej: /#servicios" },
        { k: "style", label: "Estilo", type: "select", options: [["normal", "Blanco"], ["destacado", "Rojo (destacado)"], ["verde", "Verde (María Oliva)"]] }
      ]
    }}
  ];

  // ---------- Utilidades ----------
  var $ = function (id) { return document.getElementById(id); };
  var data = null;
  var dirty = false;
  var uploading = 0;

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (a) {
      if (a === "text") n.textContent = attrs[a];
      else if (a === "on") Object.keys(attrs.on).forEach(function (e) { n.addEventListener(e, attrs.on[e]); });
      else if (attrs[a] !== undefined && attrs[a] !== null && attrs[a] !== false) n.setAttribute(a, attrs[a] === true ? "" : attrs[a]);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }

  function toast(msg, bad) {
    var t = $("toast");
    t.textContent = msg;
    t.classList.toggle("bad", !!bad);
    t.hidden = false;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(function () { t.hidden = true; }, bad ? 6000 : 3500);
  }

  function setDirty(v) {
    dirty = v;
    var s = $("status");
    s.textContent = v ? "Tienes cambios sin guardar" : "Todo guardado";
    s.className = "status" + (v ? " dirty" : "");
  }

  function blank(fields) {
    var o = {};
    fields.forEach(function (f) {
      o[f.k] = f.type === "lines" ? [] : f.type === "check" ? false : f.type === "select" ? f.options[0][0] : "";
    });
    return o;
  }

  // Completa lo guardado con la estructura base (por si se agregan campos nuevos)
  function merge(base, saved) {
    if (Array.isArray(base)) return Array.isArray(saved) ? saved : base;
    if (base && typeof base === "object") {
      var out = {};
      Object.keys(base).forEach(function (k) { out[k] = merge(base[k], saved ? saved[k] : undefined); });
      Object.keys(saved || {}).forEach(function (k) { if (!(k in out)) out[k] = saved[k]; });
      return out;
    }
    return saved === undefined ? base : saved;
  }

  function api(path, opts) {
    opts = opts || {};
    opts.credentials = "same-origin";
    return fetch(path, opts).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (body) {
        if (r.status === 401 && path !== "/api/login") { showLogin("Tu sesión expiró. Vuelve a entrar; tus cambios siguen aquí."); }
        if (!r.ok) throw new Error(body.error || "Algo salió mal (" + r.status + ")");
        return body;
      });
    });
  }

  // ---------- Imágenes: se reducen en el celular antes de subirlas ----------
  function shrink(file, max) {
    return new Promise(function (resolve, reject) {
      if (!/^image\//.test(file.type)) return reject(new Error("Ese archivo no es una imagen"));
      var url = URL.createObjectURL(file);
      var im = new Image();
      im.onload = function () {
        var s = Math.min(1, max / Math.max(im.naturalWidth, im.naturalHeight));
        var c = document.createElement("canvas");
        c.width = Math.round(im.naturalWidth * s);
        c.height = Math.round(im.naturalHeight * s);
        c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob(function (b) {
          if (b && b.type === "image/webp") return resolve(b);
          // Safari antiguo no genera webp: usa PNG si hay transparencia posible, si no JPG
          c.toBlob(function (b2) { b2 ? resolve(b2) : reject(new Error("No se pudo procesar la imagen")); },
            /png/.test(file.type) ? "image/png" : "image/jpeg", 0.86);
        }, "image/webp", 0.86);
      };
      im.onerror = function () { URL.revokeObjectURL(url); reject(new Error("No se pudo leer la imagen. Prueba con JPG o PNG.")); };
      im.src = url;
    });
  }

  function uploadImage(file, max) {
    return shrink(file, max).then(function (blob) {
      return api("/api/upload", { method: "POST", headers: { "Content-Type": blob.type }, body: blob });
    }).then(function (r) { return r.url; });
  }

  // ---------- Campos ----------
  function field(obj, f, onChange) {
    var id = "f" + Math.random().toString(36).slice(2, 9);
    var change = function (v) { obj[f.k] = v; setDirty(true); if (onChange) onChange(); };
    var hint = f.hint ? el("small", { text: f.hint }) : null;

    if (f.type === "check") {
      var cb = el("input", { type: "checkbox", id: id, on: { change: function () { change(cb.checked); } } });
      cb.checked = !!obj[f.k];
      return el("label", { class: "check", for: id }, [cb, f.label]);
    }

    if (f.type === "group") {
      obj[f.k] = obj[f.k] || {};
      return el("div", { class: "group" }, [el("h4", { text: f.label })].concat(f.fields.map(function (sf) { return field(obj[f.k], sf); })));
    }

    if (f.type === "list") return listEditor(obj, f.k, f);

    if (f.type === "image") {
      var preview = el("div", { class: "preview" });
      var paint = function () {
        preview.textContent = obj[f.k] ? "" : "Sin imagen";
        preview.style.backgroundImage = obj[f.k] ? 'url("' + String(obj[f.k]).replace(/"/g, "%22") + '")' : "none";
      };
      paint();
      var label = el("span", { text: obj[f.k] ? "Cambiar imagen" : "Subir imagen" });
      var input = el("input", { type: "file", accept: "image/*", "aria-label": f.label });
      var btn = el("span", { class: "btn small line upl" }, [label, input]);
      input.addEventListener("change", function () {
        var file = input.files && input.files[0];
        if (!file) return;
        uploading++;
        label.textContent = "Subiendo…";
        uploadImage(file, f.size || 1200).then(function (u) {
          change(u);
          paint();
          toast("Imagen lista. Recuerda guardar los cambios.");
        }).catch(function (e) {
          toast(e.message, true);
        }).then(function () {
          uploading--;
          label.textContent = obj[f.k] ? "Cambiar imagen" : "Subir imagen";
          input.value = "";
        });
      });
      return el("div", { class: "field" }, [el("span", { text: f.label }), el("div", { class: "img-field" }, [preview, btn]), hint]);
    }

    var input2;
    if (f.type === "textarea" || f.type === "lines") {
      input2 = el("textarea", { id: id, rows: f.type === "lines" ? 5 : 4 });
      input2.value = f.type === "lines" ? (obj[f.k] || []).join("\n") : obj[f.k] || "";
      input2.addEventListener("input", function () {
        change(f.type === "lines" ? input2.value.split("\n").map(function (s) { return s.trim(); }).filter(Boolean) : input2.value);
      });
    } else if (f.type === "select") {
      input2 = el("select", { id: id }, f.options.map(function (o) { return el("option", { value: o[0], text: o[1] }); }));
      input2.value = obj[f.k] || f.options[0][0];
      input2.addEventListener("change", function () { change(input2.value); });
    } else {
      input2 = el("input", {
        id: id,
        type: f.type === "email" ? "email" : f.type === "url" ? "url" : "text",
        inputmode: f.type === "url" ? "url" : null,
        autocapitalize: f.type === "url" || f.type === "email" ? "none" : null,
        spellcheck: f.type === "url" || f.type === "email" ? "false" : null
      });
      input2.value = obj[f.k] || "";
      input2.addEventListener("input", function () { change(input2.value.trim() === "" ? "" : input2.value); });
    }
    return el("label", { class: "field", for: id }, [el("span", { text: f.label }), input2, hint]);
  }

  function listEditor(parent, key, cfg) {
    if (!Array.isArray(parent[key])) parent[key] = [];
    var arr = parent[key];
    var wrap = el("div", { class: "list" });
    var head = el("h4", {}, [cfg.label || "", el("span", { class: "count" })]);
    var items = el("div", { class: "items" });
    var addBtn = el("button", { type: "button", class: "btn small line", text: "+ " + (cfg.add || "Agregar") });
    if (cfg.label) wrap.appendChild(head);
    wrap.appendChild(items);
    wrap.appendChild(addBtn);

    function draw(openIndex) {
      items.innerHTML = "";
      head.querySelector(".count").textContent = "(" + arr.length + (cfg.max ? " de " + cfg.max : "") + ")";
      addBtn.hidden = !!(cfg.max && arr.length >= cfg.max);
      arr.forEach(function (it, i) {
        var body = el("div", { class: "item-body" });
        var name = el("div", { class: "name" });
        var thumb = cfg.thumbKey ? el("img", { class: "thumb" + (cfg.contain ? " contain" : ""), alt: "" }) : null;
        var paintHead = function () {
          var t = it[cfg.titleKey];
          name.textContent = "";
          if (t) name.textContent = t; else name.appendChild(el("em", { text: "Sin título" }));
          if (thumb) { if (it[cfg.thumbKey]) thumb.src = it[cfg.thumbKey]; else thumb.removeAttribute("src"); }
        };
        cfg.item.forEach(function (f) { body.appendChild(field(it, f, paintHead)); });
        paintHead();
        body.hidden = i !== openIndex;
        var toggle = function () { body.hidden = !body.hidden; };
        name.addEventListener("click", toggle);
        if (thumb) thumb.addEventListener("click", toggle);

        var up = el("button", { type: "button", class: "icon-btn", "aria-label": "Subir", title: "Mover arriba", text: "↑", disabled: i === 0 });
        var down = el("button", { type: "button", class: "icon-btn", "aria-label": "Bajar", title: "Mover abajo", text: "↓", disabled: i === arr.length - 1 });
        var edit = el("button", { type: "button", class: "icon-btn edit", "aria-label": "Editar", title: "Editar", text: "✎" });
        var del = el("button", { type: "button", class: "icon-btn del", "aria-label": "Eliminar", title: "Eliminar", text: "🗑" });
        up.addEventListener("click", function () { arr.splice(i - 1, 0, arr.splice(i, 1)[0]); setDirty(true); draw(); });
        down.addEventListener("click", function () { arr.splice(i + 1, 0, arr.splice(i, 1)[0]); setDirty(true); draw(); });
        edit.addEventListener("click", toggle);
        del.addEventListener("click", function () {
          if (!confirm("¿Eliminar “" + (it[cfg.titleKey] || "este elemento") + "”?")) return;
          arr.splice(i, 1); setDirty(true); draw();
        });
        items.appendChild(el("div", { class: "item" }, [el("div", { class: "item-head" }, [thumb, name, up, down, edit, del]), body]));
      });
    }
    addBtn.addEventListener("click", function () {
      arr.push(blank(cfg.item));
      setDirty(true);
      draw(arr.length - 1);
      var last = items.lastElementChild;
      if (last) last.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    draw();
    return wrap;
  }

  function buildEditor() {
    var root = $("editor");
    root.innerHTML = "";
    SECTIONS.forEach(function (s) {
      var body = el("div", { class: "sec-body" });
      if (s.list) {
        body.appendChild(listEditor(data, s.key, s.list));
      } else {
        data[s.key] = data[s.key] || {};
        s.fields.forEach(function (f) { body.appendChild(field(data[s.key], f)); });
      }
      root.appendChild(el("details", { class: "sec" }, [
        el("summary", {}, [el("span", { class: "ico", text: s.icon }), el("span", { class: "t" }, [s.title, el("span", { class: "d", text: s.desc })])]),
        body
      ]));
    });
  }

  // ---------- Flujo ----------
  function showLogin(msg) {
    $("login").hidden = false;
    $("app").hidden = !data;
    if (data) $("app").hidden = true;
    $("login-error").textContent = msg || "";
  }

  function start() {
    $("login").hidden = true;
    $("app").hidden = false;
    if (data) return;
    Promise.all([
      fetch("/data/content.json", { cache: "no-store" }).then(function (r) { return r.json(); }),
      api("/api/content?t=" + Date.now())
    ]).then(function (res) {
      data = merge(res[0], res[1].saved ? res[1].content : null);
      buildEditor();
      setDirty(false);
    }).catch(function (e) {
      $("editor").innerHTML = "";
      $("editor").appendChild(el("p", { class: "error", text: "No se pudo cargar el contenido: " + e.message }));
    });
  }

  $("login-form").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var fd = new FormData(ev.target);
    var btn = ev.target.querySelector("button");
    btn.disabled = true;
    $("login-error").textContent = "";
    api("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: fd.get("user"), password: fd.get("password") })
    }).then(function () {
      ev.target.reset();
      start();
    }).catch(function (e) {
      $("login-error").textContent = e.message;
    }).then(function () { btn.disabled = false; });
  });

  $("save").addEventListener("click", function () {
    if (uploading) return toast("Espera a que termine de subir la imagen.", true);
    var btn = $("save");
    btn.disabled = true;
    btn.textContent = "Guardando…";
    api("/api/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
      .then(function () {
        setDirty(false);
        $("status").textContent = "¡Guardado! Ya se ve en tu página";
        $("status").className = "status ok";
        toast("¡Listo! Tus cambios ya están publicados ✨");
      })
      .catch(function (e) { toast("No se guardó: " + e.message, true); })
      .then(function () { btn.disabled = false; btn.textContent = "Guardar cambios"; });
  });

  $("logout").addEventListener("click", function () {
    if (dirty && !confirm("Tienes cambios sin guardar. ¿Salir de todas formas?")) return;
    fetch("/api/login", { method: "DELETE", credentials: "same-origin" }).then(function () {
      dirty = false;
      data = null;
      $("editor").innerHTML = "";
      showLogin();
      $("app").hidden = true;
    });
  });

  window.addEventListener("beforeunload", function (e) {
    if (dirty) { e.preventDefault(); e.returnValue = ""; }
  });

  fetch("/api/login", { credentials: "same-origin" })
    .then(function (r) { return r.json(); })
    .then(function (s) { if (s.ok) start(); else showLogin(); })
    .catch(function () { showLogin(); });
})();
