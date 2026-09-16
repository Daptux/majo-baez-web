// Genera las páginas del sitio a partir de src/layout.html + src/parts/*.html
// Uso: node build.js
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const layout = read("src/layout.html");

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/sobre-mi", label: "Sobre mí" },
  { href: "/servicios", label: "Servicios" },
  { href: "/taller", label: "Taller" },
  { href: "/maria-oliva", label: "María Oliva" },
];

// Las anclas de la versión de una sola página pasan a ser páginas
const LINKS = {
  "#inicio": "/",
  "#sobre-mi": "/sobre-mi",
  "#servicios": "/servicios",
  "#taller": "/taller",
  "#marcas": "/servicios",
  "#contenido": "/sobre-mi",
  "#marca-personal": "/taller",
  "#maria-oliva": "/maria-oliva",
  "#contacto": "/contacto",
};

const PAGES = [
  { slug: "", title: "Majo Baez · Crea con estrategia",
    desc: "María José Báez — creadora de contenido, consultora de marca personal y parte de María Oliva. Contenido con intención desde Villavicencio.",
    parts: ["hero", "marquee", "gate", "marcas", "hablemos"], preload: true },
  { slug: "sobre-mi", title: "Sobre mí · Majo Baez",
    desc: "Quién es Majo Baez: una rola que se cree llanera, creadora de contenido sobre marca personal, lifestyle, moda y cultura llanera.",
    parts: ["sobre-mi", "contenido", "hablemos"] },
  { slug: "servicios", title: "Servicios · Majo Baez",
    desc: "Consultoría de marca, consultoría de marca personal, taller Crea con estrategia y pauta digital. Marcas con las que ha trabajado Majo Baez.",
    parts: ["servicios", "marcas"] },
  { slug: "taller", title: "Taller Crea con estrategia · Majo Baez",
    desc: "Taller presencial para crear contenido con intención: estrategia, identidad y contenido. Próxima fecha en Villavicencio.",
    parts: ["taller", "manifiesto"] },
  { slug: "maria-oliva", title: "María Oliva · Majo Baez",
    desc: "María Oliva: moda que celebra la cultura colombiana y lleva el Llano en el corazón. Tienda online y puntos de venta.",
    parts: ["maria-oliva", "hablemos"] },
  { slug: "contacto", title: "Contacto · Majo Baez",
    desc: "Escríbele a Majo Baez por WhatsApp o correo para colaboraciones con marcas, consultorías, el taller o tu media kit.",
    parts: ["contacto"] },
];

function read(p) {
  return fs.readFileSync(path.join(root, p), "utf8").split("\r\n").join("\n");
}

function nav(current) {
  return NAV.map(function (n) {
    const active = n.href === current ? ' class="active" aria-current="page"' : "";
    return '      <li><a href="' + n.href + '"' + active + ">" + n.label + "</a></li>";
  }).join("\n");
}

function fixLinks(html) {
  return html.replace(/href="(#[a-z-]+)"/g, function (all, hash) {
    return LINKS[hash] ? 'href="' + LINKS[hash] + '"' : all;
  });
}

let count = 0;
PAGES.forEach(function (p) {
  const current = "/" + p.slug;
  const content = p.parts.map(function (f) { return fixLinks(read("src/parts/" + f + ".html")); }).join("\n\n");
  const html = layout
    .replace(/{{TITLE}}/g, p.title)
    .replace(/{{DESC}}/g, p.desc)
    .replace("{{CANONICAL}}", p.slug ? current : "/")
    .replace("{{PRELOAD}}", p.preload ? '<link rel="preload" as="image" href="/img/majo-retrato.webp">\n' : "")
    .replace("{{NAV}}", nav(p.slug ? current : "/"))
    .replace("{{CONTENT}}", content);
  const out = p.slug ? path.join(root, p.slug, "index.html") : path.join(root, "index.html");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  console.log("→", p.slug || "/", (html.length / 1024).toFixed(1) + " KB");
  count++;
});
console.log(count + " páginas generadas");
