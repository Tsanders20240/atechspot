import baseWorker from './worker.js';

const ORIGIN='https://abcoftech.atechspot.com';
const LANDINGS={
  '/free-resources/virtual-reality-coloring-page/':{
    title:'VR Headset Coloring Page – Free Printable PDF | ABC’s of Technology',
    h1:'VR Headset Coloring Page',
    label:'V is for Virtual Reality',
    pdf:'/downloads/coloring-pages/v-virtual-reality.pdf',
    description:'Download a free printable VR headset coloring page for kids. A screen-free technology activity from ABC’s of Technology for families, classrooms and early STEM learning.',
    copy:'Virtual reality, often shortened to VR, uses a headset to help a person see and explore a digital environment. This printable coloring activity gives young learners a simple way to talk about headsets, digital worlds and how technology can create new experiences without requiring a child account or online sign-in.'
  },
  '/free-resources/battery-coloring-page/':{
    title:'Battery Coloring Page – Free Printable PDF for Kids | ABC’s of Technology',
    h1:'Battery Coloring Page',
    label:'B is for Battery',
    pdf:'/downloads/coloring-pages/b-battery.pdf',
    description:'Free printable battery coloring page for kids. Use this screen-free STEM activity to introduce batteries, stored energy and everyday technology.',
    copy:'Batteries store energy that many everyday devices can use. A grown-up or educator can use this printable page to start a simple conversation about where batteries appear, why devices need power and why batteries should always be handled safely and according to the product instructions.'
  },
  '/free-resources/drone-coloring-page/':{
    title:'Drone Coloring Page – Free Printable Technology Activity | ABC’s of Technology',
    h1:'Drone Coloring Page',
    label:'D is for Drone',
    pdf:'/downloads/coloring-pages/d-drone.pdf',
    description:'Download a free printable drone coloring page for kids. A screen-free technology and STEM activity from ABC’s of Technology.',
    copy:'A drone is an aircraft that can fly without a pilot sitting inside it. Some drones take photos, help inspect places that are hard to reach or support research and creative projects. This printable page introduces the idea through a simple screen-free coloring activity for young learners.'
  }
};

const ALPHABET=[['A','Analog Phone'],['B','Battery'],['C','Computer'],['D','Drone'],['E','Email'],['F','Flash Drive'],['G','Game Controller'],['H','Headphones'],['I','Internet'],['J','Joystick'],['K','Keyboard'],['L','Laptop'],['M','Mouse'],['N','Network'],['O','Online'],['P','Programming'],['Q','QR Code'],['R','Robot'],['S','Smartphone'],['T','Tablet'],['U','USB'],['V','Virtual Reality'],['W','Wi-Fi'],['X','X-Ray'],['Y','YouTube'],['Z','Zoom']];

const HEADERS={'content-type':'text/html; charset=utf-8','cache-control':'public, max-age=300','x-content-type-options':'nosniff','referrer-policy':'strict-origin-when-cross-origin','x-frame-options':'SAMEORIGIN'};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shell=(title,description,canonical,body,schema)=>`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1"><link rel="canonical" href="${esc(canonical)}"><meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(canonical)}"><meta name="theme-color" content="#1677ff"><script type="application/ld+json">${JSON.stringify(schema)}</script><style>*{box-sizing:border-box}body{margin:0;font-family:Nunito,'Trebuchet MS',system-ui,sans-serif;color:#17213d;background:linear-gradient(180deg,#effaff,#fff 34%);line-height:1.6}a{color:inherit}.wrap{width:min(920px,calc(100% - 30px));margin:auto}.top{padding:18px 0;border-bottom:1px solid #dce9fb;background:#fff}.brand{font-weight:1000;color:#10205a;text-decoration:none}.brand span{color:#1677ff}.hero{padding:62px 0 34px}.crumbs{font-size:.78rem;color:#68728d}.crumbs a{color:#165dcc}.eyebrow{display:inline-block;margin-top:25px;padding:7px 10px;border-radius:999px;background:#eaf4ff;color:#1558b7;font-size:.75rem;font-weight:1000;letter-spacing:.06em}.hero h1{font-size:clamp(2.7rem,7vw,5.2rem);line-height:.94;letter-spacing:-.05em;color:#10205a;margin:16px 0}.lead{font-size:1.08rem;color:#4f5c79;max-width:760px}.card{border:1px solid #dce9fb;border-radius:28px;background:#fff;padding:28px;box-shadow:0 18px 45px rgba(31,79,140,.1);margin:24px 0}.letter{width:86px;height:86px;border-radius:24px;background:linear-gradient(135deg,#1677ff,#7138df);color:#fff;display:grid;place-items:center;font-size:2.8rem;font-weight:1000}.btn{display:inline-flex;text-decoration:none;border-radius:999px;padding:13px 18px;background:#1677ff;color:#fff;font-weight:1000;margin:8px 8px 8px 0}.btn.alt{background:#fff;color:#164f9d;border:2px solid #bdd5f9}.note{font-size:.86rem;color:#69728a}.related{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.related a,.az a{padding:14px;border:1px solid #dce9fb;border-radius:16px;background:#f7fbff;text-decoration:none;font-weight:900;color:#174d91}.az{display:grid;grid-template-columns:repeat(4,1fr);gap:9px}.az span{color:#7138df;font-weight:1000;margin-right:5px}.footer{margin-top:50px;padding:28px 0;background:#10205a;color:#dce6ff;font-size:.82rem}@media(max-width:680px){.related,.az{grid-template-columns:1fr 1fr}.card{padding:21px}}@media(max-width:430px){.related,.az{grid-template-columns:1fr}}</style><script src="/analytics.js" defer></script></head><body><header class="top"><div class="wrap"><a class="brand" href="/">ABC’s of <span>Technology</span></a></div></header><main>${body}</main><footer class="footer"><div class="wrap">ABC’s of Technology • A+ Techucation LLC • Free learning resources are designed for grown-up guided use.</div></footer></body></html>`;

function landing(path,data){
  const canonical=ORIGIN+path;
  const schema={'@context':'https://schema.org','@graph':[{'@type':'LearningResource','name':data.h1,'description':data.description,'url':canonical,'learningResourceType':'Printable coloring activity','educationalLevel':'Early childhood / elementary','isAccessibleForFree':true,'provider':{'@type':'Organization','name':'ABC’s of Technology','url':ORIGIN+'/'}},{'@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':'ABC’s of Technology','item':ORIGIN+'/'},{'@type':'ListItem','position':2,'name':'Free Resources','item':ORIGIN+'/#free'},{'@type':'ListItem','position':3,'name':data.h1,'item':canonical}]}]};
  const related=Object.entries(LANDINGS).filter(([p])=>p!==path).map(([p,d])=>`<a href="${p}">${esc(d.h1)} →</a>`).join('')+`<a href="/technology-alphabet-a-to-z/">Technology Alphabet A–Z →</a>`;
  const body=`<section class="hero"><div class="wrap"><div class="crumbs"><a href="/">Home</a> / <a href="/#free">Free Resources</a> / ${esc(data.h1)}</div><span class="eyebrow">FREE PRINTABLE • SCREEN-FREE STEM</span><h1>${esc(data.h1)}</h1><p class="lead">${esc(data.description)}</p><article class="card"><div class="letter">${esc(data.label.charAt(0))}</div><h2>${esc(data.label)}</h2><p>${esc(data.copy)}</p><a class="btn" href="${esc(data.pdf)}">Download the free PDF →</a><a class="btn alt" href="/#free">See all free activities</a><p class="note">For grown-ups and educators: print the PDF for personal, classroom or library learning use according to the resource terms. Children do not need an account to access this activity.</p></article><section class="card"><h2>Try more technology activities</h2><div class="related">${related}</div></section></div></section>`;
  return new Response(shell(data.title,data.description,canonical,body,schema),{status:200,headers:HEADERS});
}

function alphabetLanding(){
  const path='/technology-alphabet-a-to-z/',canonical=ORIGIN+path;
  const title='Technology Alphabet A to Z for Kids – Free Printable | ABC’s of Technology';
  const description='Explore a technology alphabet from A to Z for kids, with 26 beginner-friendly tech words and free printable coloring activities from ABC’s of Technology.';
  const items=ALPHABET.map(([l,w],i)=>({'@type':'ListItem','position':i+1,'name':`${l} is for ${w}`}));
  const schema={'@context':'https://schema.org','@graph':[{'@type':'LearningResource','name':'Technology Alphabet A to Z for Kids','description':description,'url':canonical,'learningResourceType':'Technology alphabet and printable learning activity','isAccessibleForFree':true,'provider':{'@type':'Organization','name':'ABC’s of Technology','url':ORIGIN+'/'}},{'@type':'ItemList','name':'Technology Alphabet A to Z','itemListElement':items}]};
  const grid=ALPHABET.map(([l,w])=>`<div><span>${l}</span>${esc(w)}</div>`).join('');
  const body=`<section class="hero"><div class="wrap"><div class="crumbs"><a href="/">Home</a> / Technology Alphabet A–Z</div><span class="eyebrow">A–Z TECHNOLOGY LEARNING</span><h1>Technology Alphabet <br>A to Z for Kids</h1><p class="lead">Use 26 familiar technology words to introduce young learners to digital tools, devices and ideas one letter at a time.</p><article class="card"><h2>26 technology words from A to Z</h2><div class="az">${grid}</div><p>Start with a word, ask where a child may have seen it, then connect the conversation to a drawing, coloring page or simple real-world example. The goal is vocabulary and curiosity—not more screen time.</p><a class="btn" href="/downloads/coloring-pages/abc-technology-coloring-pages-a-z-26-pages.pdf">Download the 26-page coloring pack →</a><a class="btn alt" href="/#play">Explore learning activities</a></article><section class="card"><h2>Popular printable technology pages</h2><div class="related"><a href="/free-resources/virtual-reality-coloring-page/">VR Headset Coloring Page →</a><a href="/free-resources/battery-coloring-page/">Battery Coloring Page →</a><a href="/free-resources/drone-coloring-page/">Drone Coloring Page →</a></div></section></div></section>`;
  return new Response(shell(title,description,canonical,body,schema),{status:200,headers:HEADERS});
}

function sitemap(){
  const urls=['/',...Object.keys(LANDINGS),'/technology-alphabet-a-to-z/'];
  const xml='<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map((p,i)=>`<url><loc>${ORIGIN}${p}</loc><changefreq>${i===0?'weekly':'monthly'}</changefreq><priority>${i===0?'1.0':'0.8'}</priority></url>`).join('')+'</urlset>';
  return new Response(xml,{status:200,headers:{'content-type':'application/xml; charset=utf-8','cache-control':'public, max-age=3600','x-content-type-options':'nosniff'}});
}

const resourceNav='<section style="padding:34px 18px;background:#f4f9ff;border-top:1px solid #dce9fb"><div style="width:min(980px,100%);margin:auto;text-align:center"><strong style="color:#10205a">Free technology learning pages:</strong> <a href="/free-resources/virtual-reality-coloring-page/">VR Headset Coloring Page</a> · <a href="/free-resources/battery-coloring-page/">Battery Coloring Page</a> · <a href="/free-resources/drone-coloring-page/">Drone Coloring Page</a> · <a href="/technology-alphabet-a-to-z/">Technology Alphabet A–Z</a></div></section>';

export default {
  async fetch(request, env, ctx) {
    const url=new URL(request.url),path=url.pathname.endsWith('/')?url.pathname:url.pathname+'/';
    if((request.method==='GET'||request.method==='HEAD')&&LANDINGS[path]) return landing(path,LANDINGS[path]);
    if((request.method==='GET'||request.method==='HEAD')&&path==='/technology-alphabet-a-to-z/') return alphabetLanding();
    if(request.method==='GET'&&url.pathname==='/sitemap.xml') return sitemap();
    let response=await baseWorker.fetch(request,env,ctx);
    const type=response.headers.get('content-type')||'';
    if(request.method==='GET'&&type.includes('text/html')){
      response=new HTMLRewriter()
        .on('head',{element(el){el.append('<script src="/analytics.js" defer></script>',{html:true});}})
        .on('footer',{element(el){el.before(resourceNav,{html:true});}})
        .transform(response);
    }
    return response;
  }
};
