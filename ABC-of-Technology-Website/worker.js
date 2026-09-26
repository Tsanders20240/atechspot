const HTML_HEADERS={
  'content-type':'text/html; charset=utf-8',
  'x-content-type-options':'nosniff',
  'referrer-policy':'strict-origin-when-cross-origin',
  'permissions-policy':'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'cross-origin-opener-policy':'same-origin',
  'x-frame-options':'SAMEORIGIN',
  'strict-transport-security':'max-age=31536000; includeSubDomains',
  'content-security-policy':"default-src 'self' https: data: blob:; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https:; script-src 'self' 'unsafe-inline' https:; connect-src 'self' https:; font-src 'self' data: https:; frame-src 'self' https:; form-action 'self' https:; upgrade-insecure-requests"
};
const TEXT_HEADERS={'content-type':'text/plain; charset=utf-8','cache-control':'public, max-age=3600','x-content-type-options':'nosniff'};
const XML_HEADERS={'content-type':'application/xml; charset=utf-8','cache-control':'public, max-age=3600','x-content-type-options':'nosniff'};
const SVG_HEADERS={'content-type':'image/svg+xml; charset=utf-8','cache-control':'public, max-age=300','x-content-type-options':'nosniff'};

const LISTEN_LINKS={
  amazon:'https://music.amazon.com/tracks/B0979KNB2S?marketplaceId=ATVPDKIKX0DER&musicTerritory=US',
  youtube:'https://music.youtube.com/watch?v=j7s5P1pVFtY',
  spotify:'https://open.spotify.com/track/7z5QY0MFuY8IhCOlPLv6wQ'
};

const LISTEN_HEADERS={
  ...HTML_HEADERS,
  'cache-control':'no-store, no-cache, must-revalidate, max-age=0, s-maxage=0',
  'cdn-cache-control':'no-store',
  'cloudflare-cdn-cache-control':'no-store',
  'pragma':'no-cache',
  'expires':'0'
};

