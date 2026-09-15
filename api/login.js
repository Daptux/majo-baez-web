import { json, safeEqual, sameOrigin, sessionCookie, clearCookie, isAuthed } from "./_auth.js";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: "Origen no permitido" }, 403);
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Solicitud inválida" }, 400);
  }
  const user = String(body?.user || "").trim().toLowerCase();
  const pass = String(body?.password || "");
  const okUser = safeEqual(user, String(process.env.ADMIN_USER || "").toLowerCase());
  const okPass = safeEqual(pass, String(process.env.ADMIN_PASSWORD || ""));
  if (!process.env.ADMIN_PASSWORD || !(okUser && okPass)) {
    await wait(900); // frena intentos repetidos
    return json({ error: "Usuario o contraseña incorrectos" }, 401);
  }
  return json({ ok: true }, 200, { "Set-Cookie": sessionCookie() });
}

// Estado de la sesión
export async function GET(request) {
  return json({ ok: isAuthed(request) });
}

// Cerrar sesión
export async function DELETE() {
  return json({ ok: true }, 200, { "Set-Cookie": clearCookie() });
}
