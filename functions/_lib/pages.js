function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}

const css=`
:root{color-scheme:dark;--bg:#050a12;--panel:#0b1420;--panel2:#07111c;--line:#183047;--text:#eef7ff;--muted:#91a9bd;--cyan:#66d9ff;--blue:#2c7dff;--good:#32d583;--warn:#f7b955;--bad:#ff6b6b}
*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;background:radial-gradient(circle at 80% 0,#0d2741 0,transparent 34%),var(--bg);color:var(--text);min-height:100vh}a{color:var(--cyan)}
.shell{width:min(1180px,calc(100% - 28px));margin:auto;padding:28px 0 60px}.top{display:flex;justify-content:space-between;align-items:center;gap:18px;padding:10px 0 28px}.brand{font-weight:900;letter-spacing:.06em}.brand span{color:var(--cyan)}.nav{display:flex;gap:14px;flex-wrap:wrap}.nav a{font-size:.9rem;text-decoration:none;color:var(--muted)}
main{padding:36px;border:1px solid var(--line);border-radius:24px;background:linear-gradient(180deg,rgba(13,28,43,.92),rgba(7,15,25,.96));box-shadow:0 30px 90px rgba(0,0,0,.3)}
.badge{display:inline-flex;gap:8px;align-items:center;border:1px solid #1d5b80;border-radius:999px;padding:8px 12px;color:var(--cyan);font-size:.76rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.dot{width:8px;height:8px;border-radius:50%;background:var(--good);box-shadow:0 0 14px var(--good)}
h1{font-size:clamp(2.2rem,6vw,4.6rem);line-height:1;margin:24px 0 16px;letter-spacing:-.05em}h2{font-size:1.5rem;margin:0 0 14px}h3{margin:0 0 8px}p{color:var(--muted);line-height:1.65}.lead{font-size:1.08rem;max-width:760px}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:26px}.grid.two{grid-template-columns:repeat(2,1fr)}.card{border:1px solid var(--line);border-radius:15px;padding:18px;background:var(--panel2);min-width:0}.card b{display:block;margin-bottom:6px}.card small,.muted{color:var(--muted)}
form{display:grid;gap:13px;margin-top:22px}label{display:grid;gap:6px;font-weight:700}input,select,textarea{width:100%;padding:13px 14px;border-radius:10px;border:1px solid #25455f;background:#07111c;color:var(--text);font:inherit}textarea{min-height:130px;resize:vertical}input:focus,select:focus,textarea:focus{outline:3px solid rgba(102,217,255,.14);border-color:var(--cyan)}
button,.btn{display:inline-flex;justify-content:center;align-items:center;padding:13px 17px;border:0;border-radius:10px;background:linear-gradient(135deg,var(--blue),#4ba9ff);color:#fff;font:inherit;font-weight:800;cursor:pointer;text-decoration:none}.secondary{background:#0c1b2b;border:1px solid #24455f}.danger{background:#6a2631}.status{min-height:24px;color:var(--cyan)}.toolbar{display:flex;gap:10px;flex-wrap:wrap;margin:18px 0}.list{display:grid;gap:10px;margin-top:18px}.row{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;border:1px solid var(--line);border-radius:12px;padding:14px;background:#07111c}.row .right{text-align:right}.money{font-size:1.25rem;font-weight:900}.good{color:var(--good)}.warn{color:var(--warn)}.bad{color:var(--bad)}.hidden{display:none!important}
.table{width:100%;border-collapse:collapse;margin-top:14px}.table th,.table td{text-align:left;padding:10px;border-bottom:1px solid var(--line);font-size:.9rem}.table th{color:var(--muted)}
@media(max-width:820px){main{padding:24px}.grid,.grid.two{grid-template-columns:1fr}.top{align-items:flex-start;flex-direction:column}.row{flex-direction:column}.row .right{text-align:left}}
`;

function frame(title,kicker,body,script="",robots="noindex,nofollow"){
return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="${robots}"><title>${esc(title)} | ATechSpot</title><style>${css}</style></head><body><div class="shell"><header class="top"><a class="brand" href="https://www.atechspot.com/">A+ <span>ATECHSPOT</span></a><nav class="nav"><a href="https://account.atechspot.com/">Account</a><a href="https://book.atechspot.com/">Booking</a><a href="https://clients.atechspot.com/">Clients</a><a href="https://support.atechspot.com/">Support</a><a href="https://help.atechspot.com/">Help</a></nav></header><main><span class="badge"><span class="dot"></span>${esc(kicker)}</span>${body}</main></div>${script?`<script>${script}</script>`:""}</body></html>`;
}

const authRedirect=`
function goLogin(){const u=new URL('https://account.atechspot.com/');u.searchParams.set('returnTo',location.href);location.href=u.toString()}
async function api(url,options={}){const r=await fetch(url,{...options,headers:{Accept:'application/json',...(options.body?{'Content-Type':'application/json'}:{}),...(options.headers||{})}});if(r.status===401){goLogin();throw new Error('Authentication required')}const data=await r.json().catch(()=>({}));if(!r.ok)throw new Error(data.error||'Request failed');return data}
`;

export function accountPage(){
const body=`<h1>ATechSpot Account</h1><p class="lead">One secure identity for participating ATechSpot services. Sign in with a time-limited email link.</p>
<section id="out"><form id="login"><label>Email address<input id="email" type="email" autocomplete="email" maxlength="254" required></label><button type="submit">Email me a secure sign-in link</button><div id="msg" class="status" role="status"></div></form></section>
<section id="in" class="hidden">
<div class="grid two"><div class="card"><b>Customer ID</b><span id="cid"></span></div><div class="card"><b>Email</b><span id="mail"></span></div><div class="card"><b>Roles</b><span id="roles"></span></div><div class="card"><b>Account status</b><span class="good">Active</span></div></div>
<div class="grid two">
<section class="card"><h2>Profile</h2><form id="profileForm"><label>Name<input id="profileName" maxlength="120"></label><label>Phone<input id="profilePhone" maxlength="40"></label><label>Organization<input id="profileOrg" maxlength="200"></label><label>Time zone<input id="profileTz" maxlength="100"></label><button>Save profile</button><div id="profileMsg" class="status"></div></form></section>
<section class="card"><h2>Communication preferences</h2><form id="prefsForm"><label><input id="marketing" type="checkbox" style="width:auto"> Marketing email</label><label><input id="updates" type="checkbox" style="width:auto"> Product & service updates</label><p class="muted">Transactional account, security and billing messages remain enabled when required to provide the service.</p><button>Save preferences</button><div id="prefsMsg" class="status"></div></form></section>
<section class="card"><h2>Privacy & data controls</h2><form id="dataForm"><label>Request type<select id="requestType"><option value="access">Access my data</option><option value="correction">Correct my data</option><option value="deletion">Request account/data deletion</option></select></label><label>Notes<textarea id="requestNotes"></textarea></label><button>Submit request</button><div id="dataMsg" class="status"></div></form><div id="dataRequests" class="list"></div></section>
<section class="card"><h2>Purchase history</h2><div id="orders" class="list"></div></section>
</div>
<div class="toolbar"><a class="btn secondary" href="https://clients.atechspot.com/">Client Portal</a><a class="btn secondary" href="https://support.atechspot.com/">Support</a><button id="logout" class="danger">Sign out</button></div>
</section>`;
const script=authRedirect+`
const out=document.getElementById('out'),inside=document.getElementById('in'),msg=document.getElementById('msg');
const returnTo=new URLSearchParams(location.search).get('returnTo')||'/';
async function load(){
 const r=await fetch('/api/auth/me');if(!r.ok)return;
 const d=await r.json();out.classList.add('hidden');inside.classList.remove('hidden');cid.textContent=d.user.customerId||'Pending';mail.textContent=d.user.email||'';roles.textContent=(d.user.roles||[]).map(x=>x.name).join(', ')||'Customer';
 try{
  const [p,pr,dr,ord]=await Promise.all([api('/api/account/profile'),api('/api/account/preferences'),api('/api/account/data-request'),api('/api/orders')]);
  profileName.value=p.profile?.display_name||'';profilePhone.value=p.profile?.phone||'';profileOrg.value=p.profile?.organization_name||'';profileTz.value=p.profile?.timezone||Intl.DateTimeFormat().resolvedOptions().timeZone;
  marketing.checked=!!pr.preferences?.marketing_email;updates.checked=!!pr.preferences?.product_updates;
  dataRequests.innerHTML=(dr.requests||[]).map(x=>'<div class="row"><div><b>'+x.request_type+'</b><div class="muted">'+new Date(x.created_at).toLocaleDateString()+'</div></div><div>'+x.status+'</div></div>').join('')||'<p class="muted">No privacy requests.</p>';
  orders.innerHTML=(ord.orders||[]).map(x=>'<div class="row"><div><b>'+x.id+'</b><div class="muted">'+new Date(x.created_at).toLocaleDateString()+'</div></div><div class="right">$'+(x.total_cents/100).toFixed(2)+' · '+x.status+'</div></div>').join('')||'<p class="muted">No orders yet.</p>';
 }catch(e){profileMsg.textContent=e.message}
}
login.addEventListener('submit',async e=>{e.preventDefault();msg.textContent='Sending…';try{const r=await fetch('/api/auth/request-link',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email.value,returnTo})});const d=await r.json();msg.textContent=d.message||d.error||'Request completed.'}catch{msg.textContent='Could not send sign-in link.'}});
profileForm?.addEventListener('submit',async e=>{e.preventDefault();try{await api('/api/account/profile',{method:'PATCH',body:JSON.stringify({displayName:profileName.value,phone:profilePhone.value,organizationName:profileOrg.value,timezone:profileTz.value})});profileMsg.textContent='Profile saved.'}catch(err){profileMsg.textContent=err.message}});
prefsForm?.addEventListener('submit',async e=>{e.preventDefault();try{await api('/api/account/preferences',{method:'PUT',body:JSON.stringify({marketingEmail:marketing.checked,productUpdates:updates.checked})});prefsMsg.textContent='Preferences saved.'}catch(err){prefsMsg.textContent=err.message}});
dataForm?.addEventListener('submit',async e=>{e.preventDefault();try{const d=await api('/api/account/data-request',{method:'POST',body:JSON.stringify({requestType:requestType.value,notes:requestNotes.value})});dataMsg.textContent='Request '+d.id+' submitted.';requestNotes.value='';await load()}catch(err){dataMsg.textContent=err.message}});
logout?.addEventListener('click',async()=>{await fetch('/api/auth/logout',{method:'POST'});location.href='/'});
load();`;
return frame("Account","Central identity",body,script);
}

export function opsPage(session){
const body=`<h1>Operations</h1><p class="lead">Executive control center for customers, leads, projects, finance, support, incidents and ecosystem status.</p><div id="metrics" class="grid"></div><h2 style="margin-top:30px">Property registry</h2><div id="properties" class="list"></div><h2 style="margin-top:30px">Recent leads</h2><div id="leads" class="list"></div><p class="muted">Signed in as ${esc(session.email||"authorized user")}.</p>`;
const script=authRedirect+`
async function load(){try{const d=await api('/api/ops/dashboard');const labels={customers:'Customers',leads:'Open Leads',projects:'Active Projects',openInvoices:'Open Invoices',openTickets:'Open Tickets',revenueCents:'Recorded Revenue',incidents:'Open Incidents'};metrics.innerHTML=Object.entries(d.metrics).map(([k,v])=>'<div class="card"><b>'+labels[k]+'</b><span class="'+(k==='incidents'&&v?'bad':'')+'">'+(k==='revenueCents'?'$'+(v/100).toLocaleString(undefined,{minimumFractionDigits:2}):v)+'</span></div>').join('');properties.innerHTML=d.properties.map(p=>'<div class="row"><div><b>'+p.name+'</b><div class="muted">'+p.hostname+'</div></div><div class="right">'+p.status+' · '+p.access_level+'</div></div>').join('')||'<p class="muted">No properties.</p>';leads.innerHTML=d.recentLeads.map(l=>'<div class="row"><div><b>'+l.id+'</b><div class="muted">'+(l.service_interest||'No service recorded')+'</div></div><div class="right">'+l.stage+'</div></div>').join('')||'<p class="muted">No leads yet.</p>'}catch(e){metrics.innerHTML='<div class="card bad">'+e.message+'</div>'}}load();`;
return frame("Operations","Private executive system",body,script);
}

export function bookingPage(){
const body=`<h1>Book an ATechSpot service</h1><p class="lead">Choose a service and preferred appointment time. Your booking is connected to your central ATechSpot customer record.</p>
<div class="grid two"><section class="card"><h2>New booking</h2><form id="form"><label>Service<select id="service" required></select></label><label>Start time<input id="start" type="datetime-local" required></label><button>Confirm booking</button><div id="msg" class="status"></div></form></section><section class="card"><h2>Your bookings</h2><div id="items" class="list"></div></section></div>`;
const script=authRedirect+`
let services=[];async function load(){try{services=(await api('/api/services')).services;service.innerHTML='<option value="">Select service</option>'+services.map(s=>'<option value="'+s.service_key+'">'+s.name+' ('+s.duration_minutes+' min)</option>').join('');const d=await api('/api/bookings');items.innerHTML=d.bookings.map(b=>'<div class="row"><div><b>'+b.service_name+'</b><div class="muted">'+new Date(b.starts_at).toLocaleString()+'</div></div><div>'+b.status+'</div></div>').join('')||'<p class="muted">No bookings yet.</p>'}catch(e){msg.textContent=e.message}}
form.addEventListener('submit',async e=>{e.preventDefault();const s=services.find(x=>x.service_key===service.value);if(!s)return;const a=new Date(start.value);const z=new Date(a.getTime()+s.duration_minutes*60000);try{const d=await api('/api/bookings',{method:'POST',body:JSON.stringify({serviceKey:s.service_key,startsAt:a.toISOString(),endsAt:z.toISOString(),timezone:Intl.DateTimeFormat().resolvedOptions().timeZone})});msg.textContent='Booking '+d.id+' confirmed.';await load()}catch(err){msg.textContent=err.message}});load();`;
return frame("Booking","Scheduling",body,script);
}

export function intakePage(){
const body=`<h1>Project intake</h1><p class="lead">Tell us what you need so the right ATechSpot workflow can review your request.</p><div class="grid two"><section class="card"><h2>Submit intake</h2><form id="form"><label>Service<select id="service" required></select></label><label>What are you trying to accomplish?<textarea id="goal" required></textarea></label><label>Current challenge<textarea id="challenge"></textarea></label><label>Important details<textarea id="details"></textarea></label><button>Submit intake</button><div id="msg" class="status"></div></form></section><section class="card"><h2>Your intake history</h2><div id="items" class="list"></div></section></div>`;
const script=authRedirect+`
async function load(){try{const s=(await api('/api/services')).services;service.innerHTML='<option value="">Select service</option>'+s.map(x=>'<option value="'+x.service_key+'">'+x.name+'</option>').join('');const d=await api('/api/intakes');items.innerHTML=d.intakes.map(x=>'<div class="row"><div><b>'+x.id+'</b><div class="muted">'+x.service_key+'</div></div><div>'+x.status+'</div></div>').join('')||'<p class="muted">No intake submissions yet.</p>'}catch(e){msg.textContent=e.message}}
form.addEventListener('submit',async e=>{e.preventDefault();try{const d=await api('/api/intakes',{method:'POST',body:JSON.stringify({serviceKey:service.value,answers:{goal:goal.value,challenge:challenge.value,details:details.value}})});msg.textContent='Intake '+d.id+' submitted.';form.reset();await load()}catch(err){msg.textContent=err.message}});load();`;
return frame("Intake","Secure onboarding",body,script);
}

export function clientPage(){
const body=`<h1>Client Portal</h1><p class="lead">View projects, milestones and billing records connected to your ATechSpot customer account.</p><h2>Projects</h2><div id="projects" class="list"></div><h2 style="margin-top:30px">Invoices</h2><div id="invoices" class="list"></div>`;
const script=authRedirect+`
async function load(){try{const [p,i]=await Promise.all([api('/api/projects'),api('/api/invoices')]);projects.innerHTML=p.projects.map(x=>'<div class="row"><div><b>'+x.name+'</b><div class="muted">'+x.completed_milestones+'/'+x.milestone_count+' milestones complete</div></div><div>'+x.status+'</div></div>').join('')||'<p class="muted">No active projects yet.</p>';invoices.innerHTML=i.invoices.map(x=>'<div class="row"><div><b>'+x.id+'</b><div class="muted">'+new Date(x.created_at).toLocaleDateString()+'</div></div><div class="right"><div class="money">$'+(x.amount_cents/100).toFixed(2)+'</div><small>'+x.status+'</small></div></div>').join('')||'<p class="muted">No invoices yet.</p>'}catch(e){projects.innerHTML='<p class="bad">'+e.message+'</p>'}}load();`;
return frame("Client Portal","Projects & billing",body,script);
}

export function payPage(){
const body=`<h1>ATechSpot Pay</h1><p class="lead">Review invoices and use only ATechSpot-approved secure payment-provider links. ATechSpot does not store raw card details in this portal.</p><div id="invoices" class="list"></div><p class="muted">If an invoice requires payment but no secure payment link is available, contact ATechSpot before sending funds.</p>`;
const script=authRedirect+`
async function load(){try{const d=await api('/api/invoices');invoices.innerHTML=d.invoices.map(x=>'<div class="row"><div><b>'+x.id+'</b><div class="muted">'+(x.description||'ATechSpot invoice')+' · Due '+(x.due_at?new Date(x.due_at).toLocaleDateString():'—')+'</div></div><div class="right"><div class="money">$'+(x.amount_cents/100).toFixed(2)+'</div><small>'+x.status+'</small>'+(x.payment_url&&x.status!=='paid'?'<div style="margin-top:8px"><a class="btn" rel="noopener noreferrer" href="'+x.payment_url+'">Pay securely</a></div>':'')+'</div></div>').join('')||'<p class="muted">No invoices are currently associated with your account.</p>'}catch(e){invoices.innerHTML='<p class="bad">'+e.message+'</p>'}}load();`;
return frame("Pay","Secure billing",body,script);
}

export function supportPage(){
const body=`<h1>Support</h1><p class="lead">Create and track support requests associated with your ATechSpot account.</p><div class="grid two"><section class="card"><h2>Open a ticket</h2><form id="form"><label>Category<select id="category"><option>Account</option><option>Billing</option><option>Project</option><option>Technical</option><option>Other</option></select></label><label>Priority<select id="priority"><option value="P3">Normal</option><option value="P2">High</option><option value="P1">Critical</option><option value="P4">Low</option></select></label><label>Subject<input id="subject" required maxlength="200"></label><label>Message<textarea id="message" required></textarea></label><button>Create ticket</button><div id="msg" class="status"></div></form></section><section class="card"><h2>Your tickets</h2><div id="items" class="list"></div></section></div>`;
const script=authRedirect+`
async function load(){try{const d=await api('/api/tickets');items.innerHTML=d.tickets.map(x=>'<div class="row"><div><b>'+x.subject+'</b><div class="muted">'+x.id+' · '+x.category+'</div></div><div class="right">'+x.priority+' · '+x.status+'</div></div>').join('')||'<p class="muted">No support tickets.</p>'}catch(e){msg.textContent=e.message}}
form.addEventListener('submit',async e=>{e.preventDefault();try{const d=await api('/api/tickets',{method:'POST',body:JSON.stringify({category:category.value,priority:priority.value,subject:subject.value,message:message.value})});msg.textContent='Ticket '+d.id+' created.';form.reset();await load()}catch(err){msg.textContent=err.message}});load();`;
return frame("Support","Customer support",body,script);
}

export function helpPage(){
const body=`<h1>Help Center</h1><p class="lead">Search ATechSpot self-service documentation before opening a support ticket.</p><form id="search"><label>Search help<input id="q" type="search" placeholder="Account, booking, billing…"></label><button>Search</button></form><div id="items" class="list"></div><div class="toolbar"><a class="btn secondary" href="https://support.atechspot.com/">Still need help? Open Support</a></div>`;
const script=`
async function load(term=''){const r=await fetch('/api/help/articles?q='+encodeURIComponent(term));const d=await r.json();items.innerHTML=(d.articles||[]).map(x=>'<article class="card"><h3>'+x.title+'</h3><p>'+x.body+'</p></article>').join('')||'<p class="muted">No matching articles.</p>'}search.addEventListener('submit',e=>{e.preventDefault();load(q.value)});load();`;
return frame("Help Center","Self service",body,script,"index,follow");
}

export function statusPage(){
const body=`<h1>System Status</h1><p class="lead">Current health for ATechSpot shared applications and active public incidents.</p><div id="services" class="grid"></div><h2 style="margin-top:30px">Active incidents</h2><div id="incidents" class="list"></div>`;
const script=`
async function load(){const r=await fetch('/api/status');const d=await r.json();services.innerHTML=d.services.map(x=>'<div class="card"><b>'+x.name+'</b><span class="'+(x.status==='operational'?'good':'warn')+'">'+x.status+'</span></div>').join('');incidents.innerHTML=(d.incidents||[]).map(x=>'<div class="card"><b>'+x.title+'</b><p>'+((x.public_message)||'Investigation in progress.')+'</p></div>').join('')||'<p class="good">No active incidents reported.</p>'}load();`;
return frame("Status","Service health",body,script,"index,follow");
}

export function shopPage(){
const body=`<h1>ATechSpot Shop</h1><p class="lead">Digital tools, templates, checklists and approved ATechSpot products.</p><div id="items" class="grid"></div>`;
const script=`
async function load(){const r=await fetch('/api/shop/products');const d=await r.json();items.innerHTML=(d.products||[]).map(x=>'<article class="card"><h3>'+x.name+'</h3><p>'+x.description+'</p><div class="money">$'+(x.price_cents/100).toFixed(2)+'</div>'+(x.payment_url?'<a class="btn" rel="noopener" href="'+x.payment_url+'">Purchase</a>':'<p class="muted">Not currently for sale.</p>')+'</article>').join('')||'<p class="muted">No products are published yet.</p>'}load();`;
return frame("Shop","Digital commerce",body,script,"index,follow");
}

export function partnerPage(){
const body=`<h1>Partners</h1><p class="lead">Apply for referral, affiliate, technology or strategic partnership consideration.</p><form id="form"><label>Partner type<select id="type"><option>Referral</option><option>Affiliate</option><option>Technology</option><option>Strategic</option><option>Reseller</option></select></label><label>Organization or professional name<input id="org" required maxlength="200"></label><button>Submit application</button><div id="msg" class="status"></div></form>`;
const script=authRedirect+`form.addEventListener('submit',async e=>{e.preventDefault();try{const d=await api('/api/partners/apply',{method:'POST',body:JSON.stringify({partnerType:type.value,organizationName:org.value})});msg.textContent='Application '+d.id+' submitted.';form.reset()}catch(err){msg.textContent=err.message}})`;
return frame("Partners","Partner program",body,script,"index,follow");
}

export function vendorPage(){
const body=`<h1>Vendors</h1><p class="lead">Submit an initial vendor or contractor application. Additional compliance documents are requested only when needed.</p><form id="form"><label>Organization or professional name<input id="org" required maxlength="200"></label><button>Submit application</button><div id="msg" class="status"></div></form>`;
const script=authRedirect+`form.addEventListener('submit',async e=>{e.preventDefault();try{const d=await api('/api/vendors/apply',{method:'POST',body:JSON.stringify({organizationName:org.value})});msg.textContent='Application '+d.id+' submitted.';form.reset()}catch(err){msg.textContent=err.message}})`;
return frame("Vendors","Vendor onboarding",body,script,"index,follow");
}

export function publicInfoPage(app){
const links={start:'<a class="btn" href="https://account.atechspot.com/">Create / access account</a>',press:'<a class="btn" href="https://www.atechspot.com/contact/">Media contact</a>',developers:'<a class="btn secondary" href="https://status.atechspot.com/">Platform status</a>'};
const body=`<h1>${esc(app.name)}</h1><p class="lead">${esc(app.purpose)}.</p><div class="card"><b>Phase 2 shared platform</b><p>This destination is part of the ATechSpot shared operating system. Content and capabilities are published only when they are operational and supportable.</p>${links[app.key]||''}</div>`;
return frame(app.name,"ATechSpot ecosystem",body,"","index,follow");
}
