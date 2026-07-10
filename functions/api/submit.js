
const H={"content-type":"application/json; charset=utf-8","cache-control":"no-store"};
const clean=(v,m=2500)=>String(v??"").replace(/\u0000/g,"").trim().slice(0,m);
const reply=(s,m)=>new Response(JSON.stringify({ok:s<400,message:m}),{status:s,headers:H});
const validEmail=v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v)&&v.length<=254;
async function verify(token,secret,ip,host){
 if(!token||!secret)return false;
 const fd=new FormData();fd.append("secret",secret);fd.append("response",token);if(ip)fd.append("remoteip",ip);
 const r=await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",{method:"POST",body:fd});
 const x=await r.json();return x.success&&x.hostname===host;
}
const esc=v=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
export async function onRequestPost({request,env}){
 const host=new URL(request.url).hostname;
 if(!(env.ALLOWED_HOSTS||host).split(",").map(x=>x.trim()).includes(host))return reply(403,"Unauthorized host.");
 let b;try{b=await request.json()}catch{return reply(400,"Invalid form data.");}
 if(clean(b.website,100))return reply(200,"Thank you.");
 const elapsed=Date.now()-Number(b.form_started_at||0); if(!b.form_started_at||elapsed<4000)return reply(400,"Please complete the form again.");
 if(!await verify(clean(b["cf-turnstile-response"],2500),env.TURNSTILE_SECRET_KEY,request.headers.get("CF-Connecting-IP")||"",host))return reply(400,"Human verification failed.");
 const name=clean(b["Full Name"]||b.Name,120),email=clean(b.Email,254);
 if(name.length<2||!validEmail(email))return reply(400,"Enter a valid name and email.");
 const fields={}; for(const[k,v]of Object.entries(b))if(!["website","form_started_at","cf-turnstile-response"].includes(k))fields[clean(k,100)]=clean(v,4000);
 const text=Object.values(fields).join("\n");
 if((text.match(/https?:\/\/|www\./gi)||[]).length>2||/<\s*(script|iframe|object)/i.test(text))return reply(400,"Submission rejected.");
 if(!env.RESEND_API_KEY||!env.FORM_TO_EMAIL||!env.FORM_FROM_EMAIL)return reply(503,"Email delivery is not configured.");
 const rows=Object.entries(fields).map(([k,v])=>`<tr><th style="text-align:left;padding:8px;border:1px solid #ddd">${esc(k)}</th><td style="padding:8px;border:1px solid #ddd">${esc(v).replace(/\n/g,"<br>")}</td></tr>`).join("");
 const r=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"authorization":`Bearer ${env.RESEND_API_KEY}`,"content-type":"application/json"},body:JSON.stringify({from:env.FORM_FROM_EMAIL,to:[env.FORM_TO_EMAIL],reply_to:email,subject:`[Verified Lead] ${clean(b.form_type||"Website Form",100)} — ${name}`,html:`<h2>Verified website lead</h2><table style="border-collapse:collapse">${rows}</table>`})});
 if(!r.ok)return reply(503,"Delivery is temporarily unavailable.");
 return reply(200,"Thank you. Your verified request was sent successfully.");
}
export function onRequestGet(){return reply(405,"Method not allowed.");}
