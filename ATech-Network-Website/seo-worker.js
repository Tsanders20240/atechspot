import app from './worker.js';

const SITE='https://atechnetwork.atechspot.com';

const META={
  '/':{
    title:'ATech Network | Watch. Sponsor. Create. Distribute.',
    description:'ATech Network is a technology media property for programming concepts, creator stories, sponsorship opportunities and distribution partnerships.'
  },
  '/watch/':{
    title:'Watch Technology Shows & Network Previews | ATech Network',
    description:'Explore ATech Network technology programming concepts, show previews and creator-led media covering AI, drones, practical technology and innovation.'
  },
  '/shows/':{
    title:'Technology Shows & Programming Concepts | ATech Network',
    description:'Explore the ATech Network programming slate, including concepts focused on drones, practical AI, technology education, innovation and creator stories.'
  },
  '/sponsor/':{
    title:'Sponsor Technology Shows & Creator Media | ATech Network',
    description:'Explore ATech Network sponsorship opportunities for technology programming, creator-led media, useful brand integrations and custom content partnerships.'
  },
  '/creators/':{
    title:'Submit a Technology Show or Creator Series | ATech Network',
    description:'Pitch an original technology show, interview format, educational series, documentary concept or creator-led program to ATech Network for consideration.'
  },
  '/distribute/':{
    title:'Technology Content Distribution Partnerships | ATech Network',
    description:'Explore distribution partnerships with ATech Network for technology programming designed for web, mobile, social, streaming and connected-screen audiences.'
  },
  '/media-kit/':{
    title:'ATech Network Media Kit | Sponsorship & Distribution',
    description:'Review the ATech Network media kit for programming concepts, sponsorship inventory, creator opportunities, distribution strategy and partnership contacts.'
  },
  '/about/':{
    title:'About ATech Network | Technology Media & Creator Programming',
    description:'Learn about ATech Network, an ATechSpot media property focused on practical technology programming, creator stories, innovation and useful digital culture.'
  },
  '/contact/':{
    title:'Contact ATech Network | Media & Partnership Inquiries',
    description:'Contact ATech Network about sponsorship, creator submissions, programming concepts, media requests, distribution opportunities or general partnerships.'
  },
  '/privacy/':{
    title:'ATech Network Privacy Policy | ATechSpot Media',
    description:'Read how ATech Network handles information submitted through its website, uses analytics and supports inquiries across the ATechSpot media ecosystem.'
  },
  '/terms/':{
    title:'ATech Network Website Terms | ATechSpot Media',
    description:'Read the ATech Network website terms covering programming concepts, submissions, partnerships, site information and responsible use of the network website.'
  },
  '/shows/drones-and-beyond/':{
    title:'Drones & Beyond | Drone Technology Show Concept | ATech Network',
    description:'Explore Drones & Beyond, an ATech Network programming concept about aerial technology, creative flight, practical drone use and the world beyond the controller.'
  },
  '/shows/ai-in-real-life/':{
    title:'AI in Real Life | Practical AI Show Concept | ATech Network',
    description:'Explore AI in Real Life, an ATech Network show concept focused on practical artificial intelligence for work, creativity, small business and everyday life.'
  },
  '/shows/tech-made-simple/':{
    title:'Tech Made Simple | Technology How-To Show | ATech Network',
    description:'Explore Tech Made Simple, an ATech Network programming concept built around clear explanations of devices, apps, digital tools and everyday technology.'
  },
  '/shows/innovation-today/':{
    title:'Innovation Today | Technology Innovation Show | ATech Network',
    description:'Explore Innovation Today, an ATech Network programming concept about people, products and ideas moving technology from concept into real-world impact.'
  },
  '/shows/creator-spotlight/':{
    title:'Creator Spotlight | Technology Creator Stories | ATech Network',
    description:'Explore Creator Spotlight, an ATech Network show concept featuring independent creators building audiences, businesses, useful ideas and meaningful work.'
  },
  '/shows/a-smarter-tomorrow/':{
    title:'A Smarter Tomorrow | Future Technology Show | ATech Network',
    description:'Explore A Smarter Tomorrow, an ATech Network programming concept examining practical technologies shaping a more connected and capable future.'
  }
};

