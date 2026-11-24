# Latifa & Nidhal — Wedding invitation

Static site + Cloudflare Worker (`worker.js`) + D1 database + R2 audio bucket.
Pages: `/` invitation · `/admin.html` private dashboard · `/qr.html` QR codes · `/print.html` printable card.

## One-time setup
1. **D1:** Cloudflare → Workers & Pages → D1 → your database → Console → paste `schema.sql` → Run.
2. **R2:** Cloudflare → R2 → create bucket `latifa-nidhal-voices` (keep it private; never enable public access).
3. **wrangler.jsonc:** put your real D1 `database_name` and `database_id` back (copy them from your old file).
4. **Secret:** Worker → Settings → Variables and Secrets → `ADMIN_PASSWORD` (a long password, secret type).
5. **Bindings** must be named `DB` (D1) and `BUCKET` (R2); wrangler.jsonc sets them on deploy.
6. **Photo sharing:** create a Google Photos shared album (or Drive folder) allowing guests to add photos; paste its link into `PHOTO_URL` in `config.js`.
7. **Audio (optional):** upload `audio/music.mp3`, `birds.mp3`, `wings.mp3`, `gate.mp3` (only music you have the rights to).
8. Delete the old `_.assetsignore` and `assetsignore`; the new `.assetsignore` keeps `worker.js`, `schema.sql` and `wrangler.jsonc` from being downloadable.
