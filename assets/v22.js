(() => {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Cinematic intro: once per browser session, always skippable, never traps keyboard focus.
  const intro = document.querySelector('.v22-intro');
  if (intro) {
    const finish = () => {
      intro.classList.add('is-done');
      try { sessionStorage.setItem('atechspot-v22-intro-seen','1'); } catch {}
      setTimeout(() => intro.remove(), 800);
    };
    let seen = false;
    try { seen = sessionStorage.getItem('atechspot-v22-intro-seen') === '1'; } catch {}
    if (reduce || seen) finish();
    else setTimeout(finish, 3900);
    intro.querySelectorAll('[data-skip-intro]').forEach(btn => btn.addEventListener('click', finish));
    const onEscape = e => { if (e.key === 'Escape') finish(); };
    document.addEventListener('keydown', onEscape);
    intro.addEventListener('transitionend', () => document.removeEventListener('keydown', onEscape), { once:true });
  }

  // Guided service planner — inspired only by the general pattern of guided product finders.
  const planner = document.querySelector('[data-service-planner]');
  if (planner) {
    const plans = {
      growth: {
        title:'Business Growth System',
        body:'Start with a business technology audit, then connect your website, intake, booking, follow-up, analytics, and automation into one clearer customer journey.',
        service:'Business Technology',
        link:'/intake?service=Business%20Technology'
      },
      website: {
        title:'Website Experience Build',
        body:'Focus on a faster, clearer website with conversion-first messaging, mobile usability, forms, analytics, SEO foundations, and deployment support.',
        service:'Website Design',
        link:'/intake?service=Website%20Design'
      },
      automation: {
        title:'AI + Automation Workflow',
        body:'Map repetitive work, choose responsible AI tools, build repeatable prompts and workflows, and keep human review where it matters.',
        service:'AI Training',
        link:'/intake?service=AI%20Training'
      },
      learn: {
        title:'AI Confidence Session',
        body:'Learn AI step by step with practical examples, safer prompting, verification habits, and workflows you can actually reuse.',
        service:'AI Training',
        link:'/intake?service=AI%20Training'
      },
      support: {
        title:'Technology Support Route',
        body:'Start with intake so the device, platform, urgency, and desired outcome can be reviewed before the right remote or consultation path is recommended.',
        service:'Remote Technical Support',
        link:'/intake?service=Remote%20Technical%20Support'
      },
      access: {
        title:'Accessible Technology Plan',
        body:'Review accessibility needs, communication preferences, assistive technology, and digital barriers to create a practical support path.',
        service:'Accessibility Support',
        link:'/intake?service=Accessibility%20Support'
      }
    };
    const outTitle = planner.querySelector('[data-plan-title]');
    const outBody = planner.querySelector('[data-plan-body]');
    const outLink = planner.querySelector('[data-plan-link]');
    planner.querySelectorAll('[data-plan]').forEach(btn => {
      btn.addEventListener('click', () => {
        planner.querySelectorAll('[data-plan]').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const p = plans[btn.dataset.plan];
        if (!p) return;
        if (outTitle) outTitle.textContent = p.title;
        if (outBody) outBody.textContent = p.body;
        if (outLink) { outLink.href = p.link; outLink.textContent = `Start ${p.service} Intake`; }
        if (typeof window.gtag === 'function') window.gtag('event','service_planner_choice',{choice:btn.dataset.plan});
        if (typeof window.clarity === 'function') window.clarity('event','service_planner_choice');
      });
    });
  }

  // Mobile menu quality-of-life: close after selection.
  document.querySelectorAll('.menu a').forEach(a => a.addEventListener('click', () => {
    document.querySelector('.menu')?.classList.remove('open');
  }));

  // Floating contact appears after the hero, not on top of it.
  const floater = document.querySelector('.v22-float-contact');
  const hero = document.querySelector('.v22-hero');
  if (floater && hero && 'IntersectionObserver' in window) {
    floater.style.opacity = '0'; floater.style.pointerEvents = 'none';
    const io = new IntersectionObserver(([entry]) => {
      floater.style.opacity = entry.isIntersecting ? '0' : '1';
      floater.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
    }, { threshold:.1 });
    io.observe(hero);
  }
})();
