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
const SVG_HEADERS={'content-type':'image/svg+xml; charset=utf-8','cache-control':'public, max-age=300','x-content-type-options':'nosniff'};

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

const BUS_ONLY_SVG=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 760" role="img" aria-label="ABC Tech Bus">
<g stroke="#24222a" stroke-width="13" stroke-linecap="round" stroke-linejoin="round">
<path fill="#ffe000" d="M105 290Q120 185 235 150L735 78Q930 60 1020 168L1110 380Q1145 470 1100 555Q1055 635 950 640H255Q115 638 88 520Z"/>
<path fill="#fff04a" stroke="none" d="M190 218Q470 112 850 112L820 148Q465 148 205 244Z"/>
<path fill="#21b9ef" d="M238 228L470 180V398H178L180 290Z"/>
<path fill="#23baf0" d="M520 170H902Q958 176 998 236L1032 398H520Z"/>
<path fill="#fff" d="M650 370Q660 278 754 244Q846 212 900 305Q914 334 912 370Z"/>
<circle cx="778" cy="278" r="48" fill="#845034"/><path fill="#3a1d14" d="M729 282Q735 220 802 220Q866 221 883 273Q822 248 729 282Z"/>
<circle cx="757" cy="300" r="7" fill="#24222a" stroke="none"/><circle cx="826" cy="299" r="7" fill="#24222a" stroke="none"/><path fill="none" d="M767 330Q792 348 821 329"/>
<path fill="#d6d6d6" d="M770 468H1058L1078 560H760Z"/><path fill="#3f4650" d="M778 490H1048V548H772Z"/>
<path fill="#2d3038" d="M730 594H1086L1058 640H718Z"/>
<circle cx="245" cy="634" r="98" fill="#dff6ff"/><circle cx="245" cy="634" r="35" fill="#87909a"/>
<circle cx="705" cy="634" r="98" fill="#dff6ff"/><circle cx="705" cy="634" r="35" fill="#87909a"/>
<circle cx="1000" cy="635" r="70" fill="#dff6ff"/><circle cx="1000" cy="635" r="26" fill="#87909a"/>
<path fill="#37363e" d="M482 165H918L898 102H510Z"/><circle cx="554" cy="132" r="25" fill="#ff6949"/><circle cx="614" cy="126" r="25" fill="#ff6949"/><circle cx="825" cy="120" r="25" fill="#ff6949"/><circle cx="887" cy="127" r="25" fill="#ff6949"/>
</g>
<text x="700" y="138" text-anchor="middle" font-family="Trebuchet MS,Arial,sans-serif" font-size="50" font-weight="900" fill="#171717">ABC TECH BUS</text>
<g font-family="Trebuchet MS,Arial,sans-serif" font-weight="1000" text-anchor="middle">
<circle cx="270" cy="310" r="58" fill="#ef4444"/><text x="270" y="333" font-size="76" fill="#fff">A</text>
<circle cx="385" cy="310" r="58" fill="#2563eb"/><text x="385" y="333" font-size="76" fill="#fff">B</text>
<circle cx="500" cy="310" r="58" fill="#16a34a"/><text x="500" y="333" font-size="76" fill="#fff">C</text>
</g>
</svg>`;

function redirect(request,target,status=301){return Response.redirect(new URL(target,request.url).toString(),status)}
function svgResponse(svg){return new Response(svg,{status:200,headers:SVG_HEADERS})}
function secureHeaders(headers){const h=new Headers(headers);for(const [k,v] of Object.entries(HTML_HEADERS)) if(!h.has(k)) h.set(k,v);if(!h.has('cache-control')) h.set('cache-control','public, max-age=120');return h}

async function enhanceHtml(response){
  let html=await response.text();
  const css=`<style id="abc-final-fixes">
  .bus-stage{background:#fff!important;border:2px solid #e6ddf2!important;display:grid!important;place-items:center!important;min-height:500px!important}
  .bus-stage:after{display:none!important}.book-bus{position:relative!important;left:auto!important;bottom:auto!important;width:min(560px,92%)!important;border-radius:0!important;box-shadow:none!important;filter:drop-shadow(0 18px 24px rgba(41,31,66,.18))}
  .author-title{align-items:center!important}.author-photo{width:92px;height:92px;object-fit:cover;border-radius:22px;border:4px solid #fff;box-shadow:0 10px 24px rgba(65,40,100,.16);flex:0 0 auto}.author-mark{display:none!important}.author{display:flex;flex-direction:column;gap:10px}.author-title h3{font-size:1.35rem}
  @media(max-width:700px){.author-photo{width:78px;height:78px}.bus-stage{min-height:360px!important}.book-bus{width:95%!important}}
  </style>`;
  if(html.includes('</head>')) html=html.replace('</head>',css+'</head>');
  html=html.replace('This section intentionally keeps the authors text-only so the child-focused visual language remains centered on the book, characters, activities and learning experience.','Meet the authors behind ABC\'s of Technology and the learning experience created for young readers.');
  html=html.replace('<span class="author-mark">JH</span><h3>Jason L. Hughes</h3>','<img class="author-photo" src="/assets/authors/jason-hughes-abc-author.webp" alt="Jason L. Hughes, author of ABC\'s of Technology"><h3>Jason L. Hughes</h3>');
  html=html.replace('<span class="author-mark">AS</span><h3>April M. Sanders</h3>','<img class="author-photo" src="/assets/authors/april-sanders-abc-author.webp" alt="April M. Sanders, co-author of ABC\'s of Technology"><h3>April M. Sanders</h3>');
  return new Response(html,{status:response.status,statusText:response.statusText,headers:secureHeaders(response.headers)});
}

export default{
  async fetch(request,env){
    const url=new URL(request.url),path=url.pathname;
    if(request.method!=='GET'&&request.method!=='HEAD') return new Response('Method not allowed',{status:405,headers:TEXT_HEADERS});
    if(path==='/assets/book/book-bus-crop.webp') return svgResponse(BUS_ONLY_SVG);
    if(path==='/api/health') return new Response(JSON.stringify({ok:true,property:"ABC's of Technology",payments:'external-only',childAccounts:false,officialBookAssets:true,bookPreviewPages:3,coloringPDFs:26,authorPortraits:true,bus:'clean-abc-tech-bus',deployment:'ABC-OF-TECHNOLOGY-10OF10-AUTHOR-BUS-FIX'}),{status:200,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
    if(path==='/robots.txt') return new Response('User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: https://abcoftech.atechspot.com/sitemap.xml\n',{headers:TEXT_HEADERS});
    if(path==='/sitemap.xml') return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://abcoftech.atechspot.com/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url></urlset>',{headers:XML_HEADERS});
    if(path==='/coloring/'||path==='/coloring'){
      const all=url.searchParams.get('all'),letter=(url.searchParams.get('letter')||'').toUpperCase();
      if(all==='1') return redirect(request,'/downloads/coloring-pages/abc-technology-coloring-pages-a-z-26-pages.pdf',302);
      if(PDF_BY_LETTER[letter]) return redirect(request,'/downloads/coloring-pages/'+PDF_BY_LETTER[letter],302);
      return redirect(request,'/#free',302);
    }
    if(path==='/downloads/coloring-pages/abc-tech-coloring-pages-a-z-circuit-edition-26-pages.pdf') return redirect(request,'/downloads/coloring-pages/abc-technology-coloring-pages-a-z-26-pages.pdf',301);
    if(path.startsWith('/free-resources/')&&path!=='/free-resources/'){
      const slug=path.replace('/free-resources/','').replace(/\/$/,'');const letter=LEGACY_COLORING[slug];if(letter) return redirect(request,'/downloads/coloring-pages/'+PDF_BY_LETTER[letter],301);
    }
    if(path.startsWith('/authors/')) return redirect(request,'/#about',301);
    if(SECTION_REDIRECTS.has(path)) return redirect(request,SECTION_REDIRECTS.get(path),301);
    const response=await env.ASSETS.fetch(request);
    const type=response.headers.get('content-type')||'';
    if(type.includes('text/html')&&request.method==='GET') return enhanceHtml(response);
    if(type.includes('text/html')) return new Response(response.body,{status:response.status,statusText:response.statusText,headers:secureHeaders(response.headers)});
    return response;
  }
};