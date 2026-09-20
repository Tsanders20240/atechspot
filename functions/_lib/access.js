import { getSession } from "./auth.js";
import { json } from "./http.js";

export async function requireSession(context) {
  const session = await getSession(context);
  if (!session) return { response: json({ ok: false, error: "Authentication required." }, 401) };
  return { session };
}

export async function rolesFor(context, userId) {
  const result = await context.env.DB.prepare(
    `SELECT r.id, r.name FROM user_roles ur JOIN roles r ON r.id = ur.role_id
     WHERE ur.user_id = ? ORDER BY r.id`
  ).bind(userId).all();
  return result.results || [];
}

export async function requireRole(context, allowed) {
  const auth = await requireSession(context);
  if (auth.response) return auth;
  const roles = await rolesFor(context, auth.session.user_id);
  const roleIds = new Set(roles.map(r => r.id));
  if (!allowed.some(r => roleIds.has(r))) {
    return { response: json({ ok: false, error: "Forbidden." }, 403) };
  }
  return { session: auth.session, roles };
}
