const JSON_HEADERS={"content-type":"application/json; charset=utf-8","cache-control":"no-store"};
const json=(status,payload)=>new Response(JSON.stringify(payload),{status,headers:JSON_HEADERS});
const clean=(value,max=4000)=>String(value??"").replace(/\u0000/g,"").trim().slice(0,max);
const validEmail=value=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value)&&value.length<=254;
const escapeHtml=value=>String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");

async function parseBody(request){
  const type=request.headers.get("content-type")||"";
  if(type.includes("application/json"))return request.json();
  return Object.fromEntries((await request.formData()).entries());
}

async function deliverLead(request,env,leadType,requiredFields){
  let body;
  try{body=await parseBody(request)}catch{return json(400,{ok:false,message:"Invalid form submission."})}
  if(clean(body.website,100))return json(200,{ok:true,message:"Thank you."});
  const started=Number(body.form_started_at||0),elapsed=Date.now()-started;
  if(!started||elapsed<1500||elapsed>86400000)return json(400,{ok:false,message:"Please reload the page and complete the form again."});
  const name=clean(body["Full Name"]||body.Name,120),email=clean(body.Email,254);
  if(name.length<2||!validEmail(email))return json(400,{ok:false,message:"Enter a valid name and email address."});
  for(const field of requiredFields){if(!clean(body[field]))return json(400,{ok:false,message:`Complete the ${field} field.`})}
  if(!env.RESEND_API_KEY)return json(503,{ok:false,code:"MISSING_RESEND_KEY",message:"Email delivery is not configured yet."});
  const ignored=new Set(["website","form_started_at","cf-turnstile-response"]),fields={};
  for(const [key,value] of Object.entries(body)){if(!ignored.has(key))fields[clean(key,100)]=clean(value)}
  const combined=Object.values(fields).join("\n");
  if((combined.match(/https?:\/\/|www\./gi)||[]).length>4||/<\s*(script|iframe|object|embed)/i.test(combined))return json(400,{ok:false,message:"Submission rejected."});
  const rows=Object.entries(fields).map(([key,value])=>`<tr><th style="text-align:left;vertical-align:top;padding:9px;border:1px solid #d8e0e8;background:#f4f7fa">${escapeHtml(key)}</th><td style="padding:9px;border:1px solid #d8e0e8">${escapeHtml(value).replace(/\n/g,"<br>")}</td></tr>`).join("");
  const recipient=env.FORM_TO_EMAIL||"aplustechucation@gmail.com";
  const sender=env.FORM_FROM_EMAIL||"A+ Techucation Website <onboarding@resend.dev>";
  let response;
  try{
    response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{authorization:`Bearer ${env.RESEND_API_KEY}`,"content-type":"application/json"},body:JSON.stringify({from:sender,to:[recipient],reply_to:email,subject:`[AtechSpot Website] ${leadType} — ${name}`,html:`<h2>${escapeHtml(leadType)}</h2><p>A new request was submitted through AtechSpot.com.</p><table style="border-collapse:collapse;width:100%;max-width:850px">${rows}</table><p>Reply to this email to respond directly to ${escapeHtml(name)} at ${escapeHtml(email)}.</p>`})});
  }catch{return json(503,{ok:false,code:"EMAIL_PROVIDER_UNREACHABLE",message:"The email service is temporarily unavailable."})}
  if(!response.ok){console.error("Resend error",response.status,await response.text());return json(503,{ok:false,code:"RESEND_REJECTED",message:"The email provider rejected the message. Confirm the Cloudflare email settings."})}
  return json(200,{ok:true,message:"Thank you. Your request was emailed successfully."});
}

export default{
  async fetch(request,env){
    const url=new URL(request.url);
    if(url.pathname==="/api/form-health"){
      if(request.method!=="GET")return json(405,{ok:false,message:"Method not allowed."});
      const configured=Boolean(env.RESEND_API_KEY);
      return json(configured?200:503,{ok:configured,resendConfigured:configured,recipient:env.FORM_TO_EMAIL||"aplustechucation@gmail.com",deployment:"V25-CINEMATIC-APPLE-PRODUCTION"});
    }
    if(url.pathname==="/api/contact"){
      if(request.method!=="POST")return json(405,{ok:false,message:"Method not allowed."});
      return deliverLead(request,env,"Contact / Service Intake",["Topic","Message"]);
    }
    if(url.pathname==="/api/data-recovery"){
      if(request.method!=="POST")return json(405,{ok:false,message:"Method not allowed."});
      return deliverLead(request,env,"Data Recovery Intake",["Device Type","Problem Description"]);
    }
    return env.ASSETS.fetch(request);
  }
};
