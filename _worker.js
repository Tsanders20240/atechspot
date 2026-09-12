const JSON_HEADERS={"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff","access-control-allow-origin":"https://www.atechspot.com","access-control-allow-methods":"GET,POST,OPTIONS","access-control-allow-headers":"content-type,accept"};
const json=(status,payload)=>new Response(JSON.stringify(payload),{status,headers:JSON_HEADERS});
const clean=(value,max=4000)=>String(value??"").replace(/\u0000/g,"").trim().slice(0,max);
const validEmail=value=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value)&&value.length<=254;
const escapeHtml=value=>String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");

const PUBLIC_INBOXES={jason:"jason@atechspot.com",hello:"hello@atechspot.com",sales:"sales@atechspot.com",support:"support@atechspot.com",billing:"billing@atechspot.com",legal:"legal@atechspot.com"};
const RESEND_SANDBOX_SENDER="ATechSpot Website <onboarding@resend.dev>";
const UI_HARDENING_STYLE=`<style id="atechspot-ui-hardening">
[hidden]{display:none!important}
html body .site-header{height:78px!important;min-height:78px!important}
html body .site-header .brand{width:220px!important;height:54px!important;flex:0 0 220px!important;display:block!important;overflow:hidden!important;background-image:url('/assets/atechspot-logo.png')!important;background-repeat:no-repeat!important;background-position:left center!important;background-size:contain!important;filter:brightness(1.32) saturate(1.08) drop-shadow(0 0 14px rgba(76,179,255,.18))!important}
html body .site-header .brand-logo-clean{display:none!important}
html body .footer-brand{width:220px!important;height:58px!important;flex:0 0 220px!important;display:block!important;overflow:hidden!important;background-image:url('/assets/atechspot-logo.png')!important;background-repeat:no-repeat!important;background-position:left center!important;background-size:contain!important;filter:brightness(0) invert(1) drop-shadow(0 0 12px rgba(76,179,255,.16))!important}
html body .footer-brand .brand-logo-clean{display:none!important}
@media(max-width:650px){html body .site-header .brand{width:176px!important;height:48px!important;flex-basis:176px!important}html body .footer-brand{width:190px!important;height:52px!important;flex-basis:190px!important}}
</style>`;

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
  ["/affiliate-disclosure","/affiliate-disclosure/"],["/affiliate-disclosure.html","/affiliate-disclosure/"],["/remote-support","/remote-support/"],["/remote-support.html","/remote-support/"],["/creator","/creator/"],["/creator.html","/creator/"]
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

function redirectResponse(request,url,status=301){const target=new URL(url,request.url);return Response.redirect(target.toString(),status)}
async function parseBody(request){const type=request.headers.get("content-type")||"";if(type.includes("application/json"))return request.json();return Object.fromEntries((await request.formData()).entries())}
async function resend(env,payload){const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{authorization:`Bearer ${env.RESEND_API_KEY}`,"content-type":"application/json"},body:JSON.stringify(payload)});if(!response.ok){const detail=await response.text();throw new Error(`Resend ${response.status}: ${detail.slice(0,400)}`)}return response.json()}
async function resendWithFallback(env,payload){
  const configured=clean(env.FORM_FROM_EMAIL||"",254);
  const senders=[configured,RESEND_SANDBOX_SENDER].filter((sender,index,array)=>sender&&array.indexOf(sender)===index);
  let lastError=null;
  for(const sender of senders){
    try{return{result:await resend(env,{...payload,from:sender}),sender}}
    catch(error){lastError=error;console.warn(`ATechSpot Resend sender failed: ${sender}`,error)}
  }
  throw lastError||new Error("No Resend sender is available.");
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
  const recipient=env.FORM_TO_EMAIL||"aplustechucation@gmail.com";
  let senderUsed=RESEND_SANDBOX_SENDER;
  try{
    const delivery=await resendWithFallback(env,{to:[recipient],reply_to:email,subject:`[ATechSpot / ${publicInbox}] ${leadType} — ${name}`,html:`<h2>${escapeHtml(leadType)}</h2><p>A new request was submitted through ATechSpot.com and routed under <strong>${escapeHtml(publicInbox)}</strong>.</p><table style="border-collapse:collapse;width:100%;max-width:850px">${rows}</table><p>Reply to this email to respond directly to ${escapeHtml(name)} at ${escapeHtml(email)}.</p>`});
    senderUsed=delivery.sender;
  }catch(error){console.error("ATechSpot internal email delivery failed",error);return json(503,{ok:false,code:"EMAIL_DELIVERY_FAILED",message:"We could not send your request right now. Please try again shortly or call (713) 396-2993."})}
  let confirmationSent=false;if(confirmation){try{await resend(env,{from:senderUsed,to:[email],reply_to:publicInbox,subject:"We received your ATechSpot request",html:`<p>Hi ${escapeHtml(name)},</p><p>Thank you for contacting ATechSpot. We received your request and routed it to <strong>${escapeHtml(publicInbox)}</strong>.</p><p>We will review the business problem, desired outcome, timing and fit before recommending the appropriate next step.</p><p>Submitting the form does not create a client relationship, establish a final price, guarantee project acceptance or reserve a schedule. Any scope, pricing or scheduling commitment will be confirmed separately in writing.</p><p>— ATechSpot<br><small>Operated by A+ Techucation LLC</small></p>`});confirmationSent=true}catch(error){console.warn("ATechSpot confirmation email was not sent",error)}}
  return json(200,{ok:true,confirmationSent,routedTo:publicInbox,message:"Thank you. Your request was received successfully."});
}

