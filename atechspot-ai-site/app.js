(() => {
  const intro = document.getElementById('aiIntro');
  const site = document.getElementById('site');
  const skip = document.getElementById('skipIntro');
  const count = document.getElementById('introCount');
  const line = document.getElementById('introLine');
  const progress = document.getElementById('introProgress');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let endTimer, tickTimer, current = 10;

  const lines = [
    'Initializing AI Growth Intelligence…',
    'Mapping automation opportunities…',
    'Connecting the A+ Techucation ecosystem…',
    'Optimizing revenue pathways…',
    'Launching ATechSpot Growth OS…'
  ];

  function launchSite(){
    clearTimeout(endTimer); clearInterval(tickTimer);
    intro?.classList.add('is-leaving');
    site?.classList.remove('is-hidden');
    site?.classList.add('is-visible');
    setTimeout(() => intro?.remove(), 900);
    sessionStorage.setItem('atechspotIntroSeen','1');
  }

  if(reduce || sessionStorage.getItem('atechspotIntroSeen') === '1'){
    intro?.remove();
    site?.classList.remove('is-hidden');
    site?.classList.add('is-visible');
  } else {
    const start = performance.now();
    function animateProgress(now){
      const pct = Math.min(100, ((now-start)/10000)*100);
      if(progress) progress.style.width = pct + '%';
      if(pct < 100) requestAnimationFrame(animateProgress);
    }
    requestAnimationFrame(animateProgress);
    tickTimer = setInterval(() => {
      current--;
      if(count) count.textContent = String(Math.max(0,current));
      const elapsed = 10-current;
      const idx = Math.min(lines.length-1, Math.floor(elapsed/2));
      if(line) line.textContent = lines[idx];
    },1000);
    endTimer = setTimeout(launchSite,10000);
    skip?.addEventListener('click',launchSite);
  }

  // particle canvas
  const canvas = document.getElementById('introCanvas');
  if(canvas && !reduce){
    const ctx = canvas.getContext('2d'); let w,h,pts=[];
    const resize=()=>{w=canvas.width=innerWidth*devicePixelRatio;h=canvas.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);pts=Array.from({length:Math.min(90,Math.floor(innerWidth/14))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.28,vy:(Math.random()-.5)*.28,r:Math.random()*1.4+.3}))};
    resize(); addEventListener('resize',resize);
    const draw=()=>{if(!document.body.contains(canvas)) return;ctx.clearRect(0,0,innerWidth,innerHeight);for(const p of pts){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>innerWidth)p.vx*=-1;if(p.y<0||p.y>innerHeight)p.vy*=-1;ctx.beginPath();ctx.fillStyle='rgba(104,228,255,.65)';ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()}for(let i=0;i<pts.length;i++){for(let j=i+1;j<pts.length;j++){const a=pts[i],b=pts[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<120){ctx.strokeStyle=`rgba(56,232,255,${(1-d/120)*.08})`;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}}requestAnimationFrame(draw)};draw();
  }

  // reveal
  const obs = new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

  // mobile menu
  const menu = document.getElementById('menuToggle'), mobile = document.getElementById('mobileNav');
  menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));mobile.hidden=open});
  mobile?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobile.hidden=true;menu.setAttribute('aria-expanded','false')}));

  // ecosystem tabs
  document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>{
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');
    const f=tab.dataset.filter;document.querySelectorAll('.eco-card').forEach(card=>card.classList.toggle('hidden',f!=='all'&&card.dataset.group!==f));
  }));

  // assessment
  const qs=[...document.querySelectorAll('.question')], scores={revenue:0,automation:0,website:0,growth:0}; let q=0;
  const counter=document.getElementById('questionCounter'),questions=document.getElementById('assessmentQuestions'),result=document.getElementById('assessmentResult');
  qs.forEach((node,idx)=>node.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{
    scores[btn.dataset.value]++; node.classList.remove('active'); q++;
    if(q<qs.length){qs[q].classList.add('active');counter.textContent=`${q+1} / ${qs.length}`}
    else{questions.hidden=true;result.hidden=false;counter.textContent='COMPLETE';const winner=Object.entries(scores).sort((a,b)=>b[1]-a[1])[0][0];const map={
      revenue:['Revenue Growth','Your answers point to a growth and conversion opportunity. Start by clarifying the offer, customer journey, acquisition channels and the points where qualified visitors are being lost.'],
      automation:['AI & Automation','Your strongest opportunity is reducing repetitive work and connecting disconnected processes. Map the workflow first, then automate high-frequency tasks where the benefit is measurable.'],
      website:['Website & Conversion','Your website or funnel is the highest-priority opportunity. Focus on search intent, trust, clear calls to action, lead capture and a measurable path from visitor to customer.'],
      growth:['Growth Architecture','You need a connected system more than another isolated tool. Start with a business architecture that aligns revenue, technology, marketing, automation and measurement.']};
      document.getElementById('resultTitle').textContent=map[winner][0];document.getElementById('resultText').textContent=map[winner][1];
    }
  })));
  document.getElementById('restartAssessment')?.addEventListener('click',()=>{Object.keys(scores).forEach(k=>scores[k]=0);q=0;result.hidden=true;questions.hidden=false;qs.forEach((x,i)=>x.classList.toggle('active',i===0));counter.textContent='1 / 5'});
})();
