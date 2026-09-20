import { requireSession } from "../../_lib/access.js";
import { audit } from "../../_lib/auth.js";
import { bodyJson, cleanText, json, requireFields } from "../../_lib/http.js";
import { id } from "../../_lib/ids.js";

export async function onRequestGet(context){
  const auth=await requireSession(context); if(auth.response)return auth.response;
  const result=await context.env.DB.prepare(
    "SELECT id,service_key,status,submitted_at,created_at,updated_at FROM intakes WHERE customer_id=? ORDER BY created_at DESC LIMIT 100"
  ).bind(auth.session.customer_id).all();
  return json({ok:true,intakes:result.results||[]});
}

export async function onRequestPost(context){
  const auth=await requireSession(context); if(auth.response)return auth.response;
  const payload=await bodyJson(context.request);
  const missing=requireFields(payload,["serviceKey","answers"]);
  if(missing.length)return json({ok:false,error:"Missing required fields.",fields:missing},400);
  const serviceKey=cleanText(payload.serviceKey,120);
  const service=await context.env.DB.prepare("SELECT service_key FROM service_catalog WHERE service_key=? AND is_active=1").bind(serviceKey).first();
  if(!service)return json({ok:false,error:"Unknown service."},400);
  const answers=payload.answers&&typeof payload.answers==="object"?payload.answers:{};
  const serialized=JSON.stringify(answers);
  if(serialized.length>50000)return json({ok:false,error:"Intake payload is too large."},413);
  const intakeId=id("INT");
  await context.env.DB.prepare(
    `INSERT INTO intakes(id,customer_id,property_id,service_key,status,payload_json,submitted_at)
     VALUES(?,?,?,?, 'submitted', ?, CURRENT_TIMESTAMP)`
  ).bind(intakeId,auth.session.customer_id,"PROP-INTAKE",serviceKey,serialized).run();
  await audit(context,{actorUserId:auth.session.user_id,action:"intake.submitted",objectType:"intake",objectId:intakeId});
  return json({ok:true,id:intakeId,status:"submitted"},201);
}
