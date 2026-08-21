(() => {
  const intro = document.querySelector('.v23-intro');
  if (intro) {
    const finish = () => {
      intro.classList.add('is-done');
      try { sessionStorage.setItem('atechspot-v24-intro-seen','1'); } catch {}
      setTimeout(() => intro.remove(), 750);
    };
    let seen = false;
    try { seen = sessionStorage.getItem('atechspot-v24-intro-seen') === '1'; } catch {}
    if (seen) finish();
    intro.querySelectorAll('[data-enter-site]').forEach(btn => btn.addEventListener('click', finish));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') finish(); }, { once:false });
  }

  const guide = document.querySelector('[data-v23-guide]');
  if (guide) {
    const data = {
      growth:{title:'Business Technology Audit',copy:'Map your website, lead capture, booking, follow-up, analytics, and automation before deciding what should be improved first.',link:'/business-audit.html',label:'Open Business Technology Audit →'},
      website:{title:'Website Development',copy:'Start with your goals, audience, content, conversion path, mobile experience, forms, SEO foundations, analytics, and deployment.',link:'/website-development.html',label:'Explore Website Development →'},
      automation:{title:'AI + Automation Planning',copy:'Identify repetitive work, choose responsible AI tools, design repeatable workflows, and keep human review where it matters.',link:'/ai-readiness.html',label:'Check AI Readiness →'},
      learn:{title:'AI Training',copy:'Build confidence with practical prompting, verification habits, responsible AI use, and repeatable workflows you can reuse.',link:'/ai-training.html',label:'Explore AI Training →'},
      support:{title:'Remote Technology Support',copy:'Start with the device, platform, urgency, and desired outcome so the right support path can be recommended.',link:'/remote-support.html',label:'Get Technology Support →'},
      access:{title:'Accessibility Support',copy:'Review accessibility needs, communication preferences, assistive technology, and digital barriers to create a practical support route.',link:'/accessibility',label:'Explore Accessibility →'}
    };
    const title = guide.querySelector('[data-guide-title]');
    const copy = guide.querySelector('[data-guide-copy]');
    const link = guide.querySelector('[data-guide-link]');
    guide.querySelectorAll('[data-guide]').forEach(btn => btn.addEventListener('click', () => {
      guide.querySelectorAll('[data-guide]').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const d = data[btn.dataset.guide]; if (!d) return;
      title.textContent = d.title; copy.textContent = d.copy; link.href = d.link; link.textContent = d.label;
      if (typeof window.gtag === 'function') window.gtag('event','v24_guide_choice',{choice:btn.dataset.guide});
      if (typeof window.clarity === 'function') window.clarity('event','v24_guide_choice');
    }));
  }

  const floater = document.querySelector('.v23-float');
  const hero = document.querySelector('.v23-hero');
  if (floater && hero && 'IntersectionObserver' in window) {
    floater.style.opacity='0'; floater.style.pointerEvents='none';
    new IntersectionObserver(([entry]) => {
      floater.style.opacity = entry.isIntersecting ? '0' : '1';
      floater.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
    },{threshold:.08}).observe(hero);
  }
})();


(() => {
  // Keep the public experience on the canonical non-WWW hostname when this bundle is deployed there.
  if (location.hostname === 'www.atechspot.com') {
    const next = 'https://atechspot.com' + location.pathname + location.search + location.hash;
    location.replace(next);
  }
  // Improve guide semantics for assistive technology.
  const guide = document.querySelector('[data-v23-guide]');
  if (guide) {
    const buttons = [...guide.querySelectorAll('[data-guide]')];
    buttons.forEach((b,i) => {
      b.setAttribute('role','tab');
      b.setAttribute('aria-selected', b.classList.contains('is-active') ? 'true' : 'false');
      b.tabIndex = b.classList.contains('is-active') ? 0 : -1;
      b.addEventListener('click', () => buttons.forEach(x => {
        const active = x === b;
        x.setAttribute('aria-selected', active ? 'true' : 'false');
        x.tabIndex = active ? 0 : -1;
      }));
      b.addEventListener('keydown', e => {
        if (!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) return;
        e.preventDefault();
        let n=i;
        if(e.key==='ArrowLeft') n=(i-1+buttons.length)%buttons.length;
        if(e.key==='ArrowRight') n=(i+1)%buttons.length;
        if(e.key==='Home') n=0;
        if(e.key==='End') n=buttons.length-1;
        buttons[n].focus(); buttons[n].click();
      });
    });
  }
})();
