import { requireRole } from "../../_lib/access.js";
import { json } from "../../_lib/http.js";

async function firstValue(db,sql){
  try{return Number((await db.prepare(sql).first())?.value||0)}
  catch{return 0}
}
async function all(db,sql){
  try{return (await db.prepare(sql).all()).results||[]}
  catch{return []}
}

export async function onRequestGet(context){
  const auth=await requireRole(context,["executive","system_admin","manager"]);
  if(auth.response)return auth.response;
  const db=context.env.DB;

  const metrics={
    customers:await firstValue(db,"SELECT COUNT(*) AS value FROM customers"),
    openLeads:await firstValue(db,"SELECT COUNT(*) AS value FROM leads WHERE stage NOT IN ('won','lost')"),
    pipelineValueCents:await firstValue(db,"SELECT COALESCE(SUM(estimated_value_cents),0) AS value FROM leads WHERE stage NOT IN ('won','lost')"),
    activeProjects:await firstValue(db,"SELECT COUNT(*) AS value FROM projects WHERE status NOT IN ('completed','cancelled')"),
    outstandingInvoiceCents:await firstValue(db,"SELECT COALESCE(SUM(amount_cents),0) AS value FROM invoices WHERE status NOT IN ('paid','cancelled','refunded')"),
    openTickets:await firstValue(db,"SELECT COUNT(*) AS value FROM tickets WHERE status NOT IN ('resolved','closed')"),
    revenueCents:await firstValue(db,"SELECT COALESCE(SUM(amount_cents),0) AS value FROM payments WHERE status='paid'"),
    openIncidents:await firstValue(db,"SELECT COUNT(*) AS value FROM incidents WHERE status!='resolved'"),
    overdueInvoices:await firstValue(db,"SELECT COUNT(*) AS value FROM invoices WHERE status NOT IN ('paid','cancelled','refunded') AND due_at IS NOT NULL AND due_at < CURRENT_TIMESTAMP"),
    complianceDue30:await firstValue(db,"SELECT COUNT(*) AS value FROM compliance_calendar WHERE status NOT IN ('completed','cancelled') AND due_at <= datetime('now','+30 days')"),
    launchesDue30:await firstValue(db,"SELECT COUNT(*) AS value FROM launch_checklists WHERE status NOT IN ('completed','cancelled') AND target_launch_at IS NOT NULL AND target_launch_at <= datetime('now','+30 days')")
  };

  let properties=await all(db,"SELECT p.id,p.hostname,p.name,p.status,p.access_level,h.dns_status,h.ssl_status,h.http_status,h.last_checked_at,h.incident_note FROM properties p LEFT JOIN property_health h ON h.property_id=p.id ORDER BY p.name");
  if(!properties.length){
    properties=await all(db,"SELECT id,hostname,name,status,access_level FROM properties ORDER BY name");
  }

  const pipeline=await all(db,"SELECT stage,COUNT(*) AS lead_count,COALESCE(SUM(estimated_value_cents),0) AS value_cents FROM leads WHERE stage NOT IN ('won','lost') GROUP BY stage ORDER BY value_cents DESC,lead_count DESC");
  const revenueByBrand=await all(db,"SELECT b.id AS brand_id,b.name AS brand_name,COALESCE(SUM(pm.amount_cents),0) AS revenue_cents FROM brands b LEFT JOIN properties p ON p.brand_id=b.id LEFT JOIN payments pm ON pm.property_id=p.id AND pm.status='paid' GROUP BY b.id,b.name ORDER BY revenue_cents DESC,b.name");
  const leadsByBrand=await all(db,"SELECT b.id AS brand_id,b.name AS brand_name,COUNT(l.id) AS lead_count FROM brands b LEFT JOIN leads l ON l.brand_id=b.id GROUP BY b.id,b.name ORDER BY lead_count DESC,b.name");
  const projects=await all(db,"SELECT pr.id,pr.name,pr.status,pr.due_at,p.name AS property_name FROM projects pr JOIN properties p ON p.id=pr.property_id WHERE pr.status NOT IN ('completed','cancelled') ORDER BY CASE WHEN pr.due_at IS NULL THEN 1 ELSE 0 END,pr.due_at,pr.updated_at DESC LIMIT 25");
  const invoices=await all(db,"SELECT i.id,i.amount_cents,i.status,i.due_at,p.name AS property_name FROM invoices i JOIN properties p ON p.id=i.property_id WHERE i.status NOT IN ('paid','cancelled','refunded') ORDER BY CASE WHEN i.due_at IS NULL THEN 1 ELSE 0 END,i.due_at,i.created_at DESC LIMIT 25");
  const supportVolume=await all(db,"SELECT status,COUNT(*) AS ticket_count FROM tickets GROUP BY status ORDER BY ticket_count DESC,status");
  const incidents=await all(db,"SELECT id,service_key,title,severity,status,started_at FROM incidents WHERE status!='resolved' ORDER BY started_at DESC LIMIT 25");
  const contentCalendar=await all(db,"SELECT c.id,c.title,c.channel,c.content_type,c.status,c.scheduled_at,b.name AS brand_name FROM content_calendar c JOIN brands b ON b.id=c.brand_id WHERE c.status NOT IN ('cancelled','archived') ORDER BY CASE WHEN c.scheduled_at IS NULL THEN 1 ELSE 0 END,c.scheduled_at LIMIT 30");
  const affiliatePerformance=await all(db,"SELECT ap.id,ap.partner_id,COALESCE(p.organization_name,ap.partner_id) AS partner_name,ap.clicks,ap.leads,ap.conversions,ap.revenue_cents,ap.commission_cents,ap.period_start,ap.period_end,b.name AS brand_name FROM affiliate_performance ap LEFT JOIN partners p ON p.id=ap.partner_id JOIN brands b ON b.id=ap.brand_id ORDER BY ap.period_end DESC,ap.revenue_cents DESC LIMIT 25");
  const complianceCalendar=await all(db,"SELECT c.id,c.title,c.category,c.jurisdiction,c.due_at,c.status,b.name AS brand_name FROM compliance_calendar c LEFT JOIN brands b ON b.id=c.brand_id WHERE c.status NOT IN ('completed','cancelled') ORDER BY c.due_at LIMIT 30");
  const vendorRecords=await all(db,"SELECT vr.id,vr.service_category,vr.contact_name,vr.contact_email,vr.contract_status,vr.renewal_at,vr.annual_cost_cents,vr.risk_level,COALESCE(v.organization_name,vr.contact_name,vr.id) AS organization_name FROM vendor_records vr LEFT JOIN vendors v ON v.id=vr.vendor_id ORDER BY CASE WHEN vr.renewal_at IS NULL THEN 1 ELSE 0 END,vr.renewal_at LIMIT 30");
  const launchChecklists=await all(db,"SELECT lc.id,lc.name,lc.status,lc.target_launch_at,p.name AS property_name,COUNT(li.id) AS item_count,SUM(CASE WHEN li.status='completed' THEN 1 ELSE 0 END) AS completed_items FROM launch_checklists lc LEFT JOIN properties p ON p.id=lc.property_id LEFT JOIN launch_checklist_items li ON li.checklist_id=lc.id WHERE lc.status NOT IN ('completed','cancelled') GROUP BY lc.id,lc.name,lc.status,lc.target_launch_at,p.name ORDER BY CASE WHEN lc.target_launch_at IS NULL THEN 1 ELSE 0 END,lc.target_launch_at LIMIT 30");
  const sops=await all(db,"SELECT id,title,category,status,version,review_due_at FROM standard_operating_procedures WHERE status!='archived' ORDER BY CASE WHEN review_due_at IS NULL THEN 1 ELSE 0 END,review_due_at,title LIMIT 30");
  const brands=await all(db,"SELECT id,name,status FROM brands ORDER BY name");
  const recentAudit=await all(db,"SELECT a.id,a.action,a.object_type,a.object_id,a.created_at,u.email AS actor_email FROM audit_logs a LEFT JOIN users u ON u.id=a.actor_user_id ORDER BY a.created_at DESC LIMIT 20");

  return json({
    ok:true,
    access:{roles:(auth.roles||[]).map(r=>r.id)},
    metrics,
    properties,
    pipeline,
    revenueByBrand,
    leadsByBrand,
    projects,
    invoices,
    supportVolume,
    incidents,
    contentCalendar,
    affiliatePerformance,
    complianceCalendar,
    vendorRecords,
    launchChecklists,
    sops,
    brands,
    recentAudit
  });
}
