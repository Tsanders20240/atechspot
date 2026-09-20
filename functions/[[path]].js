import { appFromHostname } from "./_lib/platform.js";
import { getSession } from "./_lib/auth.js";

function escapeHtml(value = "") {
  return value.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]));
}

function baseStyles() {
  return `
:root{color-scheme:dark;--bg:#050a12;--panel:#0b1420;--line:#183047;--text:#eef7ff;--muted:#91a9bd;--cyan:#66d9ff;--blue:#2c7dff;--good:#32d583}
*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;background:radial-gradient(circle at 80% 0,#0d2741 0,transparent 34%),var(--bg);color:var(--text);min-height:100vh;display:grid;place-items:center;padding:16px}
main{width:min(900px,100%);padding:48px;border:1px solid var(--line);border-radius:24px;background:linear-gradient(180deg,rgba(13,28,43,.92),rgba(7,15,25,.96));box-shadow:0 30px 90px rgba(0,0,0,.35)}
.badge{display:inline-flex;gap:8px;align-items:center;border:1px solid #1d5b80;border-radius:999px;padding:8px 12px;color:var(--cyan);font-size:.78rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.dot{width:8px;height:8px;border-radius:50%;background:var(--good);box-shadow:0 0 14px var(--good)}
h1{font-size:clamp(2.4rem,6vw,4.8rem);line-height:1;margin:26px 0 18px;letter-spacing:-.05em}h2{margin:0 0 12px}p{color:var(--muted);font-size:1.06rem;line-height:1.7;max-width:700px}
.meta{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:34px}.card{border:1px solid var(--line);border-radius:14px;padding:16px;background:#07111c}.card b{display:block;color:var(--text);margin-bottom:4px}.card span{color:var(--muted);font-size:.88rem}
a{color:var(--cyan)}form{display:grid;gap:12px;margin-top:26px;max-width:560px}label{font-weight:700}input{width:100%;padding:14px 15px;border-radius:10px;border:1px solid #25455f;background:#07111c;color:var(--text);font:inherit}input:focus{outline:3px solid rgba(102,217,255,.15);border-color:var(--cyan)}button{padding:14px 18px;border:0;border-radius:10px;background:linear-gradient(135deg,var(--blue),#4ba9ff);color:#fff;font:inherit;font-weight:800;cursor:pointer}button:disabled{opacity:.6;cursor:wait}.status{min-height:26px;color:var(--cyan)}.account-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:28px}.hidden{display:none!important}
@media(max-width:700px){main{padding:28px}.meta,.account-grid{grid-template-columns:1fr}}
`;
}

function genericShell(app, hostname) {
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
<style>${baseStyles()}</style>
</head>
<body>
<main>
  <span class="badge"><span class="dot"></span>${privateLabel}</span>
  <h1>${title}</h1>
  <p>${purpose}.</p>
  <p>This hostname is recognized by the shared Phase 2 application layer. Functional modules are being enabled behind the same identity, data, security and analytics foundation.</p>
  <div class="meta">
    <div class="card"><b>Hostname</b><span>${host}</span></div>
    <div class="card"><b>Application</b><span>${escapeHtml(app.key)}</span></div>
    <div class="card"><b>Health</b><span><a href="/api/health">/api/health</a></span></div>
  </div>
</main>
</body>
</html>`;
}

function opsShell(session) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>ATechSpot Operations</title>
<style>${baseStyles()}</style>
</head>
<body>
<main>
  <span class="badge"><span class="dot"></span>Private executive system</span>
  <h1>ATechSpot Operations</h1>
  <p>Authenticated access confirmed. This is the protected Phase 2 operations surface for the executive dashboard, ecosystem registry, CRM, projects, finance, support, incidents and launch control.</p>
  <div class="meta">
    <div class="card"><b>Signed in</b><span>${escapeHtml(session.email || "Authorized user")}</span></div>
    <div class="card"><b>Customer ID</b><span>${escapeHtml(session.customer_id || "Internal")}</span></div>
    <div class="card"><b>Health</b><span><a href="/api/health">/api/health</a></span></div>
  </div>
</main>
</body>
</html>`;
}