function listenPage(){
  const html=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Listen to ABC of Tech | Amazon Music, YouTube Music & Spotify</title>
<meta name="description" content="Listen to ABC of Tech on Amazon Music, YouTube Music, or Spotify. Choose your preferred streaming service.">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="https://www.abcoftech.atechspot.com/listen">
<meta name="theme-color" content="#071b4f">
<meta property="og:type" content="music.song">
<meta property="og:title" content="Listen to ABC of Tech">
<meta property="og:description" content="Choose Amazon Music, YouTube Music, or Spotify to listen to ABC of Tech.">
<meta property="og:url" content="https://www.abcoftech.atechspot.com/listen">
<style>
*{box-sizing:border-box}
:root{color-scheme:light}
body{margin:0;min-height:100vh;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#10265d;background:
radial-gradient(circle at 15% 10%,rgba(38,200,255,.22),transparent 25rem),
radial-gradient(circle at 85% 20%,rgba(128,79,255,.2),transparent 24rem),
linear-gradient(160deg,#edf9ff 0%,#f7f5ff 46%,#fff 100%)}
main{min-height:100vh;display:grid;place-items:center;padding:28px}
.card{width:min(620px,100%);background:rgba(255,255,255,.94);border:1px solid #d8e8f7;border-radius:32px;box-shadow:0 30px 80px rgba(18,55,111,.16);padding:34px}
.brand{display:inline-flex;align-items:center;gap:9px;text-decoration:none;color:#0d2b6b;font-weight:900;font-size:.95rem}
.brand-mark{width:36px;height:36px;border-radius:11px;display:grid;place-items:center;background:linear-gradient(135deg,#0d7cff,#7a51ef);color:#fff;font-weight:1000}
.badge{display:inline-block;margin-top:28px;padding:7px 11px;border-radius:999px;background:#e8f5ff;color:#075dbd;font-size:.73rem;font-weight:900;letter-spacing:.08em}
h1{margin:12px 0 8px;font-size:clamp(2.4rem,7vw,4.6rem);line-height:.95;letter-spacing:-.055em;color:#08255b}
.lead{margin:0 0 26px;color:#5c6f8d;font-size:1.05rem;line-height:1.65}
.links{display:grid;gap:12px}
.listen-btn{display:flex;align-items:center;justify-content:space-between;gap:16px;text-decoration:none;border-radius:20px;padding:18px 19px;font-weight:900;border:1px solid #dce8f6;background:#fff;color:#0a285f;box-shadow:0 10px 28px rgba(14,56,111,.07);transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}
.listen-btn:hover,.listen-btn:focus-visible{transform:translateY(-3px);box-shadow:0 18px 38px rgba(14,56,111,.13);border-color:#82bfff;outline:none}
.platform{display:flex;align-items:center;gap:13px}
.icon{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;font-size:1.25rem;font-weight:1000;color:#fff}
.amazon .icon{background:linear-gradient(135deg,#00a8e1,#232f3e)}
.youtube .icon{background:#ff0033}
.spotify .icon{background:#1db954}
.arrow{font-size:1.35rem;color:#4e6f9c}
.note{margin:22px 0 0;color:#71809a;font-size:.82rem;line-height:1.55}
.back{display:inline-block;margin-top:20px;color:#176dcc;font-weight:850;text-decoration:none}
.back:hover{text-decoration:underline}
@media(max-width:520px){main{padding:16px}.card{padding:24px;border-radius:24px}.listen-btn{padding:15px}.icon{width:40px;height:40px}}
</style>
</head>
<body>
<main>
  <section class="card" aria-labelledby="listenTitle">
    <a class="brand" href="/"><span class="brand-mark">A+</span><span>ABC's of Technology</span></a>
    <span class="badge">OFFICIAL SMART LINK</span>
    <h1 id="listenTitle">ABC of Tech</h1>
    <p class="lead">Choose where to listen.</p>
    <div class="links" role="list" aria-label="Music streaming services">
      <a class="listen-btn amazon" role="listitem" href="${LISTEN_LINKS.amazon}" target="_blank" rel="noopener noreferrer"><span class="platform"><span class="icon">a</span><span>Amazon Music</span></span><span class="arrow">↗</span></a>
      <a class="listen-btn youtube" role="listitem" href="${LISTEN_LINKS.youtube}" target="_blank" rel="noopener noreferrer"><span class="platform"><span class="icon">▶</span><span>YouTube Music</span></span><span class="arrow">↗</span></a>
      <a class="listen-btn spotify" role="listitem" href="${LISTEN_LINKS.spotify}" target="_blank" rel="noopener noreferrer"><span class="platform"><span class="icon">●</span><span>Spotify</span></span><span class="arrow">↗</span></a>
    </div>
    <p class="note">Streaming availability can vary by service and region. Links open on the selected music platform.</p>
    <a class="back" href="/#watch">← Back to Watch & Listen</a>
  </section>
</main>
</body>
</html>`;
  return new Response(html,{status:200,headers:LISTEN_HEADERS});
}


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
  ['/shop/','/#shop'],['/shop','/#shop'],['/music/','/listen'],['/music','/listen'],['/songs/','/listen'],
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
function secureHeaders(headers){const h=new Headers(headers);for(const [k,v] of Object.entries(HTML_HEADERS)) if(!h.has(k)) h.set(k,v);h.set('cache-control','no-store, no-cache, must-revalidate');h.set('pragma','no-cache');h.set('expires','0');return h}

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
    if(path==='/listen'||path==='/listen/') return listenPage();
    if(path==='/assets/book/book-bus-crop.webp') return svgResponse(BUS_ONLY_SVG);
    if(path==='/api/health') return new Response(JSON.stringify({ok:true,property:"ABC's of Technology",payments:'external-only',childAccounts:false,officialBookAssets:true,bookPreviewPages:3,coloringPDFs:26,authorPortraits:true,bus:'clean-abc-tech-bus',deployment:'ABC-OF-TECHNOLOGY-10OF10-LISTEN-SMARTLINK-CACHE-FIX'}),{status:200,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
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