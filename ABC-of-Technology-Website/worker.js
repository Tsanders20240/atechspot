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

const BUS_ONLY_SVG=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 820" role="img" aria-label="ABC's of Technology school bus">
<g stroke="#24222a" stroke-width="13" stroke-linecap="round" stroke-linejoin="round">
<path fill="#ffe000" d="M102 305Q115 190 230 155L735 78Q938 54 1030 170L1118 390Q1152 485 1107 574Q1062 652 953 655H262Q111 650 83 533Z"/>
<path fill="#fff04a" stroke="none" d="M185 222Q469 110 858 111L827 146Q464 145 202 248Z"/>
<path fill="#21b9ef" d="M238 233L474 180V407H174L178 294Z"/>
<path fill="#23baf0" d="M520 170H904Q962 174 1002 238L1038 406H520Z"/>
<path fill="#66733e" stroke="none" d="M251 328L473 258V399H194Z"/>
<path fill="#66733e" stroke="none" d="M528 310Q642 235 741 271Q843 303 916 235L1003 307L1023 395H527Z"/>
<path fill="#fff" d="M653 377Q660 277 756 244Q851 210 903 305Q917 335 915 376Z"/>
<circle cx="778" cy="278" r="49" fill="#845034"/><path fill="#3a1d14" d="M727 281Q733 218 803 218Q870 220 887 274Q823 246 727 281Z"/>
<circle cx="757" cy="300" r="7" fill="#24222a" stroke="none"/><circle cx="827" cy="299" r="7" fill="#24222a" stroke="none"/><path fill="none" d="M767 330Q792 350 823 329"/><path d="M730 365Q789 326 850 368" fill="none"/>
<path fill="#d6d6d6" d="M770 475H1063L1081 567H760Z"/><path fill="#3f4650" d="M778 496H1051V555H772Z"/>
<path fill="#2d3038" d="M734 605H1090L1060 653H721Z"/>
<circle cx="245" cy="647" r="104" fill="#dff6ff"/><circle cx="245" cy="647" r="37" fill="#87909a"/>
<circle cx="708" cy="647" r="104" fill="#dff6ff"/><circle cx="708" cy="647" r="37" fill="#87909a"/>
<circle cx="1005" cy="648" r="74" fill="#dff6ff"/><circle cx="1005" cy="648" r="27" fill="#87909a"/>
<path fill="#37363e" d="M482 165H920L900 101H510Z"/><circle cx="554" cy="132" r="26" fill="#ff6949"/><circle cx="615" cy="126" r="26" fill="#ff6949"/><circle cx="826" cy="120" r="26" fill="#ff6949"/><circle cx="889" cy="127" r="26" fill="#ff6949"/>
<text x="670" y="137" text-anchor="middle" font-family="Trebuchet MS,Arial,sans-serif" font-size="52" font-weight="900" fill="#171717" stroke="none">School Bus</text>
<text x="216" y="335" font-family="Trebuchet MS,Arial,sans-serif" font-size="90" font-weight="900" fill="#fff" stroke="none">A</text><text x="320" y="370" font-family="Trebuchet MS,Arial,sans-serif" font-size="86" font-weight="900" fill="#fff" stroke="none">C</text><text x="418" y="335" font-family="Trebuchet MS,Arial,sans-serif" font-size="88" font-weight="900" fill="#fff" stroke="none">D</text>
<text x="590" y="311" font-family="Trebuchet MS,Arial,sans-serif" font-size="86" font-weight="900" fill="#fff" stroke="none">G</text><text x="610" y="382" font-family="Trebuchet MS,Arial,sans-serif" font-size="90" font-weight="900" fill="#fff" stroke="none">E</text><text x="711" y="385" font-family="Trebuchet MS,Arial,sans-serif" font-size="90" font-weight="900" fill="#fff" stroke="none">F</text>
</g></svg>`;

const TITLE_PAGE_SVG=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 629 637" role="img" aria-label="Official ABC's of Technology title page">
<defs><radialGradient id="bg"><stop stop-color="#eef7ff"/><stop offset="1" stop-color="#88addf"/></radialGradient></defs><rect width="629" height="637" fill="url(#bg)"/>
<g fill="#050505" font-family="Trebuchet MS,Arial,sans-serif" text-anchor="middle"><text x="314" y="82" font-size="22">Jason L. Hughes &amp; April M. Sanders</text><text x="314" y="142" font-size="42" font-weight="900">A+ TECHUCATION’S</text><text x="314" y="211" font-size="64" font-weight="900"><tspan fill="#f30b91">A</tspan><tspan fill="#69d24f">B</tspan><tspan fill="#1fb6e8">C</tspan><tspan fill="#ff7a18">’S</tspan><tspan fill="#050505"> OF</tspan></text><text x="314" y="266" font-size="58" font-weight="900">TECHNOLOGY</text><text x="314" y="318" font-size="26" font-weight="700">Written By</text><text x="314" y="351" font-size="25">Jason L. Hughes</text><text x="314" y="381" font-size="25">“Mr. A+”</text><text x="314" y="411" font-size="25">and April M. Sanders</text><text x="314" y="462" font-size="20" font-weight="700">www.abcoftechnology.com</text></g>
<g fill="#111" font-family="Arial,sans-serif" font-size="12"><text x="56" y="520">Copyright © 2020 by A+ TECHUCATION LLC,</text><text x="56" y="537">No part of this publication may be reproduced in whole, or in part,</text><text x="56" y="554">or stored in a retrieval system, or transmitted in any form, or by any</text><text x="56" y="571">means, electronic, mechanical, photocopying, recording, or</text><text x="56" y="588">otherwise, without written permission of the author.</text><text x="56" y="605">Artwork by Toby Mikle of MyBookIllustrator.com</text></g></svg>`;

const BEST_YOU_SVG=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 629 637" role="img" aria-label="Official Best You book page"><defs><radialGradient id="b"><stop stop-color="#77a6dc"/><stop offset="1" stop-color="#91b1da"/></radialGradient></defs><rect width="629" height="637" fill="url(#b)"/><text x="314" y="214" text-anchor="middle" font-family="Trebuchet MS,Arial,sans-serif" font-size="46" fill="#111">and be the</text><text x="314" y="320" text-anchor="middle" font-family="Arial,sans-serif" font-size="108" font-style="italic" font-weight="900" fill="#fff">BEST</text><text x="314" y="452" text-anchor="middle" font-family="Arial,sans-serif" font-size="128" font-weight="900" fill="#fff200">YOU!</text></svg>`;

const A_PAGE_SVG=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1268 632" role="img" aria-label="Official A page Old Technology versus New">
<rect width="1268" height="632" fill="#d5ad99"/><rect width="1268" height="138" fill="#5dc36e"/><rect width="1268" height="118" fill="#95d4ff"/><rect y="551" width="1268" height="81" fill="#55bf6b"/><path d="M632 0V632" stroke="#111" stroke-width="18"/>
<g font-family="Trebuchet MS,Arial,sans-serif" fill="#111"><text x="56" y="95" font-size="96">Aa</text><text x="245" y="91" font-size="43" font-weight="900">OLD TECHNOLOGY</text><text x="392" y="141" font-size="40" font-weight="900">VS.</text><text x="400" y="183" font-size="40" font-weight="900">NEW</text></g>
<rect x="38" y="184" width="276" height="320" fill="#fff" stroke="#111" stroke-width="3"/><g font-family="Trebuchet MS,Arial,sans-serif" fill="#393939" text-anchor="middle" font-weight="900"><text x="176" y="266" font-size="40">ANALOG</text><text x="176" y="306" font-size="40">PHONE</text><text x="176" y="385" font-size="43">VS.</text><text x="176" y="461" font-size="37">ANDROID</text></g><rect x="196" y="523" width="128" height="58" fill="#fff" stroke="#111" stroke-width="3"/><text x="260" y="562" text-anchor="middle" font-family="Trebuchet MS,Arial,sans-serif" font-size="32" font-weight="900">START</text>
<rect x="704" y="30" width="254" height="125" fill="#fff" stroke="#111" stroke-width="3"/><g font-family="Arial,sans-serif" fill="#111" font-size="18"><text x="719" y="63">Analog signals or information</text><text x="719" y="91">represented by a continuously</text><text x="719" y="119">variable physical quantity.</text></g>
<rect x="1000" y="30" width="235" height="125" fill="#fff" stroke="#111" stroke-width="3"/><g font-family="Arial,sans-serif" fill="#111" font-size="18"><text x="1015" y="63">Android an open-source operating</text><text x="1015" y="91">system used for smartphones and</text><text x="1015" y="119">tablet computers.</text></g>
<g stroke="#222" stroke-width="4" fill="#9bcbe2"><path d="M805 198Q862 183 886 225L891 311Q881 349 827 346Q783 330 783 284L786 223Z"/><line x1="795" y1="337" x2="774" y2="378"/><line x1="865" y1="342" x2="885" y2="382"/><line x1="781" y1="257" x2="755" y2="237"/><line x1="890" y1="258" x2="914" y2="235"/><circle cx="816" cy="255" r="6" fill="#222"/><circle cx="856" cy="252" r="6" fill="#222"/><path d="M817 291Q839 276 860 294" fill="none"/>
<path d="M1018 321Q1077 299 1110 341L1116 443Q1091 484 1038 472Q1001 456 1000 407L1002 347Z"/><line x1="1022" y1="458" x2="1000" y2="495"/><line x1="1094" y1="461" x2="1119" y2="497"/><line x1="1000" y1="378" x2="973" y2="358"/><line x1="1114" y1="379" x2="1144" y2="355"/><circle cx="1035" cy="374" r="6" fill="#222"/><circle cx="1080" cy="372" r="6" fill="#222"/><path d="M1035 415Q1059 435 1087 409" fill="none"/></g>
<path d="M1145 550Q1195 425 1168 293" stroke="#222" stroke-width="5" fill="none"/><path d="M1142 549l25-8-13 24" fill="#fff" stroke="#222" stroke-width="4"/></svg>`;

function redirect(request,target,status=301){return Response.redirect(new URL(target,request.url).toString(),status)}
function svgResponse(svg){return new Response(svg,{status:200,headers:SVG_HEADERS})}
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

    if(path==='/assets/book/book-bus-crop.webp') return svgResponse(BUS_ONLY_SVG);
    if(path==='/assets/book/book-page-title.webp') return svgResponse(TITLE_PAGE_SVG);
    if(path==='/assets/book/book-page-best-you.webp') return svgResponse(BEST_YOU_SVG);
    if(path==='/assets/book/book-page-a.webp') return svgResponse(A_PAGE_SVG);

    if(path==='/api/health') return new Response(JSON.stringify({
      ok:true,property:"ABC's of Technology",payments:'external-only',childAccounts:false,
      officialBookAssets:true,bookPreviewPages:3,coloringPDFs:26,deployment:'ABC-OF-TECHNOLOGY-10OF10-VISUAL-FINAL'
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
    if(path==='/downloads/coloring-pages/abc-tech-coloring-pages-a-z-circuit-edition-26-pages.pdf') return redirect(request,'/downloads/coloring-pages/abc-technology-coloring-pages-a-z-26-pages.pdf',301);
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