function transformHtml(response,url){
  const type=response.headers.get("content-type")||"";if(!type.includes("text/html"))return response;
  let rewriter=new HTMLRewriter()
    .on('head',{element(element){element.append(UI_HARDENING_STYLE,{html:true})}})
    .on('a[href]',{element(element){const href=element.getAttribute('href');if(LINK_REWRITES.has(href))element.setAttribute('href',LINK_REWRITES.get(href))}})
    .on('.site-header .desktop-cta',{element(element){element.setAttribute('href','/intake/');element.setInnerContent('Start My Project')}})
    .on('footer .footer-grid p',{element(element){element.setInnerContent('AI, automation, websites, ecommerce, apps and software built around real business needs. ATechSpot is operated by A+ Techucation LLC.')}});
  if(url.pathname.startsWith('/intake')){
    rewriter=rewriter.on('.site-header nav a[href="/app/"]',{element(element){element.setAttribute('href','/assessment/');element.setInnerContent('Assessment')}})
      .on('footer a[href="/app/"]',{element(element){element.setAttribute('href','/assessment/');element.setInnerContent('Assessment')}});
  }
  if(url.pathname==='/'){
    rewriter=rewriter.on('.hero-actions .btn-primary',{element(element){element.setAttribute('href','/intake/');element.setInnerContent('Start My Project →')}})
      .on('.growth-copy .btn-primary',{element(element){element.setAttribute('href','/assessment/');element.setInnerContent('Start With My Business Assessment')}});
  }
  return rewriter.transform(response)
}

export default{async fetch(request,env){
  const url=new URL(request.url);
  if(request.method==="OPTIONS"&&url.pathname.startsWith("/api/"))return new Response(null,{status:204,headers:JSON_HEADERS});
  if(url.hostname==='atechspot.com'&&!url.pathname.startsWith('/.well-known/')){url.hostname='www.atechspot.com';return Response.redirect(url.toString(),request.method==='GET'||request.method==='HEAD'?301:308)}
  if(LEGACY_PREFIXES.some(prefix=>url.pathname.startsWith(prefix)))return redirectResponse(request,'/',301);
  if(url.pathname==="/api/form-health"){if(request.method!=="GET")return json(405,{ok:false,message:"Method not allowed."});const resendConfigured=Boolean(env.RESEND_API_KEY);return json(resendConfigured?200:503,{ok:resendConfigured,resendConfigured,deployment:"ATECHSPOT-RESEND-FALLBACK-UI-HARDENED-20260912",publicInboxes:Object.values(PUBLIC_INBOXES)})}
  if(url.pathname==="/api/contact"){if(request.method!=="POST")return json(405,{ok:false,message:"Method not allowed."});return deliverLead(request,env,"Contact Request",["Message"],{confirmation:true})}
  if(url.pathname==="/api/intake"){if(request.method!=="POST")return json(405,{ok:false,message:"Method not allowed."});return deliverLead(request,env,"Project Intake",["Topic","Preferred Timeframe","Budget Range","Message","Desired Outcome"],{confirmation:true})}
  if(url.pathname==="/api/assessment"){if(request.method!=="POST")return json(405,{ok:false,message:"Method not allowed."});return deliverLead(request,env,"Business Growth Assessment",["Assessment Type","Primary Goal","Current Challenge","Desired Outcome"],{confirmation:true})}
  if(url.pathname==="/api/data-recovery"){if(request.method!=="POST")return json(405,{ok:false,message:"Method not allowed."});return deliverLead(request,env,"Remote Support / Data Recovery",["Device Type","Problem Description"],{confirmation:true})}
  if((request.method==="GET"||request.method==="HEAD")&&CANONICAL_REDIRECTS.has(url.pathname)){const target=CANONICAL_REDIRECTS.get(url.pathname);if(target!==url.pathname)return redirectResponse(request,target,301)}
  return transformHtml(await env.ASSETS.fetch(request),url);
}};