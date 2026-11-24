// Cloudflare Worker: RSVP + guestbook API backed by D1.
const DEADLINE = Date.parse("2027-01-01T00:00:00+01:00"); // end of 31 Dec 2026, Tunisia time
let ready = false;

const json = (o, s = 200) =>
  new Response(JSON.stringify(o), {
    status: s,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

async function init(db) {
  if (ready) return;
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS rsvps (
      id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL,
      name_key TEXT NOT NULL UNIQUE, message TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS guestbook (
      id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, message TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP)`),
  ]);
  ready = true;
}

const clean = (v, max) =>
  String(v ?? "").replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, max);

const keyOf = (n) =>
  n.normalize("NFKC").toLowerCase()
    .replace(/[\u064b-\u065f\u0670\u0640]/g, "")
    .replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه")
    .replace(/\s+/g, " ").trim();

async function body(req) {
  try { return await req.json(); } catch { return {}; }
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(req);
    try {
      await init(env.DB);

      if (url.pathname === "/api/rsvp" && req.method === "POST") {
        if (Date.now() >= DEADLINE) return json({ error: "closed" }, 403);
        const b = await body(req);
        const name = clean(b.name, 80);
        const message = String(b.message ?? "").replace(/\r/g, "").trim().slice(0, 600);
        if (name.length < 2) return json({ error: "invalid" }, 400);
        try {
          await env.DB.prepare("INSERT INTO rsvps (name, name_key, message) VALUES (?, ?, ?)")
            .bind(name, keyOf(name), message).run();
        } catch (e) {
          if (String(e).includes("UNIQUE")) return json({ error: "duplicate" }, 409);
          throw e;
        }
        return json({ ok: true });
      }

      if (url.pathname === "/api/guestbook" && req.method === "POST") {
        const b = await body(req);
        const name = clean(b.name, 80);
        const message = String(b.message ?? "").replace(/\r/g, "").trim().slice(0, 800);
        if (message.length < 2) return json({ error: "invalid" }, 400);
        await env.DB.prepare("INSERT INTO guestbook (name, message) VALUES (?, ?)")
          .bind(name, message).run();
        return json({ ok: true });
      }

      if (url.pathname === "/api/admin" && req.method === "GET") {
        if (!env.ADMIN_PASSWORD) return json({ error: "no_password_set" }, 503);
        const sent = req.headers.get("x-admin-password") || "";
        if (sent.length !== env.ADMIN_PASSWORD.length || sent !== env.ADMIN_PASSWORD)
          return json({ error: "unauthorized" }, 401);
        const r = await env.DB.prepare("SELECT name, message, created_at FROM rsvps ORDER BY id DESC").all();
        const g = await env.DB.prepare("SELECT name, message, created_at FROM guestbook ORDER BY id DESC").all();
        return json({ rsvps: r.results, guestbook: g.results });
      }

      return json({ error: "not_found" }, 404);
    } catch (e) {
      return json({ error: "server" }, 500);
    }
  },
};
