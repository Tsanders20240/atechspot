import { PHASE2_APPS } from "../../_lib/platform.js";
import { json } from "../../_lib/http.js";

export async function onRequestGet(context){
  let incidents=[];
  if(context.env.DB){
    try{
      const result=await context.env.DB.prepare(
        `SELECT id,service_key,title,severity,status,public_message,started_at,resolved_at
         FROM incidents WHERE status!='resolved' ORDER BY started_at DESC LIMIT 50`
      ).all();
      incidents=result.results||[];
    }catch{}
  }
  const affected=new Set(incidents.map(i=>i.service_key));
  const services=Object.entries(PHASE2_APPS).map(([key,app])=>({
    key,name:app.name,hostname:`${key}.atechspot.com`,
    status:affected.has(key)?"degraded":"operational"
  }));
  return json({ok:true,services,incidents,generatedAt:new Date().toISOString()});
}
