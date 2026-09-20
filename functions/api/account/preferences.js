import { requireSession } from "../../_lib/access.js";
import { audit } from "../../_lib/auth.js";
import { bodyJson, json } from "../../_lib/http.js";

export async function onRequestGet(context){
  const auth=await requireSession(context); if(auth.response)return auth.response;
  const row=await context.env.DB.prepare(
    "SELECT transactional_email,marketing_email,product_updates,updated_at FROM customer_preferences WHERE customer_id=?"
  ).bind(auth.session.customer_id).first();
  return json({ok:true,preferences:row||{transactional_email:1,marketing_email:0,product_updates:0}});
}

export async function onRequestPut(context){
  const auth=await requireSession(context); if(auth.response)return auth.response;
  const p=await bodyJson(context.request); if(!p)return json({ok:false,error:"Invalid request."},400);
  const marketing=p.marketingEmail?1:0,updates=p.productUpdates?1:0;
  await context.env.DB.prepare(
    `INSERT INTO customer_preferences(customer_id,transactional_email,marketing_email,product_updates)
     VALUES(?,1,?,?)
     ON CONFLICT(customer_id) DO UPDATE SET marketing_email=excluded.marketing_email,product_updates=excluded.product_updates,updated_at=CURRENT_TIMESTAMP`
  ).bind(auth.session.customer_id,marketing,updates).run();
  await audit(context,{actorUserId:auth.session.user_id,action:"customer.preferences.updated",objectType:"customer",objectId:auth.session.customer_id});
  return json({ok:true});
}
