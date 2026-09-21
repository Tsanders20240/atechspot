const JSON_HEADERS={"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff","access-control-allow-origin":"https://www.atechspot.com","access-control-allow-methods":"GET,POST,OPTIONS","access-control-allow-headers":"content-type,accept"};
const json=(status,payload)=>new Response(JSON.stringify(payload),{status,headers:JSON_HEADERS});
const clean=(value,max=4000)=>String(value??"").replace(/\u0000/g,"").trim().slice(0,max);
const validEmail=value=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value)&&value.length<=254;
const escapeHtml=value=>String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");

const PUBLIC_INBOXES={jason:"jason@atechspot.com",hello:"hello@atechspot.com",sales:"sales@atechspot.com",support:"support@atechspot.com",billing:"billing@atechspot.com",legal:"legal@atechspot.com"};
const PRODUCTION_SENDER="ATechSpot Website <forms@atechspot.com>";
const PRODUCTION_RECIPIENT="aplustechucation@gmail.com";
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
  if(url.hostname==='account.atechspot.com'){
    if(url.pathname==='/'||url.pathname===''){url.pathname='/clients/';return Response.redirect(url.toString(),302)}
    if(url.pathname==='/dashboard'||url.pathname==='/dashboard/'){url.pathname='/portal/dashboard/';return Response.redirect(url.toString(),302)}
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
        const link=new URL("/api/client-login",url.origin);link.searchParams.set("token",token);
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
    return new Response(null,{status:302,headers:{location:"/portal/dashboard/","set-cookie":`atechspot_client=${session}; Path=/; Max-Age=28800; HttpOnly; Secure; SameSite=Lax`,"cache-control":"no-store","x-robots-tag":"noindex,nofollow"}});
  }
  if(url.pathname==="/api/client-logout"){
    return new Response(null,{status:302,headers:{location:"/clients/","set-cookie":"atechspot_client=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax","cache-control":"no-store","x-robots-tag":"noindex,nofollow"}});
  }
  if(url.pathname.startsWith("/_portal/"))return new Response("Not found",{status:404,headers:{"cache-control":"no-store","x-robots-tag":"noindex,nofollow,noarchive"}});
  if(url.pathname==="/portal/dashboard/"||url.pathname==="/portal/dashboard"||url.pathname==="/clients/dashboard/"||url.pathname==="/clients/dashboard"){
    if(request.method!=="GET"&&request.method!=="HEAD")return new Response("Method not allowed",{status:405});
    const payload=await verifyPortalToken(env,cookieValue(request,"atechspot_client"),"session");
    if(!payload||!clientAllowlist(env).has(String(payload.email).toLowerCase()))return redirectResponse(request,"/clients/",302);
    const assetUrl=new URL("/_portal/dashboard.html",request.url);
    const asset=await env.ASSETS.fetch(new Request(assetUrl.toString(),request));
    const headers=new Headers(asset.headers);headers.set("cache-control","no-store");headers.set("x-robots-tag","noindex,nofollow,noarchive");headers.set("referrer-policy","no-referrer");
    let response=new Response(asset.body,{status:asset.status,statusText:asset.statusText,headers});
    if((headers.get("content-type")||"").includes("text/html"))response=new HTMLRewriter().on("[data-client-email]",{element(el){el.setInnerContent(payload.email)}}).transform(response);
    return response;
  }

  if(url.pathname==="/api/form-health"){if(request.method!=="GET")return json(405,{ok:false,message:"Method not allowed."});const resendConfigured=Boolean(env.RESEND_API_KEY);return json(resendConfigured?200:503,{ok:resendConfigured,resendConfigured,deployment:"ATECHSPOT-PRODUCTION-MAIL-20260912",sender:PRODUCTION_SENDER,recipient:PRODUCTION_RECIPIENT,publicInboxes:Object.values(PUBLIC_INBOXES)})}
  if(url.pathname==="/api/contact"){if(request.method!=="POST")return json(405,{ok:false,message:"Method not allowed."});return deliverLead(request,env,"Contact Request",["Message"],{confirmation:true})}
  if(url.pathname==="/api/intake"){if(request.method!=="POST")return json(405,{ok:false,message:"Method not allowed."});return deliverLead(request,env,"Project Intake",["Topic","Preferred Timeframe","Budget Range","Message","Desired Outcome"],{confirmation:true})}
  if(url.pathname==="/api/assessment"){if(request.method!=="POST")return json(405,{ok:false,message:"Method not allowed."});return deliverLead(request,env,"Business Growth Assessment",["Assessment Type","Primary Goal","Current Challenge","Desired Outcome"],{confirmation:true})}
  if(url.pathname==="/api/data-recovery"){if(request.method!=="POST")return json(405,{ok:false,message:"Method not allowed."});return deliverLead(request,env,"Remote Support / Data Recovery",["Device Type","Problem Description"],{confirmation:true})}
  if((request.method==="GET"||request.method==="HEAD")&&CANONICAL_REDIRECTS.has(url.pathname)){const target=CANONICAL_REDIRECTS.get(url.pathname);if(target!==url.pathname)return redirectResponse(request,target,301)}
  return transformHtml(await env.ASSETS.fetch(request),url);
}};