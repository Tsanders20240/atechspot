const JSON_HEADERS={"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff"};
const json=(status,payload)=>new Response(JSON.stringify(payload),{status,headers:JSON_HEADERS});
const clean=(value,max=4000)=>String(value??"").replace(/\u0000/g,"").trim().slice(0,max);
const validEmail=value=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value)&&value.length<=254;
const escapeHtml=value=>String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");

const CANONICAL_REDIRECTS=new Map([
  ["/services","/services/"],["/services.html","/services/"],["/solutions","/services/"],["/solutions/","/services/"],["/solutions.html","/services/"],
  ["/app","/app/"],["/app.html","/app/"],["/apps","/app/"],["/apps/","/app/"],["/apps.html","/app/"],
  ["/about","/about/"],["/about.html","/about/"],["/contact","/contact/"],["/contact.html","/contact/"],["/intake","/intake/"],["/intake.html","/intake/"],["/intake/thank-you","/intake/thank-you/"],
  ["/ecosystem","/ecosystem/"],["/ecosystem.html","/ecosystem/"],["/resources","/resources/"],["/resources.html","/resources/"],
  ["/privacy","/privacy/"],["/privacy.html","/privacy/"],["/terms","/terms/"],["/terms.html","/terms/"],["/accessibility","/accessibility/"],["/accessibility.html","/accessibility/"],
  ["/affiliate-disclosure","/affiliate-disclosure/"],["/affiliate-disclosure.html","/affiliate-disclosure/"],["/remote-support","/remote-support/"],["/remote-support.html","/remote-support/"],["/creator","/creator/"],["/creator.html","/creator/"]
]);
const LINK_REWRITES=new Map([
  ["https://creator.atechspot.com/","/creator/"],["https://creator.atechspot.com","/creator/"],
  ["/resources.html","/resources/"],["/privacy.html","/privacy/"],["/terms.html","/terms/"],["/accessibility.html","/accessibility/"],["/affiliate-disclosure.html","/affiliate-disclosure/"],["/remote-support.html","/remote-support/"],
  ["/apps/","/app/"],["/apps","/app/"],["/apps.html","/app/"]
]);
function redirectResponse(request,url,status=301){const target=new URL(url,request.url);return Response.redirect(target.toString(),status)}
async function parseBody(request){const type=request.headers.get("content-type")||"";if(type.includes("application/json"))return request.json();return Object.fromEntries((await request.formData()).entries())}
async function resend(env,payload){const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{authorization:`Bearer ${env.RESEND_API_KEY}`,"content-type":"application/json"},body:JSON.stringify(payload)});if(!response.ok){const detail=await response.text();throw new Error(`Resend ${response.status}: ${detail.slice(0,400)}`)}return response.json()}
async function deliverLead(request,env,leadType,requiredFields,{confirmation=true}={}){
  let body;try{body=await parseBody(request)}catch{return json(400,{ok:false,message:"Invalid form submission."})}
  if(clean(body.website,100))return json(200,{ok:true,message:"Thank you."});
  const started=Number(body.form_started_at||0),elapsed=Date.now()-started;if(!started||elapsed<1200||elapsed>86400000)return json(400,{ok:false,message:"Please reload the page and complete the form again."});
  const name=clean(body["Full Name"]||body.Name,120),email=clean(body.Email,254);if(name.length<2||!validEmail(email))return json(400,{ok:false,message:"Enter a valid name and email address."});
  for(const field of requiredFields){if(!clean(body[field]))return json(400,{ok:false,message:`Complete the ${field} field.`})}
  if(!env.RESEND_API_KEY)return json(503,{ok:false,code:"MISSING_RESEND_KEY",message:"Secure form delivery is temporarily unavailable."});
  const ignored=new Set(["website","form_started_at","cf-turnstile-response"]),fields={};for(const [key,value] of Object.entries(body)){if(!ignored.has(key))fields[clean(key,100)]=clean(value)}
  const combined=Object.values(fields).join("\n");if((combined.match(/https?:\/\/|www\./gi)||[]).length>5||/<\s*(script|iframe|object|embed)/i.test(combined))return json(400,{ok:false,message:"Submission rejected."});
  const rows=Object.entries(fields).map(([key,value])=>`<tr><th style="text-align:left;vertical-align:top;padding:9px;border:1px solid #d8e0e8;background:#f4f7fa">${escapeHtml(key)}</th><td style="padding:9px;border:1px solid #d8e0e8">${escapeHtml(value).replace(/\n/g,"<br>")}</td></tr>`).join("");
  const recipient=env.FORM_TO_EMAIL||"aplustechucation@gmail.com",sender=env.FORM_FROM_EMAIL||"ATechSpot Website <onboarding@resend.dev>";
  try{await resend(env,{from:sender,to:[recipient],reply_to:email,subject:`[ATechSpot] ${leadType} — ${name}`,html:`<h2>${escapeHtml(leadType)}</h2><p>A new request was submitted through ATechSpot.com.</p><table style="border-collapse:collapse;width:100%;max-width:850px">${rows}</table><p>Reply to this email to respond directly to ${escapeHtml(name)} at ${escapeHtml(email)}.</p>`})}catch(error){console.error("ATechSpot internal email delivery failed",error);return json(503,{ok:false,code:"EMAIL_DELIVERY_FAILED",message:"We could not send your request right now. Please try again shortly or call (713) 396-2993."})}
  let confirmationSent=false;if(confirmation){try{const replyTo=env.REPLY_TO_EMAIL||env.FORM_REPLY_TO_EMAIL||undefined;const payload={from:sender,to:[email],subject:"We received your ATechSpot request",html:`<p>Hi ${escapeHtml(name)},</p><p>Thank you for contacting ATechSpot. We received your request and will review the business problem, desired outcome, timing and fit before recommending the appropriate next step.</p><p>Submitting the form does not create a client relationship, establish a final price, guarantee project acceptance or reserve a schedule. Any scope, pricing or scheduling commitment will be confirmed separately in writing.</p><p>— ATechSpot<br><small>Operated by A+ Techucation LLC</small></p>`};if(replyTo)payload.reply_to=replyTo;await resend(env,payload);confirmationSent=true}catch(error){console.warn("ATechSpot confirmation email was not sent",error)}}
  return json(200,{ok:true,confirmationSent,message:"Thank you. Your request was received successfully."});
}
function transformHtml(response){const type=response.headers.get("content-type")||"";if(!type.includes("text/html"))return response;return new HTMLRewriter().on('a[href]',{element(element){const href=element.getAttribute('href');if(LINK_REWRITES.has(href))element.setAttribute('href',LINK_REWRITES.get(href))}}).on('footer .footer-grid p',{element(element){element.setInnerContent('AI, automation, websites, ecommerce, apps and software built around real business needs. ATechSpot is operated by A+ Techucation LLC.')}}).transform(response)}
export default{async fetch(request,env){const url=new URL(request.url);
  // Do not redirect the apex here. Cloudflare Pages must be able to complete
  // HTTP validation for a newly attached apex custom domain. Once the apex is
  // Active, a Cloudflare Redirect Rule can canonicalize it to www safely.
  if(url.pathname==="/api/form-health"){if(request.method!=="GET")return json(405,{ok:false,message:"Method not allowed."});const resendConfigured=Boolean(env.RESEND_API_KEY),recipientConfigured=Boolean(env.FORM_TO_EMAIL),senderConfigured=Boolean(env.FORM_FROM_EMAIL);return json(resendConfigured?200:503,{ok:resendConfigured,resendConfigured,recipientConfigured,senderConfigured,deployment:"ATECHSPOT-23-REMEDIATION"})}
  if(url.pathname==="/api/contact"){if(request.method!=="POST")return json(405,{ok:false,message:"Method not allowed."});return deliverLead(request,env,"Contact Request",["Message"],{confirmation:true})}
  if(url.pathname==="/api/intake"){if(request.method!=="POST")return json(405,{ok:false,message:"Method not allowed."});return deliverLead(request,env,"Project Intake",["Topic","Preferred Timeframe","Budget Range","Message","Desired Outcome"],{confirmation:true})}
  if(url.pathname==="/api/data-recovery"){if(request.method!=="POST")return json(405,{ok:false,message:"Method not allowed."});return deliverLead(request,env,"Data Recovery Intake",["Device Type","Problem Description"],{confirmation:true})}
  if((request.method==="GET"||request.method==="HEAD")&&CANONICAL_REDIRECTS.has(url.pathname)){const target=CANONICAL_REDIRECTS.get(url.pathname);if(target!==url.pathname)return redirectResponse(request,target,301)}
  return transformHtml(await env.ASSETS.fetch(request));
}};