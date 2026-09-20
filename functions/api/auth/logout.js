import { audit, clearSessionCookie, getSession, parseCookies, sha256 } from "../../_lib/auth.js";

export async function onRequestPost(context) {
  const session = await getSession(context);
  const token = parseCookies(context.request).atechspot_session;

  if (context.env.DB && token) {
    const tokenHash = await sha256(token);
    await context.env.DB.prepare("UPDATE sessions SET revoked_at = CURRENT_TIMESTAMP WHERE token_hash = ?").bind(tokenHash).run();
  }
  if (session) await audit(context, { actorUserId: session.user_id, action: "auth.logout", objectType: "user", objectId: session.user_id });

  return Response.json({ ok: true }, {
    headers: {
      "Set-Cookie": clearSessionCookie(),
      "Cache-Control": "no-store"
    }
  });
}