const SHOW_COPY={
  '/shows/drones-and-beyond/':['Drones & Beyond','drone technology, creative flight and practical aerial workflows','how drones fit into real creative, educational and business use without turning the concept into a product advertisement'],
  '/shows/ai-in-real-life/':['AI in Real Life','practical artificial intelligence in everyday work and life','useful examples, responsible adoption and understandable explanations instead of hype'],
  '/shows/tech-made-simple/':['Tech Made Simple','devices, apps and digital tools people use every day','clear explanations that help viewers understand what technology does, why it matters and how to use it more confidently'],
  '/shows/innovation-today/':['Innovation Today','technology ideas, products and people moving from concept to impact','the practical story behind innovation, including the problem being solved and what changes when an idea reaches real users'],
  '/shows/creator-spotlight/':['Creator Spotlight','independent creators building audiences, businesses and useful work','the systems, decisions, creative process and lessons behind creator-led projects rather than surface-level promotion'],
  '/shows/a-smarter-tomorrow/':['A Smarter Tomorrow','future-facing technology with practical relevance today','how connected tools, automation and new digital systems could improve everyday capability while keeping the human outcome at the center']
};

const EXTRA={
  '/watch/':`<section class="sec"><div class="shell"><p class="ey">HOW TO WATCH</p><h2>A focused home for technology programming.</h2><p>ATech Network is being built as a technology-first media property where viewers can discover programming concepts without sorting through unrelated entertainment. The Watch Center brings the launch slate together in one place so audiences can quickly understand the subject, format and purpose of each concept.</p><p>The initial slate covers practical artificial intelligence, drone technology, everyday devices, innovation, creator stories and future-facing technology. These pages describe concepts in development; they do not promise release dates, talent, audience size or third-party platform carriage. As finished programming is released, the Watch Center is designed to become the central viewing and discovery hub.</p><p>For brands, creators and distribution partners, this structure also makes the editorial context visible before a partnership conversation begins. Every concept is intended to have a clear audience need, a useful reason to exist and room to grow into repeatable programming rather than one-off promotional content.</p></div></section>`,
  '/shows/':`<section class="sec alt"><div class="shell"><p class="ey">EDITORIAL DIRECTION</p><h2>Programming built around usefulness and curiosity.</h2><p>The ATech Network launch slate is organized around six distinct technology themes. Each concept has its own editorial purpose, but the network standard is consistent: explain technology clearly, show how it affects real people and create programming that can remain useful after the initial release.</p><p>Drones & Beyond focuses on aerial technology and creative flight. AI in Real Life examines practical artificial intelligence. Tech Made Simple reduces friction around devices and digital tools. Innovation Today looks at ideas moving into real-world use. Creator Spotlight explores independent creative businesses. A Smarter Tomorrow examines technology shaping the future.</p><p>These are programming concepts in development, not claims of a completed broadcast schedule. Individual show pages explain the intended subject and positioning so viewers, sponsors, creators and distribution partners can understand where each concept fits within the network.</p></div></section>`,
  '/sponsor/':`<section class="sec alt"><div class="shell"><p class="ey">SPONSORSHIP PRINCIPLES</p><h2>Context first. Clear value. No invented audience claims.</h2><p>ATech Network sponsorship is designed around editorial fit rather than inflated reach numbers. A useful partnership starts by matching a brand with programming where its product, expertise or message is naturally relevant to the subject being discussed.</p><p>Potential formats include show sponsorship, supported segments, contextual product integration, educational collaboration and custom content development. Specific deliverables, placement, usage rights, production scope and pricing are defined in writing for each engagement. The site does not publish unverified audience totals or imply carriage on platforms where distribution has not been established.</p><p>Brands can begin by sharing the campaign goal, intended audience, timing and preferred type of involvement. That allows ATech Network to determine whether there is a genuine editorial match before proposing an activation. The objective is to build technology media that remains useful to viewers while giving sponsors a clear, credible role in the experience.</p></div></section>`,
  '/creators/':`<section class="sec"><div class="shell"><p class="ey">CREATOR SUBMISSIONS</p><h2>Pitch the idea, audience and reason the show should exist.</h2><p>ATech Network welcomes conversations with creators who have an original technology-focused concept and the right to share the material they submit. Strong pitches explain the audience problem, recurring format, host or creator perspective, episode possibilities and what makes the concept different from existing technology content.</p><p>Submissions may include interview formats, educational series, documentary ideas, creator-led programs, demonstrations or other media concepts connected to technology and digital culture. A submission is an invitation to review an idea; it does not create a production commitment, partnership, payment obligation or guarantee of distribution.</p><p>Creators should avoid sending confidential information or third-party material they do not control. If a concept appears aligned with the network, the next conversation can cover editorial development, production responsibilities, rights, potential monetization and distribution strategy. The goal is to build clear expectations before anyone invests significant time or resources.</p></div></section>`,
  '/distribute/':`<section class="sec alt"><div class="shell"><p class="ey">DISTRIBUTION STRATEGY</p><h2>Prepare programming to move across screens without overstating reach.</h2><p>ATech Network is structured so programming can be packaged for web, mobile, social platforms, streaming destinations and future connected-TV opportunities. The distribution page describes that strategy without claiming existing carriage on services where a formal relationship has not been established.</p><p>Potential distribution partners can use the network inquiry process to discuss content availability, technical delivery requirements, territory, rights, windowing, metadata, promotional support and reporting. The appropriate arrangement depends on the program, partner and stage of production.</p><p>For creators and sponsors, distribution planning begins with the audience and format rather than a list of platform logos. Short-form clips, full episodes, interviews, explainers and recurring series may require different release patterns. ATech Network is building the operational foundation to support those choices while keeping ownership, permissions and partner expectations explicit.</p></div></section>`,
  '/media-kit/':`<section class="sec"><div class="shell"><p class="ey">MEDIA KIT NOTES</p><h2>A practical starting point for partnership conversations.</h2><p>This media kit summarizes the ATech Network launch slate, sponsorship inventory, creator pathways and distribution direction. It intentionally avoids publishing invented audience numbers, guaranteed impressions or unconfirmed platform carriage.</p><p>Use it to identify the programming concept and partnership type that fit your objective, then contact the network for a scoped proposal covering deliverables, timing, rights and pricing. As verified audience and distribution data become available, future media-kit versions can incorporate those metrics with clear dates and sources.</p></div></section>`,
  '/about/':`<section class="sec"><div class="shell"><p class="ey">NETWORK PURPOSE</p><h2>Technology media designed to be understandable and useful.</h2><p>ATech Network is an ATechSpot media property created to develop programming around technology, creators, innovation and practical digital life. The network is intentionally separate from the ATechSpot corporate technology-services site so editorial programming can have its own audience, structure and partnership model.</p><p>The launch slate is organized around six programming concepts spanning drones, artificial intelligence, technology education, innovation, creator stories and future technology. The network is in an early development stage, so concept pages describe editorial direction rather than promising release schedules or third-party carriage.</p><p>The long-term goal is a credible media property where viewers know what they can watch, creators know how to pitch ideas, brands know how to explore sponsorship and distribution partners know how to begin a conversation. Clear disclosures and realistic claims are part of that standard.</p></div></section>`,
  '/contact/':`<section class="sec alt"><div class="shell"><p class="ey">BEFORE YOU SEND</p><h2>Choose the path that matches your inquiry.</h2><p>Use the network inquiry form for sponsorship, creator submissions, distribution discussions, media requests or general partnership questions. Including your organization, objective, timing and the relevant show or programming area helps route the conversation efficiently.</p><p>Creator submissions should describe original material you have the right to share. Sponsorship inquiries should explain the campaign goal and desired type of integration. Distribution inquiries should identify the platform or channel, territory and content interest when possible.</p><p>Submitting the form starts a conversation; it does not create a contract, production commitment, sponsorship agreement or guarantee of distribution. Any commercial arrangement is confirmed separately in writing after scope, rights, responsibilities and pricing are agreed.</p></div></section>`,
  '/privacy/':`<section class="sec alt"><div class="shell"><p class="ey">PRIVACY DETAILS</p><h2>Information is collected for a defined purpose.</h2><p>When you voluntarily submit an ATech Network form, the information you provide may be used to respond to your inquiry, evaluate a potential sponsorship, review a creator submission, discuss distribution or manage another requested business conversation. Do not submit passwords, payment-card data or confidential material that is not necessary for the inquiry.</p><p>The website also uses analytics to understand aggregate traffic and interaction patterns. Analytics data helps evaluate site performance and improve navigation, programming discovery and conversion paths. ATech Network is part of the broader ATechSpot ecosystem, and operational systems may be shared where appropriate to process inquiries and maintain the website.</p><p>Information practices may evolve as the network adds services or distribution capabilities. Material changes should be reflected in the published privacy information.</p></div></section>`,
  '/terms/':`<section class="sec"><div class="shell"><p class="ey">USE OF THIS SITE</p><h2>Concept pages describe direction, not guaranteed outcomes.</h2><p>ATech Network show pages, sponsorship materials and distribution information describe programming concepts and potential partnership models. They do not guarantee release dates, talent participation, audience size, revenue, platform carriage or commercial results.</p><p>Users may browse the site for personal or business evaluation and may submit inquiries through the provided forms. Do not misuse the forms, interfere with the service, attempt unauthorized access or submit material you do not have the right to share.</p><p>Creator submissions do not create confidentiality, employment, production, licensing or payment obligations unless a separate written agreement says otherwise. Sponsorship and distribution relationships likewise require a separate written agreement covering scope, rights, responsibilities, pricing and other applicable terms.</p></div></section>`
};

