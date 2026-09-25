const SECURITY={
  "x-content-type-options":"nosniff",
  "x-frame-options":"SAMEORIGIN",
  "referrer-policy":"strict-origin-when-cross-origin",
  "permissions-policy":"camera=(), microphone=(), geolocation=(), usb=()",
  "strict-transport-security":"max-age=31536000; includeSubDomains"
};
export default {
  async fetch(request, env) {
    const u=new URL(request.url);
    if(u.pathname==="/api/health") return new Response(JSON.stringify({ok:true,property:"Mr. A+ Portfolio",canonical:"https://mraplusportfolio.atechspot.com/"}),{headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store",...SECURITY}});
    if(u.pathname==="/worker.js"||u.pathname==="/wrangler.jsonc") return new Response("Not found",{status:404,headers:SECURITY});
    const r=await env.ASSETS.fetch(request);
    const h=new Headers(r.headers); for(const [k,v] of Object.entries(SECURITY)) h.set(k,v);
    return new Response(r.body,{status:r.status,statusText:r.statusText,headers:h});
  }
};