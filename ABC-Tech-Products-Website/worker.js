export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === 'abctechproducts.atechspot.com') {
      url.hostname = 'www.abctechproducts.atechspot.com';
      return Response.redirect(url.toString(), 301);
    }
    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({ok:true,property:'ABC Tech Products',canonical:'www.abctechproducts.atechspot.com',ga4:'G-P5FFL89J6T'}), {
        headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}
      });
    }
    let response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    headers.set('X-Content-Type-Options','nosniff');
    headers.set('Referrer-Policy','strict-origin-when-cross-origin');
    headers.set('Permissions-Policy','camera=(), microphone=(), geolocation=(), payment=()');
    headers.set('X-Frame-Options','SAMEORIGIN');
    headers.set('Content-Security-Policy',"default-src 'self'; img-src 'self' data: https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; script-src 'self' https://www.googletagmanager.com; connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self'");
    response = new Response(response.body,{status:response.status,statusText:response.statusText,headers});
    if ((response.headers.get('content-type')||'').includes('text/html') && request.method === 'GET') {
      return new HTMLRewriter()
        .on('head',{element(el){el.append('<script src="/analytics.js" defer></script>',{html:true});}})
        .on('link[rel="canonical"]',{element(el){const href=el.getAttribute('href');if(href)el.setAttribute('href',href.replace('https://abctechproducts.atechspot.com','https://www.abctechproducts.atechspot.com'));}})
        .on('meta[property="og:url"]',{element(el){const value=el.getAttribute('content');if(value)el.setAttribute('content',value.replace('https://abctechproducts.atechspot.com','https://www.abctechproducts.atechspot.com'));}})
        .transform(response);
    }
    return response;
  }
};
