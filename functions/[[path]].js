import { appFromHostname } from "./_lib/platform.js";

function escapeHtml(value = "") {
  return value.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]));
}

function shell(app, hostname) {
  const title = escapeHtml(app.name);
  const purpose = escapeHtml(app.purpose);
  const host = escapeHtml(hostname);
  const privateLabel = app.access === "private" ? "Private system" : "Phase 2 application";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="${app.access === "public" ? "index,follow" : "noindex,nofollow"}">
<title>${title} | ATechSpot</title>
<style>
:root{color-scheme:dark;--bg:#050a12;--panel:#0b1420;--line:#183047;--text:#eef7ff;--muted:#91a9bd;--cyan:#66d9ff;--blue:#2c7dff}
*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;background:radial-gradient(circle at 80% 0,#0d2741 0,transparent 34%),var(--bg);color:var(--text);min-height:100vh;display:grid;place-items:center}
main{width:min(900px,calc(100% - 32px));padding:48px;border:1px solid var(--line);border-radius:24px;background:linear-gradient(180deg,rgba(13,28,43,.92),rgba(7,15,25,.96));box-shadow:0 30px 90px rgba(0,0,0,.35)}
.badge{display:inline-flex;gap:8px;align-items:center;border:1px solid #1d5b80;border-radius:999px;padding:8px 12px;color:var(--cyan);font-size:.78rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.dot{width:8px;height:8px;border-radius:50%;background:#32d583;box-shadow:0 0 14px #32d583}
h1{font-size:clamp(2.4rem,6vw,4.8rem);line-height:1;margin:26px 0 18px;letter-spacing:-.05em}p{color:var(--muted);font-size:1.12rem;line-height:1.7;max-width:700px}
.meta{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:34px}.card{border:1px solid var(--line);border-radius:14px;padding:16px;background:#07111c}.card b{display:block;color:var(--text);margin-bottom:4px}.card span{color:var(--muted);font-size:.88rem}
a{color:var(--cyan)}@media(max-width:700px){main{padding:28px}.meta{grid-template-columns:1fr}}
</style>
</head>
<body>
<main>
  <span class="badge"><span class="dot"></span>${privateLabel}</span>
  <h1>${title}</h1>
  <p>${purpose}.</p>
  <p>This hostname is now recognized by the shared Phase 2 application layer. Functional modules will be enabled behind the same shared identity, data, security and analytics foundation.</p>
  <div class="meta">
    <div class="card"><b>Hostname</b><span>${host}</span></div>
    <div class="card"><b>Application</b><span>${escapeHtml(app.key)}</span></div>
    <div class="card"><b>Health</b><span><a href="/api/health">/api/health</a></span></div>
  </div>
</main>
</body>
</html>`;
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const app = appFromHostname(url.hostname);

  // Preserve the existing www/apex static website exactly as-is.
  if (!app) return context.next();

  // Keep API routes handled by their specific Pages Functions.
  if (url.pathname.startsWith("/api/")) return context.next();

  // Phase 2 application shell. Functional routes replace this progressively.
  return new Response(shell(app, url.hostname), {
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
      "Cache-Control": "no-store",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
      "X-Robots-Tag": app.access === "public" ? "all" : "noindex, nofollow"
    }
  });
}
