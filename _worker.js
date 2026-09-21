const JSON_HEADERS={"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff","access-control-allow-origin":"https://www.atechspot.com","access-control-allow-methods":"GET,POST,OPTIONS","access-control-allow-headers":"content-type,accept"};
const json=(status,payload)=>new Response(JSON.stringify(payload),{status,headers:JSON_HEADERS});
const clean=(value,max=4000)=>String(value??"").replace(/\u0000/g,"").trim().slice(0,max);
const validEmail=value=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value)&&value.length<=254;
const escapeHtml=value=>String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");

const PUBLIC_INBOXES={jason:"jason@atechspot.com",hello:"hello@atechspot.com",sales:"sales@atechspot.com",support:"support@atechspot.com",billing:"billing@atechspot.com",legal:"legal@atechspot.com"};
const PRODUCTION_SENDER="ATechSpot Website <forms@atechspot.com>";
const PRODUCTION_RECIPIENT="aplustechucation@gmail.com";
const CLIENT_DASHBOARD_HTML="<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Client Dashboard | ATechSpot</title><meta name=\"robots\" content=\"noindex,nofollow,noarchive\"><meta http-equiv=\"Cache-Control\" content=\"no-store\"><link rel=\"stylesheet\" href=\"/command-a.css\"><link rel=\"stylesheet\" href=\"/command-b.css\"><link rel=\"stylesheet\" href=\"/system-pages.css\"><style>.client-page{min-height:100vh;background:#050a12;color:#eef7ff}.client-main{padding:54px 0 90px}.client-hero{display:flex;justify-content:space-between;gap:24px;align-items:flex-end;margin-bottom:28px}.client-hero h1{margin:10px 0 6px;font:800 clamp(2.5rem,5vw,4.5rem)/1 \"Segoe UI Variable Display\",\"Segoe UI\",system-ui,sans-serif;letter-spacing:-.05em}.client-email{color:#65dff0;font-weight:800}.client-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.client-card{padding:24px;border:1px solid #173a56;border-radius:18px;background:linear-gradient(145deg,#091b2b,#07131f)}.client-card small{display:block;color:#65dff0;font-weight:900;letter-spacing:.12em}.client-card h2{margin:12px 0 9px;font-size:1.25rem}.client-card p{color:#91a7ba;font-size:.9rem;line-height:1.7}.client-card a{color:#65dff0;font-weight:800}.client-band{margin-top:18px;padding:24px;border:1px solid #1d4a68;border-radius:18px;background:#081827}.client-band p{color:#91a7ba;line-height:1.7}@media(max-width:900px){.client-grid{grid-template-columns:1fr 1fr}.client-hero{align-items:flex-start;flex-direction:column}}@media(max-width:620px){.client-grid{grid-template-columns:1fr}}</style></head><body><div class=\"client-page\"><header class=\"site-header\"><a class=\"brand\" href=\"/\"><span class=\"brand-mark\">A+</span><span class=\"brand-name\">ATECH<span>SPOT</span><small>Client Portal</small></span></a><nav><a href=\"/contact/?department=support#contact-form\">Support</a><a href=\"/payments/\">Billing</a></nav><a class=\"btn btn-ghost btn-small\" href=\"/api/client-logout\">Sign Out</a></header><main class=\"client-main\"><div class=\"wrap\"><section class=\"client-hero\"><div><span class=\"sys-kicker\">AUTHENTICATED CLIENT DASHBOARD</span><h1>Welcome to your client workspace.</h1><p>Signed in as <span class=\"client-email\">__CLIENT_EMAIL__</span></p></div><a class=\"btn btn-primary\" href=\"/contact/?department=support#contact-form\">Contact Support →</a></section><div class=\"client-grid\"><article class=\"client-card\"><small>PROJECTS</small><h2>Project Status</h2><p>Project and milestone records will appear here when the structured project-data layer is provisioned.</p><a href=\"/contact/?department=sales&subject=Project%20Status#contact-form\">Ask about a project →</a></article><article class=\"client-card\"><small>FILES + APPROVALS</small><h2>Deliverables</h2><p>Use the secure support route for file, approval, or deliverable questions until dedicated document workflows are connected.</p><a href=\"/contact/?department=support&subject=Files%20or%20Approvals#contact-form\">Files & approvals help →</a></article><article class=\"client-card\"><small>BILLING</small><h2>Payments & Invoices</h2><p>Review billing policies and route invoice or payment questions without sending card details.</p><a href=\"/payments/\">Open billing center →</a></article><article class=\"client-card\"><small>SCHEDULING</small><h2>Book a Meeting</h2><p>Choose an available consultation or project conversation through the official booking layer.</p><a href=\"/booking/\">Book a time →</a></article><article class=\"client-card\"><small>SUPPORT</small><h2>Get Help</h2><p>Route active-client technical, account, project, and service questions to support.</p><a href=\"/contact/?department=support#contact-form\">Open support →</a></article><article class=\"client-card\"><small>GROWTHCARE</small><h2>Ongoing Optimization</h2><p>Discuss maintenance, monitoring and relevant next-stage improvements after value is delivered.</p><a href=\"/intake/?topic=GrowthCare%20Ongoing%20Optimization#project-intake\">Discuss GrowthCare →</a></article></div><section class=\"client-band\"><strong>Portal security standard</strong><p>This dashboard requires a valid signed session. Project-specific records remain out of static browser code. Structured project data, file storage, approvals, invoices and messaging should only be added behind authenticated server-side access controls.</p></section></div></main></div></body></html>";
const CANONICAL_REDIRECTS=new Map([
  ["/services","/services/"],["/services.html","/services/"],["/solutions","/services/"],["/solutions/","/services/"],["/solutions.html","/services/"],
  ["/app","/app/"],["/app.html","/app/"],["/apps","/app/"],["/apps/","/app/"],["/apps.html","/app/"],
  ["/about","/about/"],["/about.html","/about/"],["/contact","/contact/"],["/contact.html","/contact/"],["/intake","/intake/"],["/intake.html","/intake/"],["/intake/thank-you","/intake/thank-you/"],
  ["/assessment","/assessment/"],["/assessment.html","/assessment/"],["/business-assessment","/assessment/"],["/business-assessment.html","/assessment/"],
  ["/technology-assessment","/assessment/"],["/technology-assessment.html","/assessment/"],["/business-intake","/assessment/"],["/business-intake.html","/assessment/"],
  ["/ai-readiness","/ai-readiness/"],["/ai-readiness.html","/ai-readiness/"],
  ["/business","/assessment/"],["/business/","/assessment/"],["/business.html","/assessment/"],
  ["/ecosystem","/ecosystem/"],["/ecosystem.html","/ecosystem/"],["/resources","/resources/"],["/resources.html","/resources/"],
  ["/privacy","/privacy/"],["/privacy.html","/privacy/"],["/terms","/terms/"],["/terms.html","/terms/"],["/accessibility","/accessibility/"],["/accessibility.html","/accessibility/"],
  ["/affiliate-disclosure","/affiliate-disclosure/"],["/affiliate-disclosure.html","/affiliate-disclosure/"],["/booking","/booking/"],["/booking.html","/booking/"],["/clients","/clients/"],["/clients.html","/clients/"],["/remote-support","/remote-support/"],["/remote-support.html","/remote-support/"],["/creator","/creator/"],["/creator.html","/creator/"]
]);

