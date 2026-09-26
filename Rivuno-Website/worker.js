const SECURITY_HEADERS={
  "x-content-type-options":"nosniff",
  "referrer-policy":"strict-origin-when-cross-origin",
  "permissions-policy":"camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "cross-origin-opener-policy":"same-origin",
  "x-frame-options":"SAMEORIGIN",
  "strict-transport-security":"max-age=31536000; includeSubDomains",
  "content-security-policy":"default-src 'self' https: data:; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self' https:; form-action 'self' https:; upgrade-insecure-requests"
};

function withHeaders(response){
  const headers=new Headers(response.headers);
  for(const [k,v] of Object.entries(SECURITY_HEADERS)) headers.set(k,v);
  if((headers.get("content-type")||"").includes("text/html")){
    headers.set("cache-control","no-store, no-cache, must-revalidate");
    headers.set("pragma","no-cache");
    headers.set("expires","0");
  }
  return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}

export default{
  async fetch(request,env){
    const url=new URL(request.url);
    if(url.pathname==="/api/health"){
      return new Response(JSON.stringify({
        ok:true,
        property:"Rivuno",
        hostname:url.hostname,
        release:"ABC of Tech",
        checkout:"disabled-until-protected-delivery-is-connected",
        deployment:"RIVUNO-LAUNCH-GRADE-2026-09-26"
      }),{headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store",...SECURITY_HEADERS}});
    }
    if(url.pathname==="/robots.txt"){
      return new Response("User-agent: *\nAllow: /\nSitemap: https://rivuno.atechspot.com/sitemap.xml\n",{headers:{"content-type":"text/plain; charset=utf-8","cache-control":"public, max-age=3600"}});
    }
    if(url.pathname==="/sitemap.xml"){
      const xml='<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://rivuno.atechspot.com/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url><url><loc>https://rivuno.atechspot.com/release/abc-of-tech/</loc><changefreq>weekly</changefreq><priority>0.9</priority></url><url><loc>https://rivuno.atechspot.com/artists/a-plus-techucation/</loc><changefreq>weekly</changefreq><priority>0.8</priority></url></urlset>';
      return new Response(xml,{headers:{"content-type":"application/xml; charset=utf-8","cache-control":"public, max-age=3600"}});
    }
    if(request.method!=="GET"&&request.method!=="HEAD") return new Response("Method not allowed",{status:405});
    const response=await env.ASSETS.fetch(request);
    return withHeaders(response);
  }
};