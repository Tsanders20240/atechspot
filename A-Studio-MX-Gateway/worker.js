const SECONDARY_PAGES = ['/services.html', '/studio.html', '/about.html', '/contact.html', '/privacy.html', '/terms.html'];
const OLD_WORKER = 'https://late-glade-7432.aplustechucation.workers.dev';
const NEW_WORKER = 'https://divine-snowflake-a5da.aplustechucation.workers.dev';

const SECURITY = {
  'x-content-type-options':'nosniff',
  'x-frame-options':'SAMEORIGIN',
  'referrer-policy':'strict-origin-when-cross-origin',
  'permissions-policy':'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'strict-transport-security':'max-age=31536000; includeSubDomains',
  'content-security-policy':"default-src 'self' https: data: blob:; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https:; script-src 'self' 'unsafe-inline' https:; connect-src 'self' https:; font-src 'self' data: https:; frame-src 'self' https:; form-action 'self' https:; upgrade-insecure-requests"
};

function secured(resp, proxiedFrom){
  const headers = new Headers(resp.headers);
  for (const [k,v] of Object.entries(SECURITY)) headers.set(k,v);
  headers.set('X-Proxied-From', proxiedFrom);
  return new Response(resp.body,{status:resp.status,statusText:resp.statusText,headers});
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({ok:true,property:'A Studio MX',canonical:'https://astudiomx.atechspot.com/'}),{
        status:200,
        headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store',...SECURITY}
      });
    }

    if (SECONDARY_PAGES.includes(url.pathname)) {
      const resp = await fetch(OLD_WORKER + url.pathname + url.search, {headers:{'user-agent':request.headers.get('user-agent')||'AStudioMX-Proxy/1.0'}});
      return secured(resp,'late-glade-7432');
    }

    const resp = await fetch(NEW_WORKER + url.pathname + url.search, {headers:{'user-agent':request.headers.get('user-agent')||'AStudioMX-Proxy/1.0'}});
    return secured(resp,'divine-snowflake-a5da');
  }
};
