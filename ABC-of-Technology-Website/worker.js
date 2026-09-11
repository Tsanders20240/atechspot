const HTML_HEADERS={
  'content-type':'text/html; charset=utf-8',
  'x-content-type-options':'nosniff',
  'referrer-policy':'strict-origin-when-cross-origin',
  'permissions-policy':'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'cross-origin-opener-policy':'same-origin',
  'x-frame-options':'SAMEORIGIN'
};
const TEXT_HEADERS={'content-type':'text/plain; charset=utf-8','cache-control':'public, max-age=3600','x-content-type-options':'nosniff'};
const XML_HEADERS={'content-type':'application/xml; charset=utf-8','cache-control':'public, max-age=3600','x-content-type-options':'nosniff'};

const PDF_BY_LETTER={
  A:'a-analog-phone.pdf',B:'b-battery.pdf',C:'c-computer.pdf',D:'d-drone.pdf',E:'e-email.pdf',F:'f-flash-drive.pdf',
  G:'g-game-controller.pdf',H:'h-headphones.pdf',I:'i-internet.pdf',J:'j-joystick.pdf',K:'k-keyboard.pdf',L:'l-laptop.pdf',
  M:'m-mouse.pdf',N:'n-network.pdf',O:'o-online.pdf',P:'p-programming.pdf',Q:'q-qr-code.pdf',R:'r-robot.pdf',S:'s-smartphone.pdf',
  T:'t-tablet.pdf',U:'u-usb.pdf',V:'v-virtual-reality.pdf',W:'w-wifi.pdf',X:'x-x-ray.pdf',Y:'y-youtube.pdf',Z:'z-zoom.pdf'
};

const LEGACY_COLORING={
  'ai-chip-coloring-page':'A','analog-phone-coloring-page':'A','battery-coloring-page':'B','computer-coloring-page':'C','drone-coloring-page':'D',
  'email-coloring-page':'E','flash-drive-coloring-page':'F','game-controller-coloring-page':'G','headphones-coloring-page':'H','internet-coloring-page':'I',
  'joystick-coloring-page':'J','keyboard-coloring-page':'K','laptop-coloring-page':'L','mouse-coloring-page':'M','network-coloring-page':'N',
  'online-coloring-page':'O','programming-coloring-page':'P','qr-code-coloring-page':'Q','robot-coloring-page':'R','smartphone-coloring-page':'S',
  'tablet-coloring-page':'T','usb-coloring-page':'U','virtual-reality-coloring-page':'V','wi-fi-coloring-page':'W','wifi-coloring-page':'W',
  'x-ray-coloring-page':'X','youtube-coloring-page':'Y','zoom-coloring-page':'Z'
};

const SECTION_REDIRECTS=new Map([
  ['/shop/','/#shop'],['/shop','/#shop'],['/music/','/#listen'],['/music','/#listen'],['/songs/','/#listen'],
  ['/videos/','/#watch'],['/videos','/#watch'],['/watch/','/#watch'],['/watch','/#watch'],['/play/','/#play'],['/play','/#play'],
  ['/free-resources/','/#free'],['/free-resources','/#free'],['/educators/','/#educators'],['/educators','/#educators'],
  ['/libraries/','/#libraries'],['/libraries','/#libraries'],['/authors/','/#about'],['/authors','/#about'],['/for-authors/','/#about'],
  ['/about/','/#about'],['/about','/#about'],['/impact/','/#about'],['/impact','/#about'],['/learning-guides/','/#educators'],
  ['/learning-guides','/#educators'],['/privacy/','/#privacy'],['/privacy','/#privacy'],['/terms/','/#terms'],['/terms','/#terms'],
  ['/accessibility/','/#accessibility'],['/accessibility','/#accessibility'],['/press/','/#about'],['/press','/#about']
]);

function redirect(request,target,status=301){return Response.redirect(new URL(target,request.url).toString(),status)}
function addSecurity(response){
  const h=new Headers(response.headers);
  for(const [k,v] of Object.entries(HTML_HEADERS)) if(!h.has(k)) h.set(k,v);
  if(!h.has('cache-control')) h.set('cache-control','public, max-age=300');
  return new Response(response.body,{status:response.status,statusText:response.statusText,headers:h});
}

export default{
  async fetch(request,env){
    const url=new URL(request.url),path=url.pathname;
    if(request.method!=='GET'&&request.method!=='HEAD') return new Response('Method not allowed',{status:405,headers:TEXT_HEADERS});

    if(path==='/api/health') return new Response(JSON.stringify({
      ok:true,property:"ABC's of Technology",payments:'external-only',childAccounts:false,
      officialBookAssets:true,bookPreviewPages:3,coloringPDFs:26,deployment:'ABC-OF-TECHNOLOGY-10OF10-FINAL'
    }),{status:200,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});

    if(path==='/robots.txt') return new Response('User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: https://abcoftech.atechspot.com/sitemap.xml\n',{headers:TEXT_HEADERS});

    if(path==='/sitemap.xml') return new Response('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://abcoftech.atechspot.com/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url><url><loc>https://abcoftech.atechspot.com/downloads/coloring-pages/abc-technology-coloring-pages-a-z-26-pages.pdf</loc><changefreq>monthly</changefreq><priority>0.7</priority></url></urlset>',{headers:XML_HEADERS});

    if(path==='/coloring/'||path==='/coloring'){
      const all=url.searchParams.get('all');
      const letter=(url.searchParams.get('letter')||'').toUpperCase();
      if(all==='1') return redirect(request,'/downloads/coloring-pages/abc-technology-coloring-pages-a-z-26-pages.pdf',302);
      if(PDF_BY_LETTER[letter]) return redirect(request,'/downloads/coloring-pages/'+PDF_BY_LETTER[letter],302);
      return redirect(request,'/#free',302);
    }

    if(path==='/downloads/coloring-pages/abc-tech-coloring-pages-a-z-circuit-edition-26-pages.pdf')
      return redirect(request,'/downloads/coloring-pages/abc-technology-coloring-pages-a-z-26-pages.pdf',301);

    if(path.startsWith('/free-resources/')&&path!=='/free-resources/'){
      const slug=path.replace('/free-resources/','').replace(/\/$/,'');
      const letter=LEGACY_COLORING[slug];
      if(letter) return redirect(request,'/downloads/coloring-pages/'+PDF_BY_LETTER[letter],301);
    }

    if(path.startsWith('/authors/')) return redirect(request,'/#about',301);
    if(SECTION_REDIRECTS.has(path)) return redirect(request,SECTION_REDIRECTS.get(path),301);

    const response=await env.ASSETS.fetch(request);
    return (response.headers.get('content-type')||'').includes('text/html')?addSecurity(response):response;
  }
};