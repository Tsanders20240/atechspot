import { json } from "../../_lib/http.js";

export async function onRequestGet(context) {
  if (!context.env.DB) return json({ ok:false, error:"Database unavailable." },503);
  const result = await context.env.DB.prepare(
    `SELECT id, service_key, name, description, duration_minutes, price_cents, deposit_cents, requires_intake
     FROM service_catalog WHERE is_active = 1 ORDER BY name`
  ).all();
  return json({ ok:true, services: result.results || [] });
}