const LOGO=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#27d9ff"/><stop offset="1" stop-color="#087eff"/></linearGradient></defs><rect width="512" height="512" rx="92" fill="#020914"/><path d="M112 88 386 256 112 424Z" fill="url(#g)"/><path d="M178 174h62v51h51v62h-51v51h-62v-51h-51v-62h51z" fill="#fff"/></svg>`;

function normalizePath(path){
  if(path==='') return '/';
  if(path==='/' || path.endsWith('.') || path.startsWith('/api/') || path.startsWith('/art/')) return path;
  return path.endsWith('/')?path:path+'/';
}

function showExtra(path){
  const x=SHOW_COPY[path];
  if(!x) return '';
  return `<section class="sec alt"><div class="shell"><p class="ey">ABOUT THE CONCEPT</p><h2>${x[0]} is designed as a repeatable technology format.</h2><p>This ATech Network programming concept focuses on ${x[1]}. The editorial goal is ${x[2]}. Each future episode should have a clear question, a useful takeaway and enough context for viewers to understand why the subject matters.</p><p>The page describes a concept in development rather than a completed broadcast schedule. No release date, host, audience size or third-party distribution platform is guaranteed until those details are formally established. That distinction gives creators, sponsors and distribution partners a realistic picture of the network while the slate develops.</p><p>Potential episode development can include interviews, demonstrations, field reporting, explainers and creator-led stories when those formats support the subject. Partnership discussions should preserve editorial clarity and identify sponsorship, production or distribution responsibilities in writing before release.</p></div></section>`;
}

