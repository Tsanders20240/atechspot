const CURRENT='https://royalupwiththehughes.pages.dev';
const YEAR='2026';
const SECURITY={'x-content-type-options':'nosniff','referrer-policy':'strict-origin-when-cross-origin','permissions-policy':'camera=(), microphone=(), geolocation=(), payment=(), usb=()','strict-transport-security':'max-age=31536000'};
function withHeaders(r){const h=new Headers(r.headers);for(const[k,v]of Object.entries(SECURITY))h.set(k,v);return h}
async function getUpstream(origin,path,search,request){
 const headers=new Headers();
 const ua=request.headers.get('user-agent'); if(ua)headers.set('user-agent',ua);
 const accept=request.headers.get('accept'); if(accept)headers.set('accept',accept);
 let r=await fetch(origin+path+search,{method:request.method,headers,redirect:'follow'});
 if(r.status===404 && path==='/')r=await fetch(origin+'/index.html'+search,{method:request.method,headers,redirect:'follow'});
 if(r.status===404 && origin!==CURRENT)r=await fetch(CURRENT+path+search,{method:request.method,headers,redirect:'follow'});
 return r;
}
export default{async fetch(request,env){const u=new URL(request.url);const origin=(env&&env.ORIGIN_URL)||CURRENT;if(u.pathname==='/api/health')return new Response(JSON.stringify({ok:true,property:'Royal Up With The Hughes',mode:'selected-stable-production',origin}),{headers:{'content-type':'application/json; charset=utf-8',...SECURITY}});
 const upstream=await getUpstream(origin,u.pathname,u.search,request);
 const type=upstream.headers.get('content-type')||'';
 if(!type.includes('text/html'))return new Response(upstream.body,{status:upstream.status,statusText:upstream.statusText,headers:withHeaders(upstream)});
 let html=await upstream.text();
 const ribbon=`<div id="atechspot-ecosystem-ribbon" style="position:relative;z-index:99999;background:#081525;color:#ddecf7;padding:9px 14px;text-align:center;font:700 11px/1.4 Arial,sans-serif;letter-spacing:.05em">ROYAL UP WITH THE HUGHES · FAMILY & LEGACY MEDIA · <a href="https://www.atechspot.com/ecosystem/" style="color:#7edcff;text-decoration:none">ATechSpot Ecosystem →</a></div>`;
 html=html.includes('<body')?html.replace(/(<body[^>]*>)/i,'$1'+ribbon):ribbon+html;
 html=html.replace(/<\/body>/i,`<footer style="padding:18px;text-align:center;background:#081525;color:#9db0c1;font:12px Arial,sans-serif">Connected to the ATechSpot ecosystem · © ${YEAR} Royal Up With The Hughes</footer></body>`);
 const h=withHeaders(upstream);h.delete('content-length');h.set('cache-control','public, max-age=120');
 return new Response(html,{status:upstream.status,statusText:upstream.statusText,headers:h});
}};