const LEGACY_PREFIXES=[
  "/atechspot-01-production-10-10/",
  "/atechspot-site/",
  "/atechspot-ai-site/",
  "/atechspot-final-website/",
  "/AtechSpot_V24_CLOUDFLARE_READY_DEPLOYMENT_INTRO_PRODUCTS_FORMS/",
  "/AtechSpot-GrowthOS-Portfolio-Proof-Merge-10of10/",
  "/main-site/"
];

const LINK_REWRITES=new Map([
  ["https://creator.atechspot.com/","/creator/"],["https://creator.atechspot.com","/creator/"],
  ["/resources.html","/resources/"],["/privacy.html","/privacy/"],["/terms.html","/terms/"],["/accessibility.html","/accessibility/"],["/affiliate-disclosure.html","/affiliate-disclosure/"],["/remote-support.html","/remote-support/"],
  ["/apps/","/app/"],["/apps","/app/"],["/apps.html","/app/"],["/business.html","/assessment/"],["/business/","/assessment/"]
]);


const bytesToB64u=bytes=>{let s="";for(const b of bytes)s+=String.fromCharCode(b);return btoa(s).replaceAll("+","-").replaceAll("/","_").replace(/=+$/,"")};
const b64uToBytes=value=>{const pad=value.replaceAll("-","+").replaceAll("_","/");const raw=atob(pad+"=".repeat((4-pad.length%4)%4));return Uint8Array.from(raw,c=>c.charCodeAt(0))};
const textToB64u=value=>bytesToB64u(new TextEncoder().encode(value));
const b64uToText=value=>new TextDecoder().decode(b64uToBytes(value));
async function portalKey(env){if(!env.PORTAL_SIGNING_SECRET)return null;return crypto.subtle.importKey("raw",new TextEncoder().encode(env.PORTAL_SIGNING_SECRET),{name:"HMAC",hash:"SHA-256"},false,["sign","verify"])}
async function signPortalToken(env,payload){const key=await portalKey(env);if(!key)throw new Error("PORTAL_SIGNING_SECRET missing");const data=textToB64u(JSON.stringify(payload));const sig=await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(data));return data+"."+bytesToB64u(new Uint8Array(sig))}
async function verifyPortalToken(env,token,purpose){try{const [data,sig]=String(token||"").split(".");if(!data||!sig)return null;const key=await portalKey(env);if(!key)return null;const ok=await crypto.subtle.verify("HMAC",key,b64uToBytes(sig),new TextEncoder().encode(data));if(!ok)return null;const payload=JSON.parse(b64uToText(data));if(payload.purpose!==purpose||!payload.email||Number(payload.exp)<Date.now())return null;return payload}catch{return null}}
function clientAllowlist(env){const raw=clean(env.CLIENT_PORTAL_USERS||"",10000);if(!raw)return new Set();try{const parsed=JSON.parse(raw);if(Array.isArray(parsed))return new Set(parsed.map(x=>clean(x,254).toLowerCase()).filter(validEmail))}catch{}return new Set(raw.split(",").map(x=>x.trim().toLowerCase()).filter(validEmail))}
function cookieValue(request,name){const raw=request.headers.get("cookie")||"";for(const item of raw.split(";")){const [k,...rest]=item.trim().split("=");if(k===name)return rest.join("=")}return""}

function redirectResponse(request,url,status=301){const target=new URL(url,request.url);return Response.redirect(target.toString(),status)}
async function parseBody(request){const type=request.headers.get("content-type")||"";if(type.includes("application/json"))return request.json();return Object.fromEntries((await request.formData()).entries())}
async function resend(env,payload){
  const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{authorization:`Bearer ${env.RESEND_API_KEY}`,"content-type":"application/json"},body:JSON.stringify(payload)});
  const text=await response.text();
  let parsed={};try{parsed=JSON.parse(text)}catch{}
  if(!response.ok){const error=new Error(`Resend request failed with HTTP ${response.status}`);error.status=response.status;error.providerCode=clean(parsed.name||parsed.code||"RESEND_ERROR",80);error.providerMessage=clean(parsed.message||text||"Unknown Resend error",240);throw error}
  return parsed;
}
function publicInboxFor(leadType,fields){const department=clean(fields.Department||"",40).toLowerCase();if(PUBLIC_INBOXES[department])return PUBLIC_INBOXES[department];if(leadType.includes("Support"))return PUBLIC_INBOXES.support;if(leadType.includes("Assessment"))return PUBLIC_INBOXES.jason;if(leadType.includes("Project"))return PUBLIC_INBOXES.sales;return PUBLIC_INBOXES.hello}

