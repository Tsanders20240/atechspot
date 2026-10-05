const text=(v,n=500)=>String(v??'').replace(/\u0000/g,'').trim().slice(0,n);
const html=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const response=(status,data)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json','cache-control':'no-store','x-content-type-options':'nosniff'}});
const uuid=v=>/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(v));
export function nextBusinessDay(now=new Date()){
 const parts=d=>Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric',hourCycle:'h23'}).formatToParts(d).filter(p=>p.type!=='literal').map(p=>[p.type,Number(p.value)]));
 const local=parts(now),d=new Date(Date.UTC(local.year,local.month-1,local.day+1,9));
 while([0,6].includes(d.getUTCDay()))d.setUTCDate(d.getUTCDate()+1);
 const offset=parts(d),represented=Date.UTC(offset.year,offset.month-1,offset.day,offset.hour,offset.minute,offset.second);
 return new Date(d.getTime()-(represented-d.getTime())).toISOString();
}
export function normalizeLead(fields,now=new Date()){
 const budget=text(fields['Investment Range']||fields['Budget Range']);
 const authority=text(fields['Decision Authority']);
 const ready=/\$2,500|\$5,000|\$10,000|\$25,000/.test(budget)&&/decision-maker/i.test(authority);
 const safePath=v=>{try{const u=new URL(v,'https://www.atechspot.com');return u.pathname.slice(0,250)}catch{return ''}};
 return {id:uuid(fields['Submission ID'])?fields['Submission ID']:crypto.randomUUID(),
 email:text(fields.Email,254).toLowerCase(),name:text(fields['Full Name']||fields.Name,120),
 company:text(fields.Company,180),source:text(fields['Lead Source'],120)||'direct / unknown',
 campaign:text(fields.Campaign,120)||'unattributed',medium:text(fields['Lead Medium'],80),
 landing_page:safePath(fields['Landing Page']),service_interest:text(fields['Service Interest']||fields.Service||fields.Topic,200)||'Needs assessment',
 industry:text(fields.Industry,160),budget,status:'new',
 qualification:ready?'priority_review':'needs_review',next_action:'Review assessment and confirm pain, authority, budget and deadline',
 next_action_at:nextBusinessDay(now),estimated_deal_value:null,payload:JSON.stringify(fields),
 created_at:now.toISOString(),updated_at:now.toISOString()};
}
export async function recordAssessment(env,fields){
 const db=env.ACQUISITION_DB;if(!db)return null;
 const l=normalizeLead(fields),keys=Object.keys(l);
 await db.batch([
 db.prepare('INSERT OR IGNORE INTO acquisition_leads ('+keys.join(',')+') VALUES ('+keys.map(()=>'?').join(',')+')').bind(...Object.values(l)),
 db.prepare('INSERT OR IGNORE INTO acquisition_tasks (id,lead_id,kind,due_at) VALUES (?,?,?,?)').bind(l.id+':review',l.id,'lead_review',l.next_action_at),
 db.prepare('INSERT OR IGNORE INTO acquisition_tasks (id,lead_id,kind,due_at) VALUES (?,?,?,?)').bind(l.id+':internal',l.id,'internal',l.created_at),
 db.prepare('INSERT OR IGNORE INTO acquisition_tasks (id,lead_id,kind,due_at) VALUES (?,?,?,?)').bind(l.id+':confirmation',l.id,'confirmation',l.created_at)
 ]);
 const stored=await db.prepare('SELECT * FROM acquisition_leads WHERE id=?').bind(l.id).first();
 // A submitted UUID is an idempotency key, not authorization to read a lead.
 if(!stored||stored.email!==l.email||stored.payload!==l.payload)throw new Error('Submission ID conflict');
 return stored;
}
export async function markDelivery(env,id,kind){
 const field=kind==='internal'?'internal_sent':'confirmation_sent';
 await env.ACQUISITION_DB.prepare('UPDATE acquisition_leads SET '+field+'=1 WHERE id=?').bind(id).run();
}
export async function queueDelivery(env,id,kind){
 await env.ACQUISITION_DB.prepare('INSERT OR IGNORE INTO acquisition_tasks (id,lead_id,kind,due_at) VALUES (?,?,?,?)').bind(id+':'+kind,id,kind,new Date().toISOString()).run();
}
async function authorized(request,env){
 if(!env.ACQUISITION_ADMIN_TOKEN)return false;
 const cookie=(request.headers.get('cookie')||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('atechspot_staff='))?.slice(16);
 if(cookie){
 const session=await verifyStaff(env,cookie,'session');
 if(session){
 if(!['GET','HEAD'].includes(request.method)&&request.headers.get('origin')!=='https://www.atechspot.com')return false;
 return true;
 }
 }
 const supplied=request.headers.get('authorization')||'';
 const hash=async v=>new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(v)));
 const a=await hash(supplied),b=await hash('Bearer '+env.ACQUISITION_ADMIN_TOKEN);
 let diff=0;for(let i=0;i<a.length;i++)diff|=a[i]^b[i];return diff===0;
}
const staffEmails=new Set(['jason@atechspot.com','aplustechucation@gmail.com']);
const base64=v=>btoa(String.fromCharCode(...new TextEncoder().encode(v))).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');
const decode=v=>new TextDecoder().decode(Uint8Array.from(atob(v.replaceAll('-','+').replaceAll('_','/')+'='.repeat((4-v.length%4)%4)),c=>c.charCodeAt(0)));
async function staffKey(env){return crypto.subtle.importKey('raw',new TextEncoder().encode(env.ACQUISITION_ADMIN_TOKEN),{name:'HMAC',hash:'SHA-256'},false,['sign','verify'])}
async function signStaff(env,data){
 const body=base64(JSON.stringify(data)),sig=new Uint8Array(await crypto.subtle.sign('HMAC',await staffKey(env),new TextEncoder().encode(body)));
 return body+'.'+base64(String.fromCharCode(...sig));
}
async function verifyStaff(env,token,purpose){
 try{
 const [body,sig]=token.split('.');const bytes=Uint8Array.from(decode(sig),c=>c.charCodeAt(0));
 if(!await crypto.subtle.verify('HMAC',await staffKey(env),bytes,new TextEncoder().encode(body)))return null;
 const p=JSON.parse(decode(body));return p.purpose===purpose&&p.exp>Date.now()&&staffEmails.has(p.email)?p:null;
 }catch{return null}
}
async function staffAccess(request,env,send,u){
 if(!env.ACQUISITION_DB||!env.ACQUISITION_ADMIN_TOKEN)return response(503,{ok:false,message:'Staff access is not configured.'});
 if(u.pathname==='/api/acquisition/access'&&request.method==='POST'){
 let b;try{b=await request.json()}catch{return response(400,{ok:false,message:'Invalid request.'})}
 const email=text(b.email,254).toLowerCase(),elapsed=Date.now()-Number(b.started);
 if(!Number.isFinite(elapsed)||elapsed<1200||elapsed>86400000)return response(400,{ok:false,message:'Reload the page and try again.'});
 if(staffEmails.has(email)){
 const now=Date.now(),nonce=crypto.randomUUID();
 const saved=await env.ACQUISITION_DB.prepare('INSERT INTO acquisition_access(email,requested_at,nonce) VALUES(?,?,?) ON CONFLICT(email) DO UPDATE SET requested_at=excluded.requested_at,nonce=excluded.nonce,used=0 WHERE requested_at<?').bind(email,now,nonce,now-900000).run();
 if(saved.meta.changes){
 const token=await signStaff(env,{email,nonce,purpose:'magic',exp:now+900000});
 try{await send({to:[email],reply_to:'jason@atechspot.com',subject:'Your ATechSpot acquisition desk sign-in',html:'<p><a href="https://www.atechspot.com/api/acquisition/login?token='+encodeURIComponent(token)+'">Open your acquisition desk</a></p><p>This single-use link expires in 15 minutes. If you did not request it, ignore this message. Do not forward the link.</p>'})}
 catch{await env.ACQUISITION_DB.prepare('DELETE FROM acquisition_access WHERE email=? AND nonce=?').bind(email,nonce).run()}
 }
 }
 return response(200,{ok:true,message:'If this is an authorized staff email, a sign-in link will arrive. Please allow 15 minutes between requests.'});
 }
 if(u.pathname==='/api/acquisition/login'&&request.method==='GET'){
 const p=await verifyStaff(env,u.searchParams.get('token')||'','magic');
 if(!p)return new Response(null,{status:302,headers:{location:'/acquisition/?error=expired','cache-control':'no-store','referrer-policy':'no-referrer'}});
 const r=await env.ACQUISITION_DB.prepare('UPDATE acquisition_access SET used=1 WHERE email=? AND nonce=? AND used=0').bind(p.email,p.nonce).run();
 if(!r.meta.changes)return new Response(null,{status:302,headers:{location:'/acquisition/?error=expired','cache-control':'no-store','referrer-policy':'no-referrer'}});
 const session=await signStaff(env,{email:p.email,purpose:'session',exp:Date.now()+28800000});
 return new Response(null,{status:302,headers:{location:'/acquisition/','set-cookie':'atechspot_staff='+session+'; Path=/; Max-Age=28800; HttpOnly; Secure; SameSite=Lax','cache-control':'no-store','referrer-policy':'no-referrer'}});
 }
 return null;
}
export async function runTasks(env,send){
 const db=env.ACQUISITION_DB,now=new Date().toISOString();
 const rows=(await db.prepare("SELECT * FROM acquisition_tasks WHERE status='pending' AND due_at<=? AND (locked_until IS NULL OR locked_until<?) LIMIT 40").bind(now,now).all()).results;
 let done=0,failed=0;
 for(const task of rows){
 const claim=await db.prepare("UPDATE acquisition_tasks SET locked_until=?,attempts=attempts+1 WHERE id=? AND status='pending' AND (locked_until IS NULL OR locked_until<?)").bind(new Date(Date.now()+300000).toISOString(),task.id,now).run();
 if(!claim.meta.changes)continue;
 try{
 const l=await db.prepare('SELECT * FROM acquisition_leads WHERE id=?').bind(task.lead_id).first();
 if(!l||['lost','suppressed'].includes(l.status)) {
 await db.prepare("UPDATE acquisition_tasks SET status='cancelled',locked_until=NULL WHERE id=?").bind(task.id).run();continue;
 }
 let payload;
 if(task.kind==='confirmation'){
 if(l.confirmation_sent){await db.prepare("UPDATE acquisition_tasks SET status='done',locked_until=NULL WHERE id=?").bind(task.id).run();continue}
 payload={to:[l.email],reply_to:'jason@atechspot.com',subject:'We received your ATechSpot assessment',html:'<p>Hi '+html(l.name)+',</p><p>Your assessment was received. We will review your priorities and recommend a next step. Scope, price and schedule will be confirmed separately in writing.</p><p>ATechSpot / A+ Techucation LLC</p>'};
 }else{
 if(task.kind==='internal'&&l.internal_sent){await db.prepare("UPDATE acquisition_tasks SET status='done',locked_until=NULL WHERE id=?").bind(task.id).run();continue}
 if(task.kind==='lead_review'&&l.status!=='new'){await db.prepare("UPDATE acquisition_tasks SET status='cancelled',locked_until=NULL WHERE id=?").bind(task.id).run();continue}
 const proof=task.kind==='proof';
 payload={to:['aplustechucation@gmail.com'],reply_to:l.email,subject:proof?'ATechSpot: collect verified client proof':'ATechSpot: '+(task.kind==='internal'?'new assessment':'follow-up due')+' — '+l.company,
 html:'<h2>'+ (proof?'Client proof collection':'Assessment review')+'</h2><p>Lead: '+html(l.id)+' · '+html(l.name)+' · '+html(l.email)+'</p><p>Service: '+html(l.service_interest)+'<br>Budget: '+html(l.budget)+'<br>Campaign: '+html(l.campaign)+'</p><p>'+html(proof?'Ask for feedback, document baseline and result, retain supporting evidence, and obtain permission before publishing. Project: '+task.project_id:l.next_action)+'</p>'};
 }
 if(task.kind==='internal'){
 const fields=JSON.parse(l.payload);
 payload.html+='<table>'+Object.entries(fields).map(([k,v])=>'<tr><th>'+html(k)+'</th><td>'+html(v)+'</td></tr>').join('')+'</table>';
 }
 // Stable provider key prevents duplicates after a crash between send and DB update.
 await send(payload,'acquisition-'+task.id);
 if(['internal','confirmation'].includes(task.kind))await markDelivery(env,l.id,task.kind);
 await db.prepare("UPDATE acquisition_tasks SET status='done',completed_at=?,locked_until=NULL WHERE id=?").bind(now,task.id).run();done++;
 }catch{
 failed++;const dead=task.attempts>=7;
 await db.prepare("UPDATE acquisition_tasks SET status=?,due_at=?,locked_until=NULL WHERE id=?").bind(dead?'failed':'pending',new Date(Date.now()+Math.min(3600000,60000*2**task.attempts)).toISOString(),task.id).run();
 }
 }return {done,failed};
}
export async function handleAcquisition(request,env,send){
 const u=new URL(request.url);if(!u.pathname.startsWith('/api/acquisition/'))return null;
 if(['/api/acquisition/access','/api/acquisition/login'].includes(u.pathname))return staffAccess(request,env,send,u);
 if(u.pathname==='/api/acquisition/health'&&request.method==='GET'){
  let trackingConfigured=false;
  if(env.ACQUISITION_DB){
   try{
    // Compile the actual tables and columns without reading customer records.
    await env.ACQUISITION_DB.prepare('SELECT l.id,l.payload,t.kind,t.attempts,a.nonce,p.publication_permission FROM acquisition_leads l,acquisition_tasks t,acquisition_access a,acquisition_proof p LIMIT 0').all();
    trackingConfigured=true;
   }catch{}
  }
  const automationConfigured=Boolean(trackingConfigured&&env.ACQUISITION_ADMIN_TOKEN);
  return response(trackingConfigured&&automationConfigured?200:503,{ok:trackingConfigured&&automationConfigured,trackingConfigured,automationConfigured});
 }
 if(!await authorized(request,env))return response(401,{ok:false,message:'Authorized staff access required.'});
 if(!env.ACQUISITION_DB)return response(503,{ok:false,message:'Lead tracking is not configured.'});
 const db=env.ACQUISITION_DB;
 try{
 if(u.pathname==='/api/acquisition/logout'&&request.method==='POST')return new Response(null,{status:204,headers:{'set-cookie':'atechspot_staff=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax','cache-control':'no-store'}});
 if(u.pathname==='/api/acquisition/run'&&request.method==='POST')return response(200,{ok:true,...await runTasks(env,send)});
 if(u.pathname==='/api/acquisition/leads'&&request.method==='GET'){
 const results=await db.prepare('SELECT id,name,email,company,source,campaign,medium,landing_page,service_interest,industry,budget,status,qualification,next_action,next_action_at,estimated_deal_value,owner,created_at FROM acquisition_leads ORDER BY created_at DESC LIMIT 500').all();
 return response(200,{ok:true,leads:results.results});
 }
 if(u.pathname==='/api/acquisition/proof'&&request.method==='GET')return response(200,{ok:true,proof:(await db.prepare('SELECT * FROM acquisition_proof ORDER BY created_at DESC LIMIT 500').all()).results});
 if(u.pathname==='/api/acquisition/lead'&&request.method==='PATCH'){
 const b=await request.json();const stages=['new','contacted','discovery','qualified','proposal','won','lost','suppressed'];
 if(!uuid(b.id)||!stages.includes(b.status)||!text(b.next_action)||!Number.isFinite(Date.parse(b.next_action_at)))return response(400,{ok:false,message:'Valid lead, stage, next action and due date are required.'});
 const value=b.estimated_deal_value==null?null:Number(b.estimated_deal_value);
 if(value!==null&&(!Number.isFinite(value)||value<0))return response(400,{ok:false,message:'Deal value must be a nonnegative number or null.'});
 const r=await db.prepare('UPDATE acquisition_leads SET status=?,next_action=?,next_action_at=?,estimated_deal_value=?,updated_at=? WHERE id=?').bind(b.status,text(b.next_action),new Date(b.next_action_at).toISOString(),value,new Date().toISOString(),b.id).run();
 if(!r.meta.changes)return response(404,{ok:false,message:'Lead not found.'});
 if(!['lost','suppressed'].includes(b.status))await db.prepare("INSERT INTO acquisition_tasks(id,lead_id,kind,due_at) VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET due_at=excluded.due_at,status='pending',locked_until=NULL,attempts=0").bind(b.id+':followup',b.id,'followup',new Date(b.next_action_at).toISOString()).run();
 else await db.prepare("UPDATE acquisition_tasks SET status='cancelled' WHERE lead_id=? AND status='pending'").bind(b.id).run();
 return response(200,{ok:true});
 }
 if(u.pathname==='/api/acquisition/project-completed'&&request.method==='POST'){
 const b=await request.json(),project=text(b.project_id,120);
 if(!project||!uuid(b.lead_id))return response(400,{ok:false,message:'Project and lead IDs required.'});
 const l=await db.prepare('SELECT id FROM acquisition_leads WHERE id=?').bind(b.lead_id).first();
 if(!l)return response(404,{ok:false,message:'Lead not found.'});
 await db.batch([
 db.prepare('INSERT OR IGNORE INTO acquisition_proof(project_id,lead_id,created_at) VALUES(?,?,?)').bind(project,b.lead_id,new Date().toISOString()),
 db.prepare('INSERT OR IGNORE INTO acquisition_tasks(id,lead_id,project_id,kind,due_at) VALUES(?,?,?,?,?)').bind('proof:'+project,b.lead_id,project,'proof',new Date().toISOString())
 ]);return response(200,{ok:true,message:'Proof collection queued; publication remains gated.'});
 }
 if(u.pathname==='/api/acquisition/proof'&&request.method==='PATCH'){
 const b=await request.json();const publish=b.status==='approved';
 if(publish&&(b.verified!==true||b.publication_permission!==true||!text(b.evidence_url)||!text(b.baseline)||!text(b.result)))return response(400,{ok:false,message:'Approval requires baseline, result, evidence, verification and publication permission.'});
 const r=await db.prepare('UPDATE acquisition_proof SET baseline=?,result=?,evidence_url=?,testimonial=?,publication_permission=?,verified=?,status=? WHERE project_id=?').bind(text(b.baseline,4000),text(b.result,4000),text(b.evidence_url,1000),text(b.testimonial,4000),b.publication_permission===true?1:0,b.verified===true?1:0,publish?'approved':'collecting',text(b.project_id,120)).run();
 return response(r.meta.changes?200:404,{ok:Boolean(r.meta.changes)});
 }
 return response(405,{ok:false,message:'Unsupported acquisition action.'});
 }catch{console.error('Acquisition action failed');return response(503,{ok:false,message:'This action could not be completed. Retry later.'})}
}
