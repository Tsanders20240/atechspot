import app from './seo-worker-v2.js';

const FINAL_COPY={
  '/contact/':'ATech Network reviews inquiries according to the information available at the time of submission. If additional details are needed, the network may request clarification before deciding whether a sponsorship, creator, distribution or media conversation should move forward. Keeping the initial request focused helps protect both the sender and the network from unnecessary disclosure.',
  '/privacy/':'Questions about this privacy information can be submitted through the network contact page.',
  '/terms/':'Continued use of the website after published updates means users should review the current terms when beginning a new inquiry or partnership discussion.'
};

function normalize(path){
  if(path==='') return '/';
  if(path==='/' || path.startsWith('/api/') || path.startsWith('/art/') || path.includes('.')) return path;
  return path.endsWith('/')?path:path+'/';
}

export default {
  async fetch(request,env,ctx){
    const response=await app.fetch(request,env,ctx);
    const type=response.headers.get('content-type')||'';
    if(!type.includes('text/html')) return response;
    const path=normalize(new URL(request.url).pathname);
    let html=await response.text();
    if(FINAL_COPY[path]) html=html.replace('</main>',`<section class="sec alt"><div class="shell"><p>${FINAL_COPY[path]}</p></div></section></main>`);
    const headers=new Headers(response.headers);
    headers.set('content-type','text/html; charset=utf-8');
    return new Response(html,{status:response.status,statusText:response.statusText,headers});
  }
};
