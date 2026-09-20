import { requireRole } from "../../_lib/access.js";
import { audit } from "../../_lib/auth.js";
import { bodyJson, cleanText, json, requireFields } from "../../_lib/http.js";
import { id } from "../../_lib/ids.js";

const WRITERS=["executive","system_admin","manager"];

function n(value, fallback=0){
  const x=Number(value);
  return Number.isFinite(x)?Math.trunc(x):fallback;
}
function nullable(value,max=1000){
  const v=cleanText(value,max);
  return v||null;
}
async function writeAudit(context,auth,action,type,objectId,metadata={}){
  await audit(context,{actorUserId:auth.session.user_id,action,objectType:type,objectId,metadata});
}

export async function onRequestPost(context){
  const auth=await requireRole(context,WRITERS); if(auth.response)return auth.response;
  const payload=await bodyJson(context.request);
  if(!payload)return json({ok:false,error:"Invalid JSON."},400);

  const module=cleanText(payload.module,40);
  const data=payload.data||{};
  const db=context.env.DB;
  let objectId;

  switch(module){
    case "content":{
      const missing=requireFields(data,["brandId","title","channel"]); if(missing.length)return json({ok:false,error:"Missing: "+missing.join(", ")},400);
      objectId=id("CNT");
      await db.prepare("INSERT INTO content_calendar (id,brand_id,property_id,title,channel,content_type,status,scheduled_at,owner_user_id,notes) VALUES (?,?,?,?,?,?,?,?,?,?)")
        .bind(objectId,cleanText(data.brandId,80),nullable(data.propertyId,80),cleanText(data.title,200),cleanText(data.channel,80),nullable(data.contentType,80),cleanText(data.status||"planned",40),nullable(data.scheduledAt,80),auth.session.user_id,nullable(data.notes,2000)).run();
      break;
    }
    case "compliance":{
      const missing=requireFields(data,["title","category","dueAt"]); if(missing.length)return json({ok:false,error:"Missing: "+missing.join(", ")},400);
      objectId=id("CMP");
      await db.prepare("INSERT INTO compliance_calendar (id,brand_id,property_id,title,category,jurisdiction,due_at,status,owner_user_id,notes) VALUES (?,?,?,?,?,?,?,?,?,?)")
        .bind(objectId,nullable(data.brandId,80),nullable(data.propertyId,80),cleanText(data.title,200),cleanText(data.category,100),nullable(data.jurisdiction,120),cleanText(data.dueAt,80),cleanText(data.status||"open",40),auth.session.user_id,nullable(data.notes,2000)).run();
      break;
    }
    case "vendor":{
      objectId=id("VNDREC");
      await db.prepare("INSERT INTO vendor_records (id,vendor_id,brand_id,service_category,contact_name,contact_email,contract_status,renewal_at,annual_cost_cents,risk_level,notes) VALUES (?,?,?,?,?,?,?,?,?,?,?)")
        .bind(objectId,nullable(data.vendorId,80),nullable(data.brandId,80),nullable(data.serviceCategory,120),nullable(data.contactName,160),nullable(data.contactEmail,254),cleanText(data.contractStatus||"prospect",40),nullable(data.renewalAt,80),data.annualCostCents===undefined?null:n(data.annualCostCents),cleanText(data.riskLevel||"standard",40),nullable(data.notes,2000)).run();
      break;
    }
    case "launch":{
      const missing=requireFields(data,["brandId","name"]); if(missing.length)return json({ok:false,error:"Missing: "+missing.join(", ")},400);
      objectId=id("LCH");
      await db.prepare("INSERT INTO launch_checklists (id,brand_id,property_id,name,status,target_launch_at,owner_user_id) VALUES (?,?,?,?,?,?,?)")
        .bind(objectId,cleanText(data.brandId,80),nullable(data.propertyId,80),cleanText(data.name,200),cleanText(data.status||"planning",40),nullable(data.targetLaunchAt,80),auth.session.user_id).run();
      for(const [idx,item] of (Array.isArray(data.items)?data.items:[]).slice(0,100).entries()){
        const title=cleanText(item?.title,200); if(!title)continue;
        await db.prepare("INSERT INTO launch_checklist_items (id,checklist_id,title,category,is_required,status,sort_order) VALUES (?,?,?,?,?,?,?)")
          .bind(id("LCI"),objectId,title,nullable(item.category,100),item.isRequired===false?0:1,cleanText(item.status||"pending",40),idx).run();
      }
      break;
    }
    case "sop":{
      const missing=requireFields(data,["title","category"]); if(missing.length)return json({ok:false,error:"Missing: "+missing.join(", ")},400);
      objectId=id("SOP");
      await db.prepare("INSERT INTO standard_operating_procedures (id,brand_id,title,category,status,version,owner_user_id,review_due_at,body) VALUES (?,?,?,?,?,?,?,?,?)")
        .bind(objectId,nullable(data.brandId,80),cleanText(data.title,200),cleanText(data.category,100),cleanText(data.status||"draft",40),cleanText(data.version||"1.0",30),auth.session.user_id,nullable(data.reviewDueAt,80),nullable(data.body,20000)).run();
      break;
    }
    case "incident":{
      const missing=requireFields(data,["serviceKey","title"]); if(missing.length)return json({ok:false,error:"Missing: "+missing.join(", ")},400);
      objectId=id("INC");
      await db.prepare("INSERT INTO incidents (id,service_key,title,severity,status,public_message) VALUES (?,?,?,?,?,?)")
        .bind(objectId,cleanText(data.serviceKey,100),cleanText(data.title,200),cleanText(data.severity||"minor",40),cleanText(data.status||"investigating",40),nullable(data.publicMessage,2000)).run();
      break;
    }
    case "affiliate":{
      const missing=requireFields(data,["brandId","periodStart","periodEnd"]); if(missing.length)return json({ok:false,error:"Missing: "+missing.join(", ")},400);
      objectId=id("AFF");
      await db.prepare("INSERT INTO affiliate_performance (id,partner_id,brand_id,period_start,period_end,clicks,leads,conversions,revenue_cents,commission_cents) VALUES (?,?,?,?,?,?,?,?,?,?)")
        .bind(objectId,nullable(data.partnerId,80),cleanText(data.brandId,80),cleanText(data.periodStart,80),cleanText(data.periodEnd,80),n(data.clicks),n(data.leads),n(data.conversions),n(data.revenueCents),n(data.commissionCents)).run();
      break;
    }
    case "health":{
      const missing=requireFields(data,["propertyId"]); if(missing.length)return json({ok:false,error:"Missing: propertyId"},400);
      objectId=cleanText(data.propertyId,80);
      await db.prepare("INSERT INTO property_health (property_id,dns_status,ssl_status,http_status,last_checked_at,incident_note,updated_at) VALUES (?,?,?,?,?,?,CURRENT_TIMESTAMP) ON CONFLICT(property_id) DO UPDATE SET dns_status=excluded.dns_status,ssl_status=excluded.ssl_status,http_status=excluded.http_status,last_checked_at=excluded.last_checked_at,incident_note=excluded.incident_note,updated_at=CURRENT_TIMESTAMP")
        .bind(objectId,cleanText(data.dnsStatus||"unknown",40),cleanText(data.sslStatus||"unknown",40),data.httpStatus===undefined?null:n(data.httpStatus),nullable(data.lastCheckedAt,80),nullable(data.incidentNote,1000)).run();
      break;
    }
    default:return json({ok:false,error:"Unsupported Ops module."},400);
  }

  await writeAudit(context,auth,"ops.create",module,objectId,{module});
  return json({ok:true,id:objectId},201);
}

