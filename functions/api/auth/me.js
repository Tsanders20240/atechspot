import { getSession } from "../../_lib/auth.js";

export async function onRequestGet(context) {
  const session = await getSession(context);
  if (!session) {
    return Response.json({ authenticated: false }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  const roles = await context.env.DB.prepare(
    `SELECT r.id, r.name FROM user_roles ur JOIN roles r ON r.id = ur.role_id WHERE ur.user_id = ? ORDER BY r.id`
  ).bind(session.user_id).all();

  return Response.json({
    authenticated: true,
    user: {
      id: session.user_id,
      email: session.email,
      customerId: session.customer_id,
      displayName: session.display_name,
      roles: roles.results || []
    }
  }, { headers: { "Cache-Control": "no-store" } });
}