async function deliverLead(request,env,leadType,requiredFields,{confirmation=true}={}){
  let body;try{body=await parseBody(request)}catch{return json(400,{ok:false,message:"Invalid form submission."})}
  if(clean(body.website,100))return json(200,{ok:true,message:"Thank you."});
  const started=Number(body.form_started_at||0),elapsed=Date.now()-started;if(!started||elapsed<1200||elapsed>86400000)return json(400,{ok:false,message:"Please reload the page and complete the form again."});
  const name=clean(body["Full Name"]||body.Name,120),email=clean(body.Email,254);if(name.length<2||!validEmail(email))return json(400,{ok:false,message:"Enter a valid name and email address."});
  for(const field of requiredFields){if(!clean(body[field]))return json(400,{ok:false,message:`Complete the ${field} field.`})}
  if(!env.RESEND_API_KEY)return json(503,{ok:false,code:"MISSING_RESEND_KEY",message:"Secure form delivery is temporarily unavailable."});
  const ignored=new Set(["website","form_started_at","cf-turnstile-response"]),fields={};for(const [key,value] of Object.entries(body)){if(!ignored.has(key))fields[clean(key,100)]=clean(value)}
  const combined=Object.values(fields).join("\n");if((combined.match(/https?:\/\/|www\./gi)||[]).length>5||/<\s*(script|iframe|object|embed)/i.test(combined))return json(400,{ok:false,message:"Submission rejected."});
  const publicInbox=publicInboxFor(leadType,fields);fields["ATechSpot Routing Identity"]=publicInbox;
  const rows=Object.entries(fields).map(([key,value])=>`<tr><th style="text-align:left;vertical-align:top;padding:9px;border:1px solid #d8e0e8;background:#f4f7fa">${escapeHtml(key)}</th><td style="padding:9px;border:1px solid #d8e0e8">${escapeHtml(value).replace(/\n/g,"<br>")}</td></tr>`).join("");
  try{
    await resend(env,{from:PRODUCTION_SENDER,to:[PRODUCTION_RECIPIENT],reply_to:email,subject:`[ATechSpot / ${publicInbox}] ${leadType} — ${name}`,html:`<h2>${escapeHtml(leadType)}</h2><p>A new request was submitted through ATechSpot.com and routed under <strong>${escapeHtml(publicInbox)}</strong>.</p><table style="border-collapse:collapse;width:100%;max-width:850px">${rows}</table><p>Reply to this email to respond directly to ${escapeHtml(name)} at ${escapeHtml(email)}.</p>`});
  }catch(error){console.error("ATechSpot internal email delivery failed",{status:error?.status,providerCode:error?.providerCode,providerMessage:error?.providerMessage});return json(503,{ok:false,code:"EMAIL_DELIVERY_FAILED",providerStatus:error?.status||null,providerCode:error?.providerCode||"UNKNOWN",message:"We could not send your request right now. Please try again shortly or call (713) 396-2993."})}
  let confirmationSent=false;if(confirmation){try{await resend(env,{from:PRODUCTION_SENDER,to:[email],reply_to:publicInbox,subject:"We received your ATechSpot request",html:`<p>Hi ${escapeHtml(name)},</p><p>Thank you for contacting ATechSpot. We received your request and routed it to <strong>${escapeHtml(publicInbox)}</strong>.</p><p>We will review the business problem, desired outcome, timing and fit before recommending the appropriate next step.</p><p>Submitting the form does not create a client relationship, establish a final price, guarantee project acceptance or reserve a schedule. Any scope, pricing or scheduling commitment will be confirmed separately in writing.</p><p>— ATechSpot<br><small>Operated by A+ Techucation LLC</small></p>`});confirmationSent=true}catch(error){console.warn("ATechSpot confirmation email was not sent",{status:error?.status,providerCode:error?.providerCode})}}
  return json(200,{ok:true,confirmationSent,routedTo:publicInbox,deliveredTo:PRODUCTION_RECIPIENT,message:"Thank you. Your request was received successfully."});
}

