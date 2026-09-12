import app from './seo-worker.js';

const SHORT_TITLES={
  '/shows/drones-and-beyond/':'Drones & Beyond | Drone Technology | ATech Network',
  '/shows/innovation-today/':'Innovation Today | Technology & Ideas | ATech Network',
  '/shows/creator-spotlight/':'Creator Spotlight | Creator Stories | ATech Network'
};

const BOOST={
  '/watch/':'Use the Watch Center to compare the launch concepts by subject and purpose before choosing a program to explore. As the network develops, this page is intended to organize released programming, previews and related clips in one consistent viewing path. The current presentation is a launch-stage preview environment, so it avoids claiming episode availability or third-party carriage that has not yet been established.',
  '/shows/drones-and-beyond/':'The concept can support practical episode themes such as creative flight planning, visual storytelling, changing drone technology and real-world workflows. Editorial development should distinguish education from advertising and should accurately describe any regulatory, safety or operational considerations that apply to the subject being covered.',
  '/shows/ai-in-real-life/':'Future development can cover practical AI workflows, creative tools, small-business use cases, responsible adoption and the limits of automated systems. The editorial approach should make clear when a demonstration is illustrative, when a tool is being evaluated and when human review remains important.',
  '/shows/tech-made-simple/':'Future episodes can address common technology questions, device setup, app features, digital habits and troubleshooting concepts in plain language. The format is intended to reduce confusion without pretending that one explanation fits every device, account, operating system or individual situation.',
  '/shows/innovation-today/':'Potential stories can examine how a technology moves from idea to prototype, how teams test it, what problem it attempts to solve and what users experience once it reaches the real world. Coverage should separate demonstrated capability from marketing claims and speculation.',
  '/shows/creator-spotlight/':'Potential episodes can explore creator workflows, audience development, production systems, monetization decisions and lessons from building independent projects. The format should focus on useful process and context rather than presenting promotional profiles without substance.',
  '/shows/a-smarter-tomorrow/':'Potential episodes can explore connected tools, automation, accessibility, smarter infrastructure and emerging digital systems. The editorial goal is to connect future-facing ideas to realistic human outcomes while clearly separating current capability from prediction.',
  '/distribute/':'Distribution conversations should begin only when the relevant programming, rights and technical requirements are understood. ATech Network can use this page as the entry point for future discussions about delivery formats, metadata, territories, promotional coordination and reporting without implying that any specific platform relationship already exists.',
  '/about/':'The network is designed to complement—not duplicate—the other ATechSpot properties. Technology services remain on the corporate site, while ATech Network provides a focused place for editorial concepts, creator-led programming and media partnerships. That separation helps users understand whether they are looking for a service provider, a program to watch or a media relationship.',
  '/contact/':'For the fastest review, include enough context for the network to understand the request without sending sensitive information. A clear message should identify the relevant programming area, the desired outcome and any important timing. Follow-up may be needed before ATech Network can determine whether the request fits the current development stage or requires a separate written agreement.',
  '/privacy/':'Reasonable safeguards should be used to protect information submitted through the site, but no internet transmission or storage method can be guaranteed completely secure. Users should limit submissions to information needed for the inquiry and should not send credentials, full payment-card details or unrelated sensitive personal information through general contact forms.',
  '/terms/':'ATech Network may update site content as programming concepts, policies and partnership models develop. Users should rely on the most current published version of a page and on any signed agreement governing a specific commercial relationship. Website content should not be treated as a substitute for the final terms of a sponsorship, distribution, production or licensing agreement.'
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

    // Keep only the primary ATech Network Organization entity. The parent brand
    // relationship remains visible in page copy without introducing a second
    // nested Organization that fails logo validation in SEO crawlers.
    html=html.replaceAll(',"parentOrganization":{"@type":"Organization","name":"ATechSpot","url":"https://www.atechspot.com/"}','');

    if(SHORT_TITLES[path]) html=html.replace(/<title>[^<]*<\/title>/i,`<title>${SHORT_TITLES[path]}</title>`).replace(/<meta property="og:title" content="[^"]*">/i,`<meta property="og:title" content="${SHORT_TITLES[path]}">`);

    if(BOOST[path]){
      const block=`<section class="sec"><div class="shell"><p class="ey">ADDITIONAL CONTEXT</p><p>${BOOST[path]}</p></div></section>`;
      html=html.replace('</main>',`${block}</main>`);
    }

    const headers=new Headers(response.headers);
    headers.set('content-type','text/html; charset=utf-8');
    return new Response(html,{status:response.status,statusText:response.statusText,headers});
  }
};
