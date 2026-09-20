function esc(v=""){return String(v ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}

const css=`
:root{color-scheme:dark;--bg:#050a12;--panel:#0b1420;--panel2:#07111c;--line:#183047;--text:#eef7ff;--muted:#91a9bd;--cyan:#66d9ff;--blue:#2c7dff;--good:#32d583;--warn:#f7b955;--bad:#ff6b6b}
*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;background:radial-gradient(circle at 80% 0,#0d2741 0,transparent 34%),var(--bg);color:var(--text);min-height:100vh}
a{color:var(--cyan)}.shell{width:min(1440px,calc(100% - 28px));margin:auto;padding:24px 0 60px}.top{display:flex;justify-content:space-between;align-items:center;gap:18px;padding:8px 0 22px}.brand{font-weight:900;letter-spacing:.06em;text-decoration:none;color:var(--text)}.brand span{color:var(--cyan)}.nav{display:flex;gap:14px;flex-wrap:wrap}.nav a{font-size:.9rem;text-decoration:none;color:var(--muted)}
main{padding:28px;border:1px solid var(--line);border-radius:24px;background:linear-gradient(180deg,rgba(13,28,43,.92),rgba(7,15,25,.96));box-shadow:0 30px 90px rgba(0,0,0,.3)}
.badge{display:inline-flex;gap:8px;align-items:center;border:1px solid #1d5b80;border-radius:999px;padding:8px 12px;color:var(--cyan);font-size:.76rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.dot{width:8px;height:8px;border-radius:50%;background:var(--good);box-shadow:0 0 14px var(--good)}
h1{font-size:clamp(2rem,5vw,4rem);line-height:1;margin:20px 0 12px;letter-spacing:-.05em}h2{font-size:1.2rem;margin:0 0 12px}p{color:var(--muted);line-height:1.55}.lead{max-width:860px}.muted{color:var(--muted)}.good{color:var(--good)}.warn{color:var(--warn)}.bad{color:var(--bad)}
.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:24px 0}.metric,.card{border:1px solid var(--line);border-radius:15px;padding:16px;background:var(--panel2);min-width:0}.metric b,.card b{display:block}.metric strong{display:block;font-size:1.55rem;margin-top:7px}.metric small{color:var(--muted)}
.modules{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.wide{grid-column:1/-1}.table-wrap{overflow:auto}.table{width:100%;border-collapse:collapse}.table th,.table td{text-align:left;padding:10px;border-bottom:1px solid var(--line);font-size:.88rem;white-space:nowrap}.table th{color:var(--muted);font-weight:700}.empty{color:var(--muted);padding:12px 0}.section-meta{font-size:.8rem;color:var(--muted);margin-top:-4px;margin-bottom:10px}.pill{display:inline-flex;border:1px solid var(--line);border-radius:999px;padding:4px 8px;font-size:.74rem}.toolbar{display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:12px}.opsnav{display:flex;gap:8px;flex-wrap:wrap;margin:18px 0 24px;padding:12px;border:1px solid var(--line);border-radius:14px;background:#07111c}.opsnav a{padding:7px 10px;border-radius:8px;text-decoration:none;color:var(--muted);font-size:.82rem}.opsnav a:hover{background:#102235;color:var(--text)}
@media(max-width:1000px){.metrics{grid-template-columns:repeat(2,1fr)}.modules{grid-template-columns:1fr}.wide{grid-column:auto}}@media(max-width:600px){main{padding:18px}.metrics{grid-template-columns:1fr}.top{align-items:flex-start;flex-direction:column}}
`;

function frame(body){
return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>ATechSpot Executive Operating System</title><style>${css}</style></head><body><div class="shell"><header class="top"><a class="brand" href="https://www.atechspot.com/">A+ <span>ATECHSPOT</span></a><nav class="nav"><a href="https://account.atechspot.com/">Account</a><a href="https://clients.atechspot.com/">Clients</a><a href="https://support.atechspot.com/">Support</a><a href="https://status.atechspot.com/">Status</a></nav></header><main>${body}</main></div></body></html>`
}

export function opsControlCenterPage(session){
const body=`
<div class="toolbar"><span class="badge"><span class="dot"></span>Private executive system</span><span class="pill">Role-based access</span></div>
<h1 data-build="ops-2026-09-20">ATechSpot Operations</h1>
<p class="lead">Executive control center for the ATechSpot ecosystem. Monitor revenue, sales, brands, projects, support, incidents, content, affiliates, compliance, vendors, launches and operating procedures from one private system.</p>
<section id="executive"><h2 style="margin:24px 0 10px">Executive Dashboard</h2><div class="section-meta">Company-wide operating health and priority metrics.</div><div id="metrics" class="metrics"></div></section>
<div class="modules">
<section id="properties" class="card wide"><h2>Property Directory</h2><div class="section-meta">Registered ATechSpot properties, operating status and access level.</div><div id="propertyDirectory"></div></section>\n<section id="domains" class="card wide"><h2>Domain Status</h2><div class="section-meta">DNS, SSL and HTTP health for each registered hostname.</div><div id="domainStatus"></div></section>
<section id="sales" class="card"><h2>Sales Pipeline</h2><div id="pipeline"></div></section>
<section id="revenue-section" class="card"><h2>Revenue by Brand</h2><div id="revenue"></div></section>
<section id="leads-section" class="card"><h2>Leads by Brand</h2><div id="leads"></div></section>
<section id="projects-section" class="card"><h2>Active Projects</h2><div id="projects"></div></section>
<section id="invoices-section" class="card"><h2>Outstanding Invoices</h2><div id="invoices"></div></section>
<section id="support-section" class="card"><h2>Support Volume</h2><div id="support"></div></section>
<section id="incidents-section" class="card"><h2>Website Incidents</h2><div id="incidents"></div></section>
<section id="content-section" class="card"><h2>Content Calendar</h2><div id="content"></div></section>
<section id="affiliates-section" class="card"><h2>Affiliate Performance</h2><div id="affiliates"></div></section>
<section id="compliance-section" class="card"><h2>Compliance Calendar</h2><div id="compliance"></div></section>
<section id="vendors-section" class="card"><h2>Vendor Records</h2><div id="vendors"></div></section>
<section id="launches-section" class="card"><h2>Launch Checklists</h2><div id="launches"></div></section>
<section id="sops-section" class="card"><h2>Standard Operating Procedures</h2><div id="sops"></div></section>
</div>
<p class="muted">Signed in as ${esc(session?.email || "authorized user")}.</p>
<script>
const money=n=>'$'+((Number(n)||0)/100).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
const fmt=d=>d?new Date(d).toLocaleDateString():'—';
const table=(headers,rows)=>rows&&rows.length?'<div class="table-wrap"><table class="table"><thead><tr>'+headers.map(h=>'<th>'+h+'</th>').join('')+'</tr></thead><tbody>'+rows.join('')+'</tbody></table></div>':'<div class="empty">No records yet.</div>';
const safe=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
async function load(){
 const r=await fetch('/api/ops/dashboard',{headers:{Accept:'application/json'}});
 if(r.status===401){location.href='https://account.atechspot.com/?returnTo='+encodeURIComponent(location.href);return}
 const d=await r.json();if(!r.ok)throw new Error(d.error||'Unable to load operations data.');
 const labels={customers:'Customers',openLeads:'Open Leads',pipelineValueCents:'Pipeline Value',activeProjects:'Active Projects',outstandingInvoiceCents:'Outstanding',openTickets:'Open Tickets',revenueCents:'Recorded Revenue',openIncidents:'Open Incidents'};
 metrics.innerHTML=Object.entries(d.metrics).map(([k,v])=>'<div class="metric"><small>'+safe(labels[k]||k)+'</small><strong class="'+((k==='openIncidents'&&v)?'bad':'')+'">'+((k.endsWith('Cents'))?money(v):Number(v).toLocaleString())+'</strong></div>').join('');
 propertyDirectory.innerHTML=table(['Property','Hostname','Status','Access'],(d.properties||[]).map(x=>'<tr><td>'+safe(x.name)+'</td><td>'+safe(x.hostname)+'</td><td>'+safe(x.status)+'</td><td>'+safe(x.access_level||'—')+'</td></tr>'));domainStatus.innerHTML=table(['Hostname','DNS','SSL','HTTP','Last Checked'],(d.properties||[]).map(x=>'<tr><td>'+safe(x.hostname)+'</td><td>'+safe(x.dns_status||'unknown')+'</td><td>'+safe(x.ssl_status||'unknown')+'</td><td>'+safe(x.http_status||'—')+'</td><td>'+fmt(x.last_checked_at)+'</td></tr>'));
 pipeline.innerHTML=table(['Stage','Leads','Value'],(d.pipeline||[]).map(x=>'<tr><td>'+safe(x.stage)+'</td><td>'+safe(x.lead_count)+'</td><td>'+money(x.value_cents)+'</td></tr>'));
 revenue.innerHTML=table(['Brand','Revenue'],(d.revenueByBrand||[]).map(x=>'<tr><td>'+safe(x.brand_name)+'</td><td>'+money(x.revenue_cents)+'</td></tr>'));
 leads.innerHTML=table(['Brand','Leads'],(d.leadsByBrand||[]).map(x=>'<tr><td>'+safe(x.brand_name)+'</td><td>'+safe(x.lead_count)+'</td></tr>'));
 projects.innerHTML=table(['Project','Property','Status','Due'],(d.projects||[]).map(x=>'<tr><td>'+safe(x.name)+'</td><td>'+safe(x.property_name)+'</td><td>'+safe(x.status)+'</td><td>'+fmt(x.due_at)+'</td></tr>'));
 invoices.innerHTML=table(['Invoice','Property','Amount','Status','Due'],(d.invoices||[]).map(x=>'<tr><td>'+safe(x.id)+'</td><td>'+safe(x.property_name)+'</td><td>'+money(x.amount_cents)+'</td><td>'+safe(x.status)+'</td><td>'+fmt(x.due_at)+'</td></tr>'));
 support.innerHTML=table(['Status','Tickets'],(d.supportVolume||[]).map(x=>'<tr><td>'+safe(x.status)+'</td><td>'+safe(x.ticket_count)+'</td></tr>'));
 incidents.innerHTML=table(['Incident','Service','Severity','Status'],(d.incidents||[]).map(x=>'<tr><td>'+safe(x.title)+'</td><td>'+safe(x.service_key)+'</td><td>'+safe(x.severity)+'</td><td>'+safe(x.status)+'</td></tr>'));
 content.innerHTML=table(['Title','Channel','Status','Scheduled'],(d.contentCalendar||[]).map(x=>'<tr><td>'+safe(x.title)+'</td><td>'+safe(x.channel)+'</td><td>'+safe(x.status)+'</td><td>'+fmt(x.scheduled_at)+'</td></tr>'));
 affiliates.innerHTML=table(['Partner','Conversions','Revenue','Commission'],(d.affiliatePerformance||[]).map(x=>'<tr><td>'+safe(x.partner_name||x.partner_id||'Unassigned')+'</td><td>'+safe(x.conversions)+'</td><td>'+money(x.revenue_cents)+'</td><td>'+money(x.commission_cents)+'</td></tr>'));
 compliance.innerHTML=table(['Requirement','Category','Due','Status'],(d.complianceCalendar||[]).map(x=>'<tr><td>'+safe(x.title)+'</td><td>'+safe(x.category)+'</td><td>'+fmt(x.due_at)+'</td><td>'+safe(x.status)+'</td></tr>'));
 vendors.innerHTML=table(['Vendor','Category','Contract','Renewal'],(d.vendorRecords||[]).map(x=>'<tr><td>'+safe(x.organization_name||x.contact_name||x.id)+'</td><td>'+safe(x.service_category||'—')+'</td><td>'+safe(x.contract_status)+'</td><td>'+fmt(x.renewal_at)+'</td></tr>'));
 launches.innerHTML=table(['Launch','Property','Status','Target'],(d.launchChecklists||[]).map(x=>'<tr><td>'+safe(x.name)+'</td><td>'+safe(x.property_name||'—')+'</td><td>'+safe(x.status)+'</td><td>'+fmt(x.target_launch_at)+'</td></tr>'));
 sops.innerHTML=table(['SOP','Category','Version','Status','Review'],(d.sops||[]).map(x=>'<tr><td>'+safe(x.title)+'</td><td>'+safe(x.category)+'</td><td>'+safe(x.version)+'</td><td>'+safe(x.status)+'</td><td>'+fmt(x.review_due_at)+'</td></tr>'));
}
load().catch(e=>{metrics.innerHTML='<div class="metric bad">'+safe(e.message)+'</div>'});
</script>`;
return frame(body);
}
