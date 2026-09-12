import app from './seo-worker-v2.js';
import {mediaResponse} from './photo-assets.js';

const FINAL_COPY={
  '/contact/':'ATech Network reviews inquiries according to the information available at the time of submission. If additional details are needed, the network may request clarification before deciding whether a sponsorship, creator, distribution or media conversation should move forward. Keeping the initial request focused helps protect both the sender and the network from unnecessary disclosure.',
  '/privacy/':'Questions about this privacy information can be submitted through the network contact page.',
  '/terms/':'Continued use of the website after published updates means users should review the current terms when beginning a new inquiry or partnership discussion.'
};

const PHOTO_CSS=`
<style id="atech-network-photo-upgrade">
.photo-crop{position:relative;display:block;width:100%;height:100%;overflow:hidden;background:#061522}
.photo-crop .photo-sheet{position:absolute!important;left:0!important;top:0!important;width:100%!important;height:auto!important;max-width:none!important;object-fit:initial!important;transform:translateY(calc(var(--row) * -10%));will-change:transform}
.art>.photo-crop{position:absolute;inset:0;border-radius:0}
.visual>.photo-crop{height:auto;aspect-ratio:16/9}
.showhero>.photo-crop{position:absolute;inset:0;height:100%;width:100%}
.showhero>.photo-crop .photo-sheet{min-width:100%;width:100%!important}
.watch-photo{margin:0 0 24px;border:1px solid #174768;border-radius:18px;overflow:hidden;background:#071827}
.watch-photo .photo-crop{height:auto;aspect-ratio:16/9}
.stage{aspect-ratio:16/9!important;background-repeat:no-repeat!important}
@media(max-width:620px){.stage{aspect-ratio:16/9!important}.showhero>.photo-crop .photo-sheet{width:auto!important;height:1000%!important;left:50%!important;transform:translate(calc(-50% + 0px),calc(var(--row) * -10%))}}
</style>`;

const ROWS={drone:1,ai:2,devices:3,innovation:4,creator:5,future:6,partnership:7,editor:8,host:9};

function normalize(path){
  if(path==='') return '/';
  if(path==='/' || path.startsWith('/api/') || path.startsWith('/art/') || path.startsWith('/media/') || path.includes('.')) return path;
  return path.endsWith('/')?path:path+'/';
}

function cleanAlt(alt){
  return alt.replace(/^Placeholder artwork for\s*/i,'ATech Network promotional artwork for ')
    .replace(/concept art$/i,'production artwork');
}

function crop(row,alt){
  return `<div class="photo-crop" style="--row:${row}"><img class="photo-sheet" src="/media/cards.webp" alt="${cleanAlt(alt)}" decoding="async"></div>`;
}

function swapPhotos(html,path){
  html=html.replaceAll('https://atechnetwork.atechspot.com/art/studio.svg','https://atechnetwork.atechspot.com/media/hero.webp');
  html=html.replaceAll('<img src="/art/studio.svg" alt="ATech Network studio concept">','<img src="/media/hero.webp" alt="ATech Network broadcast studio" fetchpriority="high" decoding="async">');
  html=html.replaceAll('<img src="/art/studio.svg" alt="Studio concept art">','<img src="/media/hero.webp" alt="ATech Network broadcast studio and production control room" loading="lazy" decoding="async">');

  html=html.replaceAll('<img src="/art/creator.svg" alt="Creator concept art">',crop(ROWS.editor,'Independent creator editing technology media in a production studio'));
  html=html.replaceAll('<img src="/art/devices.svg" alt="Multi-screen distribution art">',crop(ROWS.future,'ATech Network programming shown across television, laptop, tablet and mobile screens'));
  html=html.replaceAll('<img src="/art/partnership.svg" alt="Partnership concept art">',crop(ROWS.partnership,'Media sponsorship and brand partnership meeting'));

  const map={drone:ROWS.drone,ai:ROWS.ai,devices:ROWS.devices,innovation:ROWS.innovation,creator:ROWS.creator,future:ROWS.future};
  for(const [name,row] of Object.entries(map)){
    const re=new RegExp(`<img src="/art/${name}\\.svg" alt="([^"]*)">`,'g');
    html=html.replace(re,(_,alt)=>crop(row,alt));
  }

  const oldReel="st.style.backgroundImage='url('+x[0]+')';";
  const newReel=`const rm={'/art/drone.svg':1,'/art/ai.svg':2,'/art/devices.svg':3,'/art/innovation.svg':4,'/art/creator.svg':5,'/art/future.svg':6};st.style.backgroundImage=\"url('/media/cards.webp')\";st.style.backgroundSize='100% 1000%';st.style.backgroundPosition='0 '+(((rm[x[0]]??0)/9)*100)+'%';`;
  html=html.replaceAll(oldReel,newReel);

  if(path==='/watch/' && !html.includes('Creator-led production')){
    html=html.replace('<div class="reel" data-reel>',`<div class="watch-photo">${crop(ROWS.host,'Creator-led ATech Network technology production')}<div class="cb"><p class="ey">CREATOR-LED PROGRAMMING</p><h2>Technology stories with a human point of view.</h2><p>ATech Network is being built around useful conversations, demonstrations and creator voices—not anonymous filler content.</p></div></div><div class="reel" data-reel>`);
  }

  html=html.replace('</head>',PHOTO_CSS+'</head>');
  return html;
}

export default {
  async fetch(request,env,ctx){
    const url=new URL(request.url);
    const media=mediaResponse(url.pathname);
    if(media) return media;

    const response=await app.fetch(request,env,ctx);
    const type=response.headers.get('content-type')||'';
    if(!type.includes('text/html')) return response;
    const path=normalize(url.pathname);
    let html=await response.text();
    if(FINAL_COPY[path]) html=html.replace('</main>',`<section class="sec alt"><div class="shell"><p>${FINAL_COPY[path]}</p></div></section></main>`);
    html=swapPhotos(html,path);
    const headers=new Headers(response.headers);
    headers.set('content-type','text/html; charset=utf-8');
    return new Response(html,{status:response.status,statusText:response.statusText,headers});
  }
};
