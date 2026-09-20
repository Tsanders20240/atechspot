const SESSION_COOKIE = "atechspot_session";
const SESSION_DAYS = 30;
const MAGIC_MINUTES = 15;

function bytesToBase64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function randomToken(size = 32) {
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);
  return bytesToBase64Url(bytes);
}

export async function sha256(value) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, "0")).join("");
}

export function normalizeEmail(email = "") {
  return String(email).trim().toLowerCase();
}

export function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

export function isoAfterMinutes(minutes) {
  return new Date(Date.now() + minutes * 60_000).toISOString();
}

export function isoAfterDays(days) {
  return new Date(Date.now() + days * 86_400_000).toISOString();
}

export function magicExpiry() {
  return isoAfterMinutes(MAGIC_MINUTES);
}

export function sessionExpiry() {
  return isoAfterDays(SESSION_DAYS);
}

export function customerId() {
  return "CUS-" + crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase();
}

export function userId() {
  return "USR-" + crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase();
}

export function sessionId() {
  return "SES-" + crypto.randomUUID().replace(/-/g, "").slice(0, 16).toUpperCase();
}

export function auditId() {
  return "AUD-" + crypto.randomUUID().replace(/-/g, "").slice(0, 16).toUpperCase();
}

export function parseCookies(request) {
  const raw = request.headers.get("Cookie") || "";
  return Object.fromEntries(raw.split(";").map(x => x.trim()).filter(Boolean).map(pair => {
    const index = pair.indexOf("=");
    return [pair.slice(0, index), decodeURIComponent(pair.slice(index + 1))];
  }));
}

export function sessionCookie(token, expiresAt) {
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; Domain=.atechspot.com; HttpOnly; Secure; SameSite=Lax; Expires=${new Date(expiresAt).toUTCString()}`;
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; Domain=.atechspot.com; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export async function getSession(context) {
  if (!context.env.DB) return null;
  const token = parseCookies(context.request)[SESSION_COOKIE];
  if (!token) return null;
  const tokenHash = await sha256(token);
  const now = new Date().toISOString();
  const session = await context.env.DB.prepare(
    `SELECT s.id AS session_id, s.user_id, s.expires_at, u.email, c.id AS customer_id, c.display_name
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     LEFT JOIN customers c ON c.user_id = u.id
     WHERE s.token_hash = ? AND s.revoked_at IS NULL AND s.expires_at > ? AND u.status = 'active'`
  ).bind(tokenHash, now).first();
  return session || null;
}

export async function audit(context, { actorUserId = null, action, objectType = null, objectId = null, metadata = null }) {
  if (!context.env.DB) return;
  const requestId = context.data?.requestId || context.request.headers.get("X-ATechSpot-Request-ID") || crypto.randomUUID();
  await context.env.DB.prepare(
    `INSERT INTO audit_logs (id, actor_user_id, action, object_type, object_id, request_id, metadata_json)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(auditId(), actorUserId, action, objectType, objectId, requestId, metadata ? JSON.stringify(metadata) : null).run();
}
