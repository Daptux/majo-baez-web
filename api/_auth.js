import { createHmac, createHash, timingSafeEqual } from "node:crypto";

const COOKIE = "mjb_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 días

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET no configurado");
  return s;
}

function sign(value) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

// Compara en tiempo constante sin filtrar la longitud
export function safeEqual(a, b) {
  const ha = createHash("sha256").update(String(a)).digest();
  const hb = createHash("sha256").update(String(b)).digest();
  return timingSafeEqual(ha, hb);
}

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers },
  });
}

export function sessionCookie() {
  const exp = String(Math.floor(Date.now() / 1000) + MAX_AGE);
  return `${COOKIE}=${exp}.${sign(exp)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${MAX_AGE}`;
}

export function clearCookie() {
  return `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

export function isAuthed(request) {
  const raw = request.headers.get("cookie") || "";
  const match = raw.split(/;\s*/).find((c) => c.startsWith(COOKIE + "="));
  if (!match) return false;
  const [exp, sig] = match.slice(COOKIE.length + 1).split(".");
  if (!exp || !sig || !safeEqual(sig, sign(exp))) return false;
  return Number(exp) > Date.now() / 1000;
}

// Las escrituras deben venir del mismo sitio (defensa extra además de SameSite=Strict)
export function sameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

export function requireAdmin(request) {
  if (!sameOrigin(request)) return json({ error: "Origen no permitido" }, 403);
  if (!isAuthed(request)) return json({ error: "Sesión expirada. Vuelve a iniciar sesión." }, 401);
  return null;
}
