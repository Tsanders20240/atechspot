import { magicExpiry, normalizeEmail, randomToken, sha256, validEmail } from "../../_lib/auth.js";

function json(body, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function safeReturnTo(value) {
  if (typeof value !== "string" || !value) return "/";
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" && (url.hostname === "atechspot.com" || url.hostname.endsWith(".atechspot.com"))) return url.toString();
  } catch {}
  return "/";
}

export async function onRequestPost(context) {
  if (!context.env.DB) return json({ ok: false, error: "Identity database is not configured." }, 503);
  if (!context.env.RESEND_API_KEY || !context.env.AUTH_FROM_EMAIL) {
    return json({ ok: false, error: "Email authentication is not configured." }, 503);
  }

  let payload;
  try { payload = await context.request.json(); }
  catch { return json({ ok: false, error: "Invalid request." }, 400); }

  const email = normalizeEmail(payload.email);
  if (!validEmail(email)) return json({ ok: false, error: "Enter a valid email address." }, 400);

  const recent = await context.env.DB.prepare(
    `SELECT COUNT(*) AS count FROM auth_magic_links
     WHERE email = ? AND created_at > datetime('now', '-10 minutes')`
  ).bind(email).first();

  if (Number(recent?.count || 0) >= 5) {
    return json({ ok: true, message: "If that email can sign in, a link will be sent shortly." });
  }

  const token = randomToken();
  const tokenHash = await sha256(token);
  const expiresAt = magicExpiry();
  await context.env.DB.prepare(
    `INSERT INTO auth_magic_links (token_hash, email, expires_at) VALUES (?, ?, ?)`
  ).bind(tokenHash, email, expiresAt).run();

  const authHost = context.env.AUTH_BASE_URL || "https://account.atechspot.com";
  const returnTo = safeReturnTo(payload.returnTo);
  const verifyUrl = `${authHost}/api/auth/verify?token=${encodeURIComponent(token)}&returnTo=${encodeURIComponent(returnTo)}`;

  const mail = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${context.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: context.env.AUTH_FROM_EMAIL,
      to: [email],
      subject: "Your ATechSpot sign-in link",
      html: `<p>Use the secure link below to sign in to ATechSpot.</p><p><a href="${verifyUrl}">Sign in to ATechSpot</a></p><p>This link expires in 15 minutes. If you did not request it, you can ignore this message.</p>`
    })
  });

  if (!mail.ok) {
    console.error("auth_email_failed", { status: mail.status });
    return json({ ok: false, error: "Sign-in email could not be sent." }, 502);
  }

  return json({ ok: true, message: "Check your email for a secure sign-in link." });
}
