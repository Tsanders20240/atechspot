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

  /* Founder portrait: load the production portrait directly. */
  const founderImg=document.querySelector('.founder-photo-card img');
  if(founderImg){
    founderImg.src='/assets/atechspot-founder-ceo.webp?v=20260910-8';
    founderImg.removeAttribute('srcset');
    founderImg.loading='eager';
    founderImg.decoding='async';
    founderImg.style.opacity='1';
  }

  /* Exact legacy ATechSpot logo: enlarged and near-white background removed in-browser. */
  const logoStyle=document.createElement('style');
  logoStyle.textContent=`
    .site-header{min-height:94px}
    .site-header .brand,.footer-brand{background:none!important;filter:none!important;width:320px!important;height:82px!important;flex:0 0 320px!important;display:flex!important;align-items:center!important;overflow:visible!important}
    .brand .brand-mark,.brand .brand-name{display:none!important}
    .brand-logo-clean{display:block;width:320px;height:82px;object-fit:contain;object-position:left center;filter:drop-shadow(0 0 16px rgba(76,179,255,.22));opacity:1}
    .footer-brand{width:340px!important;height:92px!important;flex-basis:340px!important}
    .footer-brand .brand-logo-clean{width:340px;height:92px}
    @media(max-width:1020px){.site-header .brand{width:255px!important;height:72px!important;flex-basis:255px!important}.brand-logo-clean{width:255px;height:72px}}
    @media(max-width:650px){.site-header{min-height:78px}.site-header .brand{width:225px!important;height:64px!important;flex-basis:225px!important}.brand-logo-clean{width:225px;height:64px}.footer-brand{width:240px!important;height:72px!important;flex-basis:240px!important}.footer-brand .brand-logo-clean{width:240px;height:72px}}
  `;
  document.head.appendChild(logoStyle);

  const processLogo=()=>{
    const source=new Image();
    source.decoding='async';
    source.src='/assets/atechspot-logo.png?v=20260910-8';
    source.onload=()=>{
      try{
        const canvas=document.createElement('canvas');
        const max=1400;
        const scale=Math.min(1,max/source.naturalWidth,max/source.naturalHeight);
        canvas.width=Math.max(1,Math.round(source.naturalWidth*scale));
        canvas.height=Math.max(1,Math.round(source.naturalHeight*scale));
        const ctx=canvas.getContext('2d',{willReadFrequently:true});
        ctx.drawImage(source,0,0,canvas.width,canvas.height);
        const image=ctx.getImageData(0,0,canvas.width,canvas.height);
        const d=image.data;
        let minX=canvas.width,minY=canvas.height,maxX=-1,maxY=-1;
        for(let y=0;y<canvas.height;y++){
          for(let x=0;x<canvas.width;x++){
            const i=(y*canvas.width+x)*4;
            const r=d[i],g=d[i+1],b=d[i+2];
            const low=Math.min(r,g,b);
            if(r>242&&g>242&&b>242){d[i+3]=0;continue;}
            if(r>218&&g>218&&b>218){d[i+3]=Math.max(0,Math.round((242-low)/24*255));}
            if(d[i+3]>12){if(x<minX)minX=x;if(y<minY)minY=y;if(x>maxX)maxX=x;if(y>maxY)maxY=y;}
          }
        }
        ctx.putImageData(image,0,0);
        if(maxX<minX||maxY<minY) throw new Error('Logo bounds unavailable');
        const pad=Math.max(8,Math.round(Math.max(maxX-minX,maxY-minY)*.025));
        minX=Math.max(0,minX-pad);minY=Math.max(0,minY-pad);maxX=Math.min(canvas.width-1,maxX+pad);maxY=Math.min(canvas.height-1,maxY+pad);
        const out=document.createElement('canvas');
        out.width=maxX-minX+1;out.height=maxY-minY+1;
        out.getContext('2d').drawImage(canvas,minX,minY,out.width,out.height,0,0,out.width,out.height);
        const transparentLogo=out.toDataURL('image/png');
        document.querySelectorAll('.brand').forEach(brand=>{
          let img=brand.querySelector('.brand-logo-clean');
          if(!img){img=document.createElement('img');img.className='brand-logo-clean';img.alt='ATechSpot';brand.prepend(img);}
          img.src=transparentLogo;
        });
      }catch(err){
        document.querySelectorAll('.brand').forEach(brand=>{
          let img=brand.querySelector('.brand-logo-clean');
          if(!img){img=document.createElement('img');img.className='brand-logo-clean';img.alt='ATechSpot';brand.prepend(img);}
          img.src='/assets/atechspot-logo.png?v=20260910-8';
        });
      }
    };
  };
  processLogo();
})();