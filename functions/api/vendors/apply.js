import { requireSession } from "../../_lib/access.js";
import { audit } from "../../_lib/auth.js";
import { bodyJson, cleanText, json, requireFields } from "../../_lib/http.js";
import { id } from "../../_lib/ids.js";

export async function onRequestPost(context){
  const auth=await requireSession(context); if(auth.response)return auth.response;
  const payload=await bodyJson(context.request);
  const missing=requireFields(payload,["organizationName"]);
  if(missing.length)return json({ok:false,error:"Organization or professional name is required."},400);
  const vendorId=id("VEN");
  await context.env.DB.prepare(
    "INSERT INTO vendors(id,customer_id,organization_name,status) VALUES(?,?,?,'applicant')"
  ).bind(vendorId,auth.session.customer_id,cleanText(payload.organizationName,200)).run();
  await audit(context,{actorUserId:auth.session.user_id,action:"vendor.application.created",objectType:"vendor",objectId:vendorId});
  return json({ok:true,id:vendorId,status:"applicant"},201);
}