export async function onRequestPatch(context){
  const auth=await requireRole(context,WRITERS); if(auth.response)return auth.response;
  const payload=await bodyJson(context.request);
  if(!payload)return json({ok:false,error:"Invalid JSON."},400);
  const module=cleanText(payload.module,40), objectId=cleanText(payload.id,100), data=payload.data||{};
  if(!module||!objectId)return json({ok:false,error:"module and id are required."},400);
  const db=context.env.DB;
  let result;

  switch(module){
    case "content":
      result=await db.prepare("UPDATE content_calendar SET title=COALESCE(?,title),channel=COALESCE(?,channel),status=COALESCE(?,status),scheduled_at=COALESCE(?,scheduled_at),notes=COALESCE(?,notes),updated_at=CURRENT_TIMESTAMP WHERE id=?")
        .bind(nullable(data.title,200),nullable(data.channel,80),nullable(data.status,40),nullable(data.scheduledAt,80),nullable(data.notes,2000),objectId).run(); break;
    case "compliance":
      result=await db.prepare("UPDATE compliance_calendar SET status=COALESCE(?,status),due_at=COALESCE(?,due_at),notes=COALESCE(?,notes),completed_at=CASE WHEN ?='completed' THEN CURRENT_TIMESTAMP ELSE completed_at END,updated_at=CURRENT_TIMESTAMP WHERE id=?")
        .bind(nullable(data.status,40),nullable(data.dueAt,80),nullable(data.notes,2000),cleanText(data.status,40),objectId).run(); break;
    case "vendor":
      result=await db.prepare("UPDATE vendor_records SET contract_status=COALESCE(?,contract_status),renewal_at=COALESCE(?,renewal_at),annual_cost_cents=COALESCE(?,annual_cost_cents),risk_level=COALESCE(?,risk_level),notes=COALESCE(?,notes),updated_at=CURRENT_TIMESTAMP WHERE id=?")
        .bind(nullable(data.contractStatus,40),nullable(data.renewalAt,80),data.annualCostCents===undefined?null:n(data.annualCostCents),nullable(data.riskLevel,40),nullable(data.notes,2000),objectId).run(); break;
    case "launch":
      result=await db.prepare("UPDATE launch_checklists SET status=COALESCE(?,status),target_launch_at=COALESCE(?,target_launch_at),updated_at=CURRENT_TIMESTAMP WHERE id=?")
        .bind(nullable(data.status,40),nullable(data.targetLaunchAt,80),objectId).run(); break;
    case "sop":
      result=await db.prepare("UPDATE standard_operating_procedures SET title=COALESCE(?,title),category=COALESCE(?,category),status=COALESCE(?,status),version=COALESCE(?,version),review_due_at=COALESCE(?,review_due_at),body=COALESCE(?,body),updated_at=CURRENT_TIMESTAMP WHERE id=?")
        .bind(nullable(data.title,200),nullable(data.category,100),nullable(data.status,40),nullable(data.version,30),nullable(data.reviewDueAt,80),nullable(data.body,20000),objectId).run(); break;
    case "incident":
      result=await db.prepare("UPDATE incidents SET severity=COALESCE(?,severity),status=COALESCE(?,status),public_message=COALESCE(?,public_message),resolved_at=CASE WHEN ?='resolved' THEN CURRENT_TIMESTAMP ELSE resolved_at END,updated_at=CURRENT_TIMESTAMP WHERE id=?")
        .bind(nullable(data.severity,40),nullable(data.status,40),nullable(data.publicMessage,2000),cleanText(data.status,40),objectId).run(); break;
    default:return json({ok:false,error:"Unsupported Ops module."},400);
  }

  if(!result?.meta?.changes)return json({ok:false,error:"Record not found or unchanged."},404);
  await writeAudit(context,auth,"ops.update",module,objectId,{module});
  return json({ok:true,id:objectId});
}
