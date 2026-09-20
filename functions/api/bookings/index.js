import { requireSession } from "../../_lib/access.js";
import { audit } from "../../_lib/auth.js";
import { bodyJson, cleanText, json, requireFields } from "../../_lib/http.js";
import { id } from "../../_lib/ids.js";

export async function onRequestGet(context) {
  const auth = await requireSession(context); if (auth.response) return auth.response;
  const result = await context.env.DB.prepare(
    `SELECT b.id,b.service_key,b.starts_at,b.ends_at,b.timezone,b.status,s.name AS service_name
     FROM bookings b LEFT JOIN service_catalog s ON s.service_key=b.service_key
     WHERE b.customer_id=? ORDER BY b.starts_at DESC LIMIT 100`
  ).bind(auth.session.customer_id).all();
  return json({ ok:true, bookings: result.results || [] });
}

export async function onRequestPost(context) {
  const auth = await requireSession(context); if (auth.response) return auth.response;
  const payload = await bodyJson(context.request);
  const missing = requireFields(payload,["serviceKey","startsAt","endsAt"]);
  if (missing.length) return json({ok:false,error:"Missing required fields.",fields:missing},400);
  const serviceKey=cleanText(payload.serviceKey,120), startsAt=cleanText(payload.startsAt,80), endsAt=cleanText(payload.endsAt,80);
  const service=await context.env.DB.prepare("SELECT service_key FROM service_catalog WHERE service_key=? AND is_active=1").bind(serviceKey).first();
  if(!service) return json({ok:false,error:"Unknown or inactive service."},400);
  if(Number.isNaN(Date.parse(startsAt))||Number.isNaN(Date.parse(endsAt))||Date.parse(endsAt)<=Date.parse(startsAt)) return json({ok:false,error:"Invalid booking time."},400);
  const bookingId=id("BKG");
  await context.env.DB.prepare(
    `INSERT INTO bookings(id,customer_id,property_id,service_key,starts_at,ends_at,timezone,status)
     VALUES(?,?,?,?,?,?,?,'confirmed')`
  ).bind(bookingId,auth.session.customer_id,"PROP-BOOK",serviceKey,startsAt,endsAt,cleanText(payload.timezone,80)||"UTC").run();
  await audit(context,{actorUserId:auth.session.user_id,action:"booking.created",objectType:"booking",objectId:bookingId});
  return json({ok:true,id:bookingId,status:"confirmed"},201);
}
