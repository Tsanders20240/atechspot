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
})();