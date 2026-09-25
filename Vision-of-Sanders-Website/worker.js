const SITE='https://visionofsanders.atechspot.com';
const SECURITY={
  'x-content-type-options':'nosniff',
  'x-frame-options':'SAMEORIGIN',
  'referrer-policy':'strict-origin-when-cross-origin',
  'permissions-policy':'camera=(), microphone=(), geolocation=(), usb=()',
  'strict-transport-security':'max-age=31536000; includeSubDomains',
  'content-security-policy':"default-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self' https://www.atechspot.com"
};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store',...SECURITY}});

async function inquiry(request){
  if(request.method!=='POST') return json({ok:false,message:'Method not allowed.'},405);
  let body;
  try{body=await request.json()}catch{return json({ok:false,message:'Invalid request.'},400)}
  if(body.website) return json({ok:true});
  if(!body.name||!body.email||!body.project||!body.message) return json({ok:false,message:'Please complete the required fields.'},400);
  const payload={
    'Full Name':body.name,
    Email:body.email,
    Message:[
      'Vision of Sanders project inquiry',
      'Project: '+body.project,
      'Preferred date: '+(body.date||'Not specified'),
      'Project details: '+body.message
    ].join('\n'),
    'Project Type':body.project,
    'Preferred Date':body.date||'',
    'Project Details':body.message,
    Department:'sales',
    'Form Type':'Vision of Sanders Project Inquiry',
    'Origin Property':'visionofsanders.atechspot.com',
    form_started_at:body.form_started_at,
    website:''
  };
  try{
    const upstream=await fetch('https://www.atechspot.com/api/contact',{method:'POST',headers:{'content-type':'application/json','accept':'application/json','user-agent':'Vision-of-Sanders-Worker/1.0'},body:JSON.stringify(payload)});
    const text=await upstream.text();
    return new Response(text,{status:upstream.status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store',...SECURITY}});
  }catch{
    return json({ok:false,message:'Inquiry delivery is temporarily unavailable. Please use the ATechSpot booking link.'},503);
  }
}

export default{
  async fetch(request,env){
    const u=new URL(request.url);
    if(u.pathname==='/api/health') return json({ok:true,property:'Vision of Sanders',canonical:SITE,inquiry:true,booking:'https://www.atechspot.com/booking/'});
    if(u.pathname==='/api/inquiry') return inquiry(request);
    if(u.pathname==='/robots.txt') return new Response('User-agent: *\nAllow: /\nSitemap: '+SITE+'/sitemap.xml\n',{headers:{'content-type':'text/plain; charset=utf-8','cache-control':'public, max-age=3600',...SECURITY}});
    if(u.pathname==='/sitemap.xml') return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>'+SITE+'/</loc></url></urlset>',{headers:{'content-type':'application/xml; charset=utf-8','cache-control':'public, max-age=3600',...SECURITY}});
    if(u.pathname==='/worker.js'||u.pathname==='/wrangler.jsonc'||u.pathname.startsWith('/src/')) return new Response('Not found',{status:404,headers:SECURITY});
    const response=await env.ASSETS.fetch(request);
    const headers=new Headers(response.headers);
    for(const [k,v] of Object.entries(SECURITY)) headers.set(k,v);
    if(response.headers.get('content-type')?.includes('text/html')) headers.set('cache-control','public, max-age=0, must-revalidate');
    return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
  }
};