import { audit, customerId, randomToken, sessionCookie, sessionExpiry, sessionId, sha256, userId } from "../../_lib/auth.js";

function safeReturnTo(value) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export async function onRequestGet(context) {
  if (!context.env.DB) return new Response("Identity database is not configured.", { status: 503 });
  const url = new URL(context.request.url);
  const rawToken = url.searchParams.get("token") || "";
  const returnTo = safeReturnTo(url.searchParams.get("returnTo"));
  if (!rawToken) return new Response("Invalid sign-in link.", { status: 400 });

  const tokenHash = await sha256(rawToken);
  const now = new Date().toISOString();
  const link = await context.env.DB.prepare(
    `SELECT email FROM auth_magic_links
     WHERE token_hash = ? AND used_at IS NULL AND expires_at > ?`
  ).bind(tokenHash, now).first();

  if (!link) return new Response("This sign-in link is invalid or expired.", { status: 400 });

  let user = await context.env.DB.prepare("SELECT id, email FROM users WHERE email = ?").bind(link.email).first();
  if (!user) {
    const newUserId = userId();
    const newCustomerId = customerId();
    await context.env.DB.batch([
      context.env.DB.prepare("INSERT INTO users (id, email, email_verified_at) VALUES (?, ?, ?)").bind(newUserId, link.email, now),
      context.env.DB.prepare("INSERT INTO customers (id, user_id) VALUES (?, ?)").bind(newCustomerId, newUserId),
      context.env.DB.prepare("INSERT INTO user_roles (user_id, role_id) VALUES (?, 'customer')").bind(newUserId)
    ]);
    user = { id: newUserId, email: link.email };
  } else {
    await context.env.DB.prepare("UPDATE users SET email_verified_at = COALESCE(email_verified_at, ?), updated_at = ? WHERE id = ?")
      .bind(now, now, user.id).run();
  }

  await context.env.DB.prepare("UPDATE auth_magic_links SET used_at = ? WHERE token_hash = ?").bind(now, tokenHash).run();

  const sessionToken = randomToken();
  const sessionHash = await sha256(sessionToken);
  const expiresAt = sessionExpiry();
  const ua = (context.request.headers.get("User-Agent") || "").slice(0, 500);
  await context.env.DB.prepare(
    "INSERT INTO sessions (id, user_id, token_hash, expires_at, user_agent) VALUES (?, ?, ?, ?, ?)"
  ).bind(sessionId(), user.id, sessionHash, expiresAt, ua).run();

  await audit(context, { actorUserId: user.id, action: "auth.login", objectType: "user", objectId: user.id });

  const redirect = new URL(returnTo, context.env.AUTH_BASE_URL || "https://account.atechspot.com");
  return new Response(null, {
    status: 302,
    headers: {
      Location: redirect.toString(),
      "Set-Cookie": sessionCookie(sessionToken, expiresAt),
      "Cache-Control": "no-store"
    }
  });
}
