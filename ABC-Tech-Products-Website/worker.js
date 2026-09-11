export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === 'www.abctechproducts.atechspot.com') {
      url.hostname = 'abctechproducts.atechspot.com';
      return Response.redirect(url.toString(), 301);
    }
    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({ok:true,property:'ABC Tech Products'}), {
        headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}
      });
    }
    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    headers.set('X-Content-Type-Options','nosniff');
    headers.set('Referrer-Policy','strict-origin-when-cross-origin');
    headers.set('Permissions-Policy','camera=(), microphone=(), geolocation=(), payment=()');
    headers.set('X-Frame-Options','SAMEORIGIN');
    headers.set('Content-Security-Policy',"default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'");
    return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
  }
};
