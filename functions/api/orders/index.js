import { requireSession } from "../../_lib/access.js";
import { json } from "../../_lib/http.js";

export async function onRequestGet(context){
  const auth=await requireSession(context); if(auth.response)return auth.response;
  const result=await context.env.DB.prepare(
    "SELECT id,total_cents,currency,status,created_at,updated_at FROM orders WHERE customer_id=? ORDER BY created_at DESC LIMIT 100"
  ).bind(auth.session.customer_id).all();
  return json({ok:true,orders:result.results||[]});
}
