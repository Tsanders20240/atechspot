import { requireSession } from "../../_lib/access.js";
import { audit } from "../../_lib/auth.js";
import { bodyJson, cleanText, json, requireFields } from "../../_lib/http.js";
import { id } from "../../_lib/ids.js";

const PRIORITIES=new Set(["P1","P2","P3","P4"]);

export async function onRequestGet(context){
  const auth=await requireSession(context); if(auth.response)return auth.response;
  const result=await context.env.DB.prepare(
    "SELECT id,category,priority,status,subject,created_at,updated_at,resolved_at FROM tickets WHERE customer_id=? ORDER BY updated_at DESC LIMIT 100"
  ).bind(auth.session.customer_id).all();
  return json({ok:true,tickets:result.results||[]});
}

export async function onRequestPost(context){
  const auth=await requireSession(context); if(auth.response)return auth.response;
  const payload=await bodyJson(context.request);
  const missing=requireFields(payload,["category","subject","message"]);
  if(missing.length)return json({ok:false,error:"Missing required fields.",fields:missing},400);
  const ticketId=id("TKT"), messageId=id("MSG");
  const category=cleanText(payload.category,100),subject=cleanText(payload.subject,200),message=cleanText(payload.message,5000);
  const priority=PRIORITIES.has(payload.priority)?payload.priority:"P3";
  await context.env.DB.batch([
    context.env.DB.prepare(
      "INSERT INTO tickets(id,customer_id,property_id,category,priority,status,subject) VALUES(?,?,?,?,?,'new',?)"
    ).bind(ticketId,auth.session.customer_id,"PROP-SUPPORT",category,priority,subject),
    context.env.DB.prepare(
      "INSERT INTO ticket_messages(id,ticket_id,author_user_id,body,is_internal) VALUES(?,?,?,?,0)"
    ).bind(messageId,ticketId,auth.session.user_id,message)
  ]);
  await audit(context,{actorUserId:auth.session.user_id,action:"ticket.created",objectType:"ticket",objectId:ticketId});
  return json({ok:true,id:ticketId,status:"new"},201);
}
