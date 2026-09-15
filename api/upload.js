import { put } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import { json, requireAdmin } from "./_auth.js";

const TYPES = { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png" };
const MAX_BYTES = 4 * 1024 * 1024;

// Recibe una imagen ya optimizada en el navegador y la guarda en Blob
export async function POST(request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const type = (request.headers.get("content-type") || "").split(";")[0].trim();
  const ext = TYPES[type];
  if (!ext) return json({ error: "Formato no permitido. Usa JPG, PNG o WEBP." }, 415);

  const data = await request.arrayBuffer();
  if (data.byteLength === 0) return json({ error: "Archivo vacío" }, 400);
  if (data.byteLength > MAX_BYTES) return json({ error: "La imagen es demasiado pesada" }, 413);

  const blob = await put(`uploads/${randomUUID()}.${ext}`, Buffer.from(data), {
    access: "public",
    contentType: type,
  });
  return json({ ok: true, url: blob.url });
}