function accountShell() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>ATechSpot Account</title>
<style>${baseStyles()}</style>
</head>
<body>
<main>
  <span class="badge"><span class="dot"></span>Central identity</span>
  <h1>ATechSpot Account</h1>
  <p>One secure identity for participating ATechSpot services. Sign in with a time-limited email link—ATechSpot does not store an account password for this flow.</p>
  <section id="signedOut">
    <form id="loginForm">
      <label for="email">Email address</label>
      <input id="email" name="email" type="email" autocomplete="email" maxlength="254" required placeholder="you@example.com">
      <button id="loginButton" type="submit">Email me a secure sign-in link</button>
      <div id="loginStatus" class="status" role="status" aria-live="polite"></div>
    </form>
  </section>
  <section id="signedIn" class="hidden">
    <div class="account-grid">
      <div class="card"><b>Customer ID</b><span id="customerId">—</span></div>
      <div class="card"><b>Email</b><span id="userEmail">—</span></div>
      <div class="card"><b>Display name</b><span id="displayName">Not set</span></div>
      <div class="card"><b>Roles</b><span id="roles">Customer</span></div>
    </div>
    <form id="logoutForm"><button type="submit">Sign out</button></form>
  </section>
  <div class="meta">
    <div class="card"><b>Identity</b><span>Passwordless magic link</span></div>
    <div class="card"><b>Session</b><span>Secure HttpOnly cookie</span></div>
    <div class="card"><b>Health</b><span><a href="/api/health">/api/health</a></span></div>
  </div>
</main>
<script>
const signedOut=document.getElementById('signedOut');
const signedIn=document.getElementById('signedIn');
const status=document.getElementById('loginStatus');
async function loadSession(){
  try{
    const r=await fetch('/api/auth/me',{headers:{Accept:'application/json'}});
    if(!r.ok){signedOut.classList.remove('hidden');signedIn.classList.add('hidden');return}
    const data=await r.json();
    signedOut.classList.add('hidden');signedIn.classList.remove('hidden');
    document.getElementById('customerId').textContent=data.user.customerId||'Pending';
    document.getElementById('userEmail').textContent=data.user.email||'—';
    document.getElementById('displayName').textContent=data.user.displayName||'Not set';
    document.getElementById('roles').textContent=(data.user.roles||[]).map(r=>r.name).join(', ')||'Customer';
  }catch{status.textContent='Account service is temporarily unavailable.'}
}
document.getElementById('loginForm').addEventListener('submit',async e=>{
  e.preventDefault();
  const button=document.getElementById('loginButton');button.disabled=true;status.textContent='Sending secure sign-in link…';
  try{
    const r=await fetch('/api/auth/request-link',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({email:document.getElementById('email').value,returnTo:'/'})});
    const data=await r.json();status.textContent=data.message||data.error||'Request completed.';
  }catch{status.textContent='Could not request a sign-in link.'}
  finally{button.disabled=false}
});
document.getElementById('logoutForm').addEventListener('submit',async e=>{
  e.preventDefault();await fetch('/api/auth/logout',{method:'POST'});location.reload();
});
loadSession();
</script>
</body>
</html>`;
}

async function hasOpsRole(context, userId) {
  const result = await context.env.DB.prepare(
    `SELECT 1 AS allowed FROM user_roles
     WHERE user_id = ? AND role_id IN ('executive','system_admin','manager')
     LIMIT 1`
  ).bind(userId).first();
  return Boolean(result?.allowed);
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const app = appFromHostname(url.hostname);

  if (!app) return context.next();
  if (url.pathname.startsWith("/api/")) return context.next();

  if (app.key === "ops") {
    const session = await getSession(context);
    if (!session) {
      const login = new URL("https://account.atechspot.com/");
      login.searchParams.set("returnTo", "https://ops.atechspot.com/");
      return Response.redirect(login.toString(), 302);
    }
    if (!context.env.DB || !(await hasOpsRole(context, session.user_id))) {
      return new Response("Forbidden", { status: 403, headers: { "Cache-Control": "no-store" } });
    }
    return new Response(opsShell(session), {
      headers: {
        "Content-Type": "text/html; charset=UTF-8",
        "Cache-Control": "no-store",
        "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'",
        "X-Robots-Tag": "noindex, nofollow"
      }
    });
  }

  const html = app.key === "account" ? accountShell() : genericShell(app, url.hostname);
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
      "Cache-Control": "no-store",
      "Content-Security-Policy": "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
      "X-Robots-Tag": app.access === "public" ? "all" : "noindex, nofollow"
    }
  });
}
