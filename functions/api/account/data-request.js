import { requireSession } from "../../_lib/access.js";
import { audit } from "../../_lib/auth.js";
import { bodyJson, cleanText, json } from "../../_lib/http.js";
import { id } from "../../_lib/ids.js";

const TYPES=new Set(["access","correction","deletion"]);

export async function onRequestGet(context){
  const auth=await requireSession(context); if(auth.response)return auth.response;
  const result=await context.env.DB.prepare(
    "SELECT id,request_type,status,notes,created_at,completed_at FROM data_requests WHERE customer_id=? ORDER BY created_at DESC"
  ).bind(auth.session.customer_id).all();
  return json({ok:true,requests:result.results||[]});
}

export async function onRequestPost(context){
  const auth=await requireSession(context); if(auth.response)return auth.response;
  const p=await bodyJson(context.request),type=p?.requestType;
  if(!TYPES.has(type))return json({ok:false,error:"Invalid request type."},400);
  const requestId=id("DREQ");
  await context.env.DB.prepare(
    "INSERT INTO data_requests(id,customer_id,request_type,status,notes) VALUES(?,?,?,'submitted',?)"
  ).bind(requestId,auth.session.customer_id,type,cleanText(p.notes,2000)||null).run();
  await audit(context,{actorUserId:auth.session.user_id,action:"privacy.request.created",objectType:"data_request",objectId:requestId,metadata:{type}});
  return json({ok:true,id:requestId,status:"submitted"},201);
}
