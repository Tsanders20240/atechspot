import { requireSession } from "../../_lib/access.js";
import { json } from "../../_lib/http.js";

export async function onRequestGet(context){
  const auth=await requireSession(context); if(auth.response)return auth.response;
  const result=await context.env.DB.prepare(
    `SELECT p.id,p.name,p.status,p.started_at,p.due_at,p.completed_at,p.created_at,p.updated_at,
      (SELECT COUNT(*) FROM project_milestones m WHERE m.project_id=p.id) AS milestone_count,
      (SELECT COUNT(*) FROM project_milestones m WHERE m.project_id=p.id AND m.status='completed') AS completed_milestones
     FROM projects p WHERE p.customer_id=? ORDER BY p.updated_at DESC LIMIT 100`
  ).bind(auth.session.customer_id).all();
  return json({ok:true,projects:result.results||[]});
}
