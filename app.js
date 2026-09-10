(() => {
  const intro = document.getElementById('microIntro');
  const seen = sessionStorage.getItem('atechspotIntroSeen');
  if (seen) intro?.classList.add('done');
  else {
    setTimeout(()=>{intro?.classList.add('done');sessionStorage.setItem('atechspotIntroSeen','1')},1050);
  }

  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  menuBtn?.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded',String(open));
  });
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuBtn?.setAttribute('aria-expanded','false')}));

  const io = new IntersectionObserver(entries=>entries.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}
  }),{threshold:.08});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  const nodeLabel=document.getElementById('activeNode');
  document.querySelectorAll('.node-stack button').forEach(btn=>{
    btn.addEventListener('mouseenter',()=>{
      document.querySelectorAll('.node-stack button').forEach(x=>x.classList.remove('active'));
      btn.classList.add('active');
      if(nodeLabel) nodeLabel.textContent=btn.dataset.node.toUpperCase()+' ACTIVE';
    });
    btn.addEventListener('focus',()=>btn.dispatchEvent(new Event('mouseenter')));
  });

  const routeResult=document.getElementById('routeResult');
  const routes={
    website:'Recommended starting point: Website & Conversion Architecture — audit the message, search intent, customer path and conversion friction before rebuilding.',
    automation:'Recommended starting point: Automation Opportunity Map — identify repetitive work, trigger points, handoffs and tasks that can be safely automated.',
    systems:'Recommended starting point: Business Systems Architecture — map the current tools, data flow, ownership and integration gaps before adding new software.',
    app:'Recommended starting point: App Discovery — define the user, problem, workflow, must-have functionality and success metric before development.',
    ai:'Recommended starting point: AI Readiness Review — prioritize practical AI use cases around measurable business value, approved data and human oversight.',
    ecommerce:'Recommended starting point: Ecommerce Revenue Review — inspect product discovery, merchandising, trust, checkout friction, follow-up and retention.'
  };
  document.querySelectorAll('.problem-card').forEach(card=>card.addEventListener('click',()=>{
    routeResult.textContent=routes[card.dataset.route];
    routeResult.classList.add('show');
    routeResult.scrollIntoView({behavior:'smooth',block:'nearest'});
    if(window.gtag) gtag('event','assessment_route_selected',{route:card.dataset.route});
  }));

  const canvas=document.getElementById('networkCanvas');
  if(canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    const ctx=canvas.getContext('2d'); let w=0,h=0,dpr=1,pts=[];
    const resize=()=>{
      dpr=Math.min(devicePixelRatio||1,2);w=canvas.clientWidth;h=canvas.clientHeight;
      canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
      pts=Array.from({length:Math.min(58,Math.max(28,Math.floor(w/24)))},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18}));
    };
    const draw=()=>{
      ctx.clearRect(0,0,w,h);
      for(const p of pts){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1}
      for(let i=0;i<pts.length;i++){
        const a=pts[i];ctx.beginPath();ctx.fillStyle='rgba(90,193,255,.28)';ctx.arc(a.x,a.y,1.1,0,Math.PI*2);ctx.fill();
        for(let j=i+1;j<pts.length;j++){const b=pts[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);if(d<125){ctx.beginPath();ctx.strokeStyle=`rgba(82,189,255,${(1-d/125)*.08})`;ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}
      }
      requestAnimationFrame(draw);
    };
    resize();addEventListener('resize',resize);draw();
  }

  /* Founder portrait: bypass the SVG wrapper so the production card loads the real web image directly. */
  const founderImg=document.querySelector('.founder-photo-card img');
  if(founderImg){
    founderImg.src='/assets/atechspot-founder-ceo.webp?v=20260910-5';
    founderImg.removeAttribute('srcset');
    founderImg.loading='eager';
    founderImg.decoding='async';
  }

  /* ATechSpot brand polish: use the previous ATechSpot logo, larger, with its white canvas keyed out on the dark Command Center background. */
  document.body.insertAdjacentHTML('afterbegin', `<svg width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute"><defs><filter id="atechLogoWhiteToAlpha" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -1 -1 -1 3 0"/></filter></defs></svg>`);
  const logoStyle=document.createElement('style');
  logoStyle.textContent=`
    .site-header .brand,.footer-brand{background-image:none!important;display:flex!important;align-items:center!important;width:245px!important;height:78px!important;overflow:visible!important;flex:0 0 245px!important}
    .brand-logo-clean{display:block;width:auto;height:82px;max-width:245px;object-fit:contain;object-position:left center;filter:url(#atechLogoWhiteToAlpha) saturate(1.2) brightness(1.25) drop-shadow(0 0 15px rgba(76,179,255,.26));transform:scale(1.18);transform-origin:left center}
    .footer-brand .brand-logo-clean{height:88px;filter:url(#atechLogoWhiteToAlpha) saturate(1.15) brightness(1.28) drop-shadow(0 0 13px rgba(76,179,255,.20))}
    @media(max-width:650px){.site-header .brand{width:195px!important;flex-basis:195px!important}.brand-logo-clean{height:70px;max-width:195px;transform:scale(1.10)}.footer-brand .brand-logo-clean{height:74px}}
  `;
  document.head.appendChild(logoStyle);
  document.querySelectorAll('.brand').forEach(brand=>{
    if(brand.querySelector('.brand-logo-clean')) return;
    const img=document.createElement('img');
    img.className='brand-logo-clean';
    img.src='/assets/atechspot-logo.png?v=20260910-5';
    img.alt='ATechSpot';
    img.decoding='async';
    brand.prepend(img);
  });
})();