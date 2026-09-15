import { head, put, BlobNotFoundError } from "@vercel/blob";
import { json, requireAdmin } from "./_auth.js";

const PATH = "content/site.json";
const MAX_BYTES = 300 * 1024;

// Contenido guardado desde el panel. Si nunca se ha guardado, responde saved:false
// y la página usa lo que ya trae el HTML.
export async function GET() {
  try {
    const meta = await head(PATH);
    const res = await fetch(`${meta.url}?v=${new Date(meta.uploadedAt).getTime()}`, { cache: "no-store" });
    if (!res.ok) throw new Error("fetch " + res.status);
    const content = await res.json();
    return json({ saved: true, updatedAt: meta.uploadedAt, content }, 200, {
      "Cache-Control": "public, max-age=0, s-maxage=5, stale-while-revalidate=30",
    });
  } catch (err) {
    if (err instanceof BlobNotFoundError) {
      return json({ saved: false }, 200, { "Cache-Control": "public, max-age=0, s-maxage=5" });
    }
    console.error("content GET", err);
    return json({ saved: false, error: "No se pudo leer el contenido" }, 200, { "Cache-Control": "no-store" });
  }
}

export async function PUT(request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const text = await request.text();
  if (text.length > MAX_BYTES) return json({ error: "El contenido es demasiado grande" }, 413);
  let content;
  try {
    content = JSON.parse(text);
  } catch {
    return json({ error: "Contenido inválido" }, 400);
  }
  const required = ["contact", "hero", "about", "taller", "services", "brands", "feed", "mariaOliva", "links"];
  if (!content || typeof content !== "object" || Array.isArray(content) || required.some((k) => !(k in content))) {
    return json({ error: "Faltan secciones en el contenido" }, 400);
  }

  const body = JSON.stringify(content);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  // Copia de seguridad de cada guardado, por si hay que recuperar una versión
  await put(`content/history/${stamp}.json`, body, { access: "public", contentType: "application/json", addRandomSuffix: true });
  const saved = await put(PATH, body, {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
  return json({ ok: true, url: saved.url });
}
