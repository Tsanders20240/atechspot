import { requireSession } from "../../_lib/access.js";
import { audit } from "../../_lib/auth.js";
import { bodyJson, cleanText, json } from "../../_lib/http.js";

export async function onRequestGet(context){
  const auth=await requireSession(context); if(auth.response)return auth.response;
  const customer=await context.env.DB.prepare(
    "SELECT id,display_name,phone,organization_name,timezone,created_at,updated_at FROM customers WHERE id=?"
  ).bind(auth.session.customer_id).first();
  return json({ok:true,profile:customer});
}

export async function onRequestPatch(context){
  const auth=await requireSession(context); if(auth.response)return auth.response;
  const payload=await bodyJson(context.request); if(!payload)return json({ok:false,error:"Invalid request."},400);
  const displayName=cleanText(payload.displayName,120),phone=cleanText(payload.phone,40),organizationName=cleanText(payload.organizationName,200),timezone=cleanText(payload.timezone,100);
  await context.env.DB.prepare(
    `UPDATE customers SET display_name=?,phone=?,organization_name=?,timezone=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`
  ).bind(displayName||null,phone||null,organizationName||null,timezone||null,auth.session.customer_id).run();
  await audit(context,{actorUserId:auth.session.user_id,action:"customer.profile.updated",objectType:"customer",objectId:auth.session.customer_id});
  return json({ok:true});
}