function transformHtml(response,url){
  const type=response.headers.get("content-type")||"";
  if(!type.includes("text/html"))return response;
  let rewriter=new HTMLRewriter()
    .on('a[href]',{element(element){
      const href=element.getAttribute('href');
      if(LINK_REWRITES.has(href))element.setAttribute('href',LINK_REWRITES.get(href));
    }});
  if(url.pathname.startsWith('/intake')){
    rewriter=rewriter
      .on('.site-header nav a[href="/app/"]',{element(element){element.setAttribute('href','/assessment/');element.setInnerContent('Assessment')}})
      .on('footer a[href="/app/"]',{element(element){element.setAttribute('href','/assessment/');element.setInnerContent('Assessment')}});
  }
  return rewriter.transform(response);
}

export default{async fetch(request,env){
  const url=new URL(request.url);
  if(request.method==="OPTIONS"&&url.pathname.startsWith("/api/"))return new Response(null,{status:204,headers:JSON_HEADERS});
  if(url.hostname==='atechspot.com'&&!url.pathname.startsWith('/.well-known/')){url.hostname='www.atechspot.com';return Response.redirect(url.toString(),request.method==='GET'||request.method==='HEAD'?301:308)}
  if(url.hostname==='www.atechspot.com'&&url.pathname.startsWith('/clients')){url.hostname='account.atechspot.com';return Response.redirect(url.toString(),request.method==='GET'||request.method==='HEAD'?301:308)}
  if(url.hostname==='account.atechspot.com'){
    if(url.pathname==='/'||url.pathname===''){url.pathname='/clients/';return Response.redirect(url.toString(),302)}
    if(url.pathname==='/dashboard'||url.pathname==='/dashboard/'){url.pathname='/clients/dashboard/';return Response.redirect(url.toString(),302)}
  }
  if(LEGACY_PREFIXES.some(prefix=>url.pathname.startsWith(prefix)))return redirectResponse(request,'/',301);

  if(url.pathname==="/api/client-access"){
    if(request.method!=="POST")return json(405,{ok:false,message:"Method not allowed."});
    let body;try{body=await parseBody(request)}catch{return json(400,{ok:false,message:"Invalid request."})}
    const email=clean(body.Email||body.email,254).toLowerCase();
    const started=Number(body.form_started_at||0),elapsed=Date.now()-started;
    if(!validEmail(email)||!started||elapsed<900||elapsed>86400000)return json(400,{ok:false,message:"Enter a valid email and try again."});
    const configured=Boolean(env.RESEND_API_KEY&&env.PORTAL_SIGNING_SECRET&&env.CLIENT_PORTAL_USERS);
    const allowed=configured&&clientAllowlist(env).has(email);
    if(allowed){
      try{
        const token=await signPortalToken(env,{email,purpose:"magic",exp:Date.now()+20*60*1000});
        const link=new URL("/api/client-login","https://account.atechspot.com");link.searchParams.set("token",token);
        await resend(env,{from:PRODUCTION_SENDER,to:[email],reply_to:PUBLIC_INBOXES.support,subject:"Your secure ATechSpot Client Portal link",html:`<p>Your secure ATechSpot Client Portal sign-in link is ready.</p><p><a href="${escapeHtml(link.toString())}">Open Client Portal</a></p><p>This link expires in 20 minutes. If you did not request it, you can ignore this email.</p><p>For your security, do not forward this link.</p>`});
      }catch(error){console.error("Client portal magic-link delivery failed",{status:error?.status,providerCode:error?.providerCode})}
    }
    return json(200,{ok:true,configured,message:"If this email is authorized for an active ATechSpot client account, a secure sign-in link will be sent."});
  }
  if(url.pathname==="/api/client-login"){
    if(request.method!=="GET")return json(405,{ok:false,message:"Method not allowed."});
    const payload=await verifyPortalToken(env,url.searchParams.get("token"),"magic");
    if(!payload)return redirectResponse(request,"/clients/?error=expired",302);
    if(!clientAllowlist(env).has(String(payload.email).toLowerCase()))return redirectResponse(request,"/clients/?error=access",302);
    const session=await signPortalToken(env,{email:payload.email,purpose:"session",exp:Date.now()+8*60*60*1000});
    return new Response(null,{status:302,headers:{location:"/clients/dashboard/","set-cookie":`atechspot_client=${session}; Path=/; Max-Age=28800; HttpOnly; Secure; SameSite=Lax`,"cache-control":"no-store","x-robots-tag":"noindex,nofollow"}});
  }
  if(url.pathname==="/api/client-logout"){
    return new Response(null,{status:302,headers:{location:"/clients/","set-cookie":"atechspot_client=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax","cache-control":"no-store","x-robots-tag":"noindex,nofollow"}});
  }
  if(url.pathname==="/clients/dashboard/"||url.pathname==="/clients/dashboard"){
    if(request.method!=="GET"&&request.method!=="HEAD")return new Response("Method not allowed",{status:405});
    const payload=await verifyPortalToken(env,cookieValue(request,"atechspot_client"),"session");
    if(!payload||!clientAllowlist(env).has(String(payload.email).toLowerCase()))return redirectResponse(request,"/clients/",302);
    const body=CLIENT_DASHBOARD_HTML.replace("__CLIENT_EMAIL__",escapeHtml(payload.email));
    return new Response(body,{status:200,headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-store, max-age=0, must-revalidate","x-robots-tag":"noindex,nofollow,noarchive","referrer-policy":"no-referrer","x-content-type-options":"nosniff","x-frame-options":"DENY"}});

  }

  if(url.pathname==="/api/form-health"){if(request.method!=="GET")return json(405,{ok:false,message:"Method not allowed."});const resendConfigured=Boolean(env.RESEND_API_KEY);return json(resendConfigured?200:503,{ok:resendConfigured,resendConfigured,deployment:"ATECHSPOT-PRODUCTION-MAIL-20260912",sender:PRODUCTION_SENDER,recipient:PRODUCTION_RECIPIENT,publicInboxes:Object.values(PUBLIC_INBOXES)})}
  if(url.pathname==="/api/contact"){if(request.method!=="POST")return json(405,{ok:false,message:"Method not allowed."});return deliverLead(request,env,"Contact Request",["Message"],{confirmation:true})}
  if(url.pathname==="/api/intake"){if(request.method!=="POST")return json(405,{ok:false,message:"Method not allowed."});return deliverLead(request,env,"Project Intake",["Topic","Preferred Timeframe","Budget Range","Message","Desired Outcome"],{confirmation:true})}
  if(url.pathname==="/api/assessment"){if(request.method!=="POST")return json(405,{ok:false,message:"Method not allowed."});return deliverLead(request,env,"Business Growth Assessment",["Assessment Type","Primary Goal","Current Challenge","Desired Outcome"],{confirmation:true})}
  if(url.pathname==="/api/data-recovery"){if(request.method!=="POST")return json(405,{ok:false,message:"Method not allowed."});return deliverLead(request,env,"Remote Support / Data Recovery",["Device Type","Problem Description"],{confirmation:true})}
  if((request.method==="GET"||request.method==="HEAD")&&CANONICAL_REDIRECTS.has(url.pathname)){const target=CANONICAL_REDIRECTS.get(url.pathname);if(target!==url.pathname)return redirectResponse(request,target,301)}
  return transformHtml(await env.ASSETS.fetch(request),url);
}};