function patchHtml(html,path){
  const meta=META[path];
  if(meta){
    html=html.replace(/<title>[^<]*<\/title>/i,`<title>${meta.title}</title>`);
    html=html.replace(/<meta name="description" content="[^"]*">/i,`<meta name="description" content="${meta.description}">`);
    html=html.replace(/<meta property="og:title" content="[^"]*">/i,`<meta property="og:title" content="${meta.title}">`);
    html=html.replace(/<meta property="og:description" content="[^"]*">/i,`<meta property="og:description" content="${meta.description}">`);
  }
  html=html.replaceAll('"url":"https://atechnetwork.atechspot.com","parentOrganization"','"url":"https://atechnetwork.atechspot.com","logo":{"@type":"ImageObject","url":"https://atechnetwork.atechspot.com/favicon.svg","width":512,"height":512},"parentOrganization"');
  if(!html.includes('rel="icon"')) html=html.replace('</head>','<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/favicon.svg"></head>');
  const extra=EXTRA[path]||showExtra(path);
  if(extra && !html.includes('ABOUT THE CONCEPT') && !html.includes('HOW TO WATCH') && !html.includes('EDITORIAL DIRECTION') && !html.includes('SPONSORSHIP PRINCIPLES') && !html.includes('CREATOR SUBMISSIONS') && !html.includes('DISTRIBUTION STRATEGY') && !html.includes('MEDIA KIT NOTES') && !html.includes('NETWORK PURPOSE') && !html.includes('BEFORE YOU SEND') && !html.includes('PRIVACY DETAILS') && !html.includes('USE OF THIS SITE')) html=html.replace('</main>',`${extra}</main>`);
  return html;
}

export default {
  async fetch(request,env,ctx){
    const url=new URL(request.url);
    if(url.pathname==='/favicon.svg') return new Response(LOGO,{headers:{'content-type':'image/svg+xml; charset=utf-8','cache-control':'public,max-age=86400'}});
    const response=await app.fetch(request,env,ctx);
    const type=response.headers.get('content-type')||'';
    if(!type.includes('text/html')) return response;
    const path=normalizePath(url.pathname);
    const html=patchHtml(await response.text(),path);
    const headers=new Headers(response.headers);
    headers.set('content-type','text/html; charset=utf-8');
    headers.set('cache-control','public,max-age=0,must-revalidate');
    return new Response(html,{status:response.status,statusText:response.statusText,headers});
  }
};
