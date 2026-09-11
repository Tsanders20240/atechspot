const JSON_HEADERS={'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'};
const json=(status,payload)=>new Response(JSON.stringify(payload),{status,headers:JSON_HEADERS});
async function proxyLead(request,target,extra={}){
  if(request.method!=='POST')return json(405,{ok:false,message:'Method not allowed.'});
  let body;try{body=await request.json()}catch{return json(400,{ok:false,message:'Invalid form submission.'})}
  body={...body,...extra,'Creator Property':'creator.atechspot.com'};
  const upstream=await fetch(`https://www.atechspot.com${target}`,{method:'POST',headers:{'content-type':'application/json','accept':'application/json','user-agent':'ATechSpot-Creator-Worker/1.0'},body:JSON.stringify(body)});
  const text=await upstream.text();
  return new Response(text,{status:upstream.status,headers:JSON_HEADERS});
}
export default{async fetch(request,env){
  const url=new URL(request.url);
  if(url.pathname==='/api/health')return json(200,{ok:true,property:'ATechSpot Creator',domain:'creator.atechspot.com'});
  if(url.pathname==='/api/creator-assessment')return proxyLead(request,'/api/assessment',{'Department':'sales'});
  if(url.pathname==='/api/creator-contact')return proxyLead(request,'/api/contact',{'Department':'sales'});
  const response=await env.ASSETS.fetch(request);
  const headers=new Headers(response.headers);headers.set('x-content-type-options','nosniff');headers.set('referrer-policy','strict-origin-when-cross-origin');headers.set('permissions-policy','camera=(), microphone=(), geolocation=()');
  return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}};