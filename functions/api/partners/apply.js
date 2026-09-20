import { requireSession } from "../../_lib/access.js";
import { audit } from "../../_lib/auth.js";
import { bodyJson, cleanText, json, requireFields } from "../../_lib/http.js";
import { id } from "../../_lib/ids.js";

export async function onRequestPost(context){
  const auth=await requireSession(context); if(auth.response)return auth.response;
  const payload=await bodyJson(context.request);
  const missing=requireFields(payload,["partnerType","organizationName"]);
  if(missing.length)return json({ok:false,error:"Missing required fields.",fields:missing},400);
  const partnerId=id("AFF");
  await context.env.DB.prepare(
    "INSERT INTO partners(id,customer_id,partner_type,organization_name,status) VALUES(?,?,?,?, 'applicant')"
  ).bind(partnerId,auth.session.customer_id,cleanText(payload.partnerType,100),cleanText(payload.organizationName,200)).run();
  await audit(context,{actorUserId:auth.session.user_id,action:"partner.application.created",objectType:"partner",objectId:partnerId});
  return json({ok:true,id:partnerId,status:"applicant"},201);
}
