import { requireRole } from "../../_lib/access.js";
import { json } from "../../_lib/http.js";

export async function onRequestGet(context){
  const auth=await requireRole(context,["executive","system_admin","manager"]); if(auth.response)return auth.response;
  const queries=[
    ["customers","SELECT COUNT(*) AS value FROM customers"],
    ["leads","SELECT COUNT(*) AS value FROM leads WHERE stage NOT IN ('won','lost')"],
    ["projects","SELECT COUNT(*) AS value FROM projects WHERE status NOT IN ('completed','cancelled')"],
    ["openInvoices","SELECT COUNT(*) AS value FROM invoices WHERE status NOT IN ('paid','cancelled','refunded')"],
    ["openTickets","SELECT COUNT(*) AS value FROM tickets WHERE status NOT IN ('resolved','closed')"],
    ["revenueCents","SELECT COALESCE(SUM(amount_cents),0) AS value FROM payments WHERE status='paid'"],
    ["incidents","SELECT COUNT(*) AS value FROM incidents WHERE status!='resolved'"]
  ];
  const metrics={};
  for(const [key,sql] of queries){
    try{metrics[key]=Number((await context.env.DB.prepare(sql).first())?.value||0)}
    catch{metrics[key]=0}
  }
  const recentLeads=await context.env.DB.prepare(
    "SELECT id,service_interest,stage,source,created_at FROM leads ORDER BY created_at DESC LIMIT 10"
  ).all();
  const properties=await context.env.DB.prepare(
    "SELECT id,hostname,name,status,access_level FROM properties ORDER BY name"
  ).all();
  return json({ok:true,metrics,recentLeads:recentLeads.results||[],properties:properties.results||[]});
}
