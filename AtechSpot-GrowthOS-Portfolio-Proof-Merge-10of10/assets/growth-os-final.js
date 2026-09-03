(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const intro = $('#intro');
  const introBrand = $('#introBrand');
  const navBrand = $('#navBrand');
  const replayIntro = $('#replayIntro');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function playIntro() {
    if (reducedMotion || !intro || !introBrand || !navBrand) return;
    intro.classList.remove('done');
    introBrand.style.transition = 'none';
    introBrand.style.transform = 'translate3d(0,0,0) scale(1)';
    introBrand.style.opacity = '1';
    navBrand.style.opacity = '0';

    requestAnimationFrame(() => {
      const from = introBrand.getBoundingClientRect();
      const to = navBrand.getBoundingClientRect();
      const dx = to.left - from.left;
      const dy = to.top - from.top;
      const scale = Math.max(.2, to.height / from.height);
      setTimeout(() => {
        introBrand.style.transition = 'transform 1.05s cubic-bezier(.2,.8,.2,1), opacity .35s ease .8s';
        introBrand.style.transform = `translate3d(${dx}px,${dy}px,0) scale(${scale})`;
        setTimeout(() => {
          navBrand.style.transition = 'opacity .3s ease';
          navBrand.style.opacity = '1';
          intro.classList.add('done');
        }, 950);
      }, 1150);
    });
  }

  window.addEventListener('load', () => {
    let seen = false;
    try { seen = sessionStorage.getItem('atechspot-growth-os-intro-seen') === '1'; } catch (_) {}
    if (!reducedMotion && !seen) {
      playIntro();
      try { sessionStorage.setItem('atechspot-growth-os-intro-seen','1'); } catch (_) {}
    } else {
      if (intro) intro.classList.add('done');
      if (navBrand) navBrand.style.opacity = '1';
    }
  });
  replayIntro?.addEventListener('click', playIntro);

  const header = $('#siteHeader');
  window.addEventListener('scroll', () => header?.classList.toggle('scrolled', scrollY > 20), {passive:true});

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:.12});
  $$('.reveal').forEach(el => revealObserver.observe(el));

  const stageData = {
    discover: {
      kicker:'DISCOVER',
      title:'Understand the business before prescribing technology.',
      text:'We start with your company, customers, goals, offers, systems and current revenue path. The purpose is clarity—not selling you something you do not need.',
      link:'#assessment', label:'Start the assessment →'
    },
    diagnose: {
      kicker:'DIAGNOSE',
      title:'Find what may be costing time, customers or revenue.',
      text:'We look for friction across your brand, website, search visibility, lead flow, sales follow-up, automation, ecommerce, operations and technology stack.',
      link:'#review', label:'See the Executive Review →'
    },
    design: {
      kicker:'DESIGN',
      title:'Create the right customer-facing experience and growth plan.',
      text:'When the diagnosis supports it, A+ Techucation can refine positioning, branding, websites, funnels and the customer journey around measurable business goals.',
      link:'#services', label:'Explore transformation divisions →'
    },
    automate: {
      kicker:'AUTOMATE',
      title:'Make repetitive work run smarter—with human accountability.',
      text:'CRM, intake, scheduling, follow-up, email workflows, AI assistance and internal processes can be connected so valuable work is less dependent on manual repetition.',
      link:'#services', label:'Explore A+ Automation →'
    },
    grow: {
      kicker:'GROW',
      title:'Build recurring systems instead of one-time fixes.',
      text:'The long-term goal is a stronger revenue engine: better acquisition, better conversion, stronger retention, scalable technology and recurring optimization through GrowthCare.',
      link:'#contact', label:'Build the next phase →'
    }
  };
  $$('.growth-stage').forEach(btn => btn.addEventListener('click', () => {
    $$('.growth-stage').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const d = stageData[btn.dataset.stage];
    $('#stageKicker').textContent = d.kicker;
    $('#stageTitle').textContent = d.title;
    $('#stageText').textContent = d.text;
    $('#stageLink').href = d.link;
    $('#stageLink').textContent = d.label;
  }));

  const nodeCopy = {
    Brand:'Identity, positioning and consistency shape how customers value the business before they ever speak with you.',
    Website:'Your website should create a clear path from attention to trust to action—not function as a digital brochure alone.',
    SEO:'Search structure helps the right customers discover the company when they are actively looking for a solution.',
    Sales:'Lead qualification, proposals, follow-up and pipeline visibility determine how efficiently interest becomes revenue.',
    Marketing:'Content, campaigns, retargeting and channel strategy should support a measurable customer-acquisition system.',
    AI:'AI can improve research, content, support and workflows when it is connected to clear human review and business rules.',
    Automation:'Automation should remove repetitive work, reduce missed follow-up and improve consistency across the customer journey.',
    Commerce:'Storefront, product pages, checkout, retention and marketplace workflows should operate as one conversion system.',
    Software:'Custom software can become appropriate when off-the-shelf tools no longer fit the process or growth model.',
    Revenue:'Pricing, packaging, recurring revenue, upsells and retention influence how much value the business captures over time.',
    Operations:'Processes, SOPs, technology ownership and team handoffs determine whether growth creates leverage or chaos.',
    Analytics:'Analytics turns activity into decisions by showing where customers come from, what converts and where friction remains.'
  };
  $$('.system-node').forEach(node => node.addEventListener('click', () => {
    $$('.system-node').forEach(n => n.classList.remove('selected'));
    node.classList.add('selected');
    $('#nodeCaption').textContent = nodeCopy[node.dataset.node];
  }));

  const reviewStarted = $('#reviewFormStartedAt');
  if (reviewStarted) reviewStarted.value = String(Date.now());

  const form = $('#assessmentForm');
  const questions = $$('.question', form);
  let qIndex = 0;
  const updateQuestionUI = () => {
    questions.forEach((q,i) => q.classList.toggle('active', i === qIndex));
    const pct = Math.round(((qIndex + 1) / questions.length) * 100);
    $('#questionCount').textContent = `Question ${qIndex + 1} of ${questions.length}`;
    $('#progressPercent').textContent = `${pct}%`;
    $('#progressBar').style.width = `${pct}%`;
    $('#prevQuestion').disabled = qIndex === 0;
    $('#nextQuestion').textContent = qIndex === questions.length - 1 ? 'Reveal Opportunity Preview →' : 'Continue →';
  };
  const selectedValue = (name) => form.elements[name]?.value || '';
  $('#nextQuestion')?.addEventListener('click', () => {
    const current = questions[qIndex];
    const checked = $('input[type="radio"]:checked', current);
    if (!checked) {
      current.animate([{transform:'translateX(0)'},{transform:'translateX(-5px)'},{transform:'translateX(5px)'},{transform:'translateX(0)'}], {duration:260});
      return;
    }
    if (qIndex < questions.length - 1) { qIndex++; updateQuestionUI(); return; }

    const values = Object.fromEntries(new FormData(form).entries());
    let reviewAreas = 4;
    let growth = 2;
    let automation = 0;
    if (['Rarely','No website'].includes(values.website)) { reviewAreas++; growth++; }
    if (['Weak','Unknown'].includes(values.search)) { reviewAreas++; growth++; }
    if (['Manual','Inconsistent','No system'].includes(values.followup)) { reviewAreas++; automation++; }
    if (['High','Unknown'].includes(values.automation)) { reviewAreas++; automation++; }
    if (['Needs refinement','Needs redesign','Unsure'].includes(values.brand)) reviewAreas++;
    if (['Mostly one-time','None'].includes(values.revenue)) growth++;

    $('#reviewAreas').textContent = Math.min(reviewAreas, 12);
    $('#growthOpps').textContent = Math.min(growth, 6);
    $('#automationOpps').textContent = Math.max(1, Math.min(automation, 4));
    form.hidden = true;
    $('.assessment-top').hidden = true;
    $('.progress').hidden = true;
    $('#opportunityPreview').hidden = false;
    $('#opportunityPreview').scrollIntoView({behavior:'smooth', block:'nearest'});
  });
  $('#prevQuestion')?.addEventListener('click', () => { if(qIndex>0){qIndex--;updateQuestionUI();} });
  updateQuestionUI();

  document.querySelectorAll('a.button, button.button').forEach(el => el.addEventListener('click', () => {
    const label = (el.textContent || '').trim().slice(0,80);
    if (typeof window.gtag === 'function') window.gtag('event','growth_os_cta',{cta_label:label});
    if (typeof window.clarity === 'function') window.clarity('event','growth_os_cta');
  }));

  const modal = $('#reviewModal');
  const openModal = () => { modal.hidden = false; document.body.style.overflow='hidden'; setTimeout(() => $('input', modal)?.focus(), 50); };
  const closeModal = () => { modal.hidden = true; document.body.style.overflow=''; };
  $('#openReviewRequest')?.addEventListener('click', openModal);
  $$('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', e => { if(e.key==='Escape' && !modal.hidden) closeModal(); });

  function buildReviewEmailFallback(data, assessment) {
    const lines = [
      'EXECUTIVE GROWTH REVIEW REQUEST — $997',
      '',
      'CLIENT',
      `Name: ${data['Full Name'] || ''}`,
      `Business: ${data['Business Name'] || ''}`,
      `Email: ${data['Email'] || ''}`,
      `Phone: ${data['Phone'] || ''}`,
      `Website: ${data['Business Website'] || ''}`,
      `Team size: ${data['Team Size'] || ''}`,
      `Investment readiness: ${data['Investment Readiness'] || ''}`,
      '',
      'BIGGEST GROWTH CHALLENGE',
      data['Biggest Growth Challenge'] || '',
      '',
      'BUSINESS GROWTH ASSESSMENT',
      ...Object.entries(assessment).map(([k,v]) => `${k}: ${v}`),
      '',
      'REQUEST',
      'Please send secure payment instructions for the $997 A+ Executive Growth Review. I understand detailed analysis begins after payment confirmation.'
    ];
    const subject = encodeURIComponent(`EXECUTIVE GROWTH REVIEW REQUEST — ${data['Business Name'] || data['Full Name'] || 'New Client'} — $997`);
    return `mailto:aplustechucation@gmail.com?subject=${subject}&body=${encodeURIComponent(lines.join('\n'))}`;
  }

  $('#reviewRequestForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const reviewForm = e.currentTarget;
    if (!reviewForm.reportValidity()) return;

    const status = $('#reviewFormStatus');
    const submit = reviewForm.querySelector('button[type="submit"]');
    const raw = Object.fromEntries(new FormData(reviewForm).entries());
    const assessment = form ? Object.fromEntries(new FormData(form).entries()) : {};

    if (String(raw.website || '').trim()) return; // honeypot

    const payload = {
      ...raw,
      'Request Type': 'A+ Executive Growth Review — $997',
      'Assessment - Primary Goal': assessment.goal || 'Not completed',
      'Assessment - Website': assessment.website || 'Not completed',
      'Assessment - Search Visibility': assessment.search || 'Not completed',
      'Assessment - Lead Follow-Up': assessment.followup || 'Not completed',
      'Assessment - Automation': assessment.automation || 'Not completed',
      'Assessment - Brand': assessment.brand || 'Not completed',
      'Assessment - Recurring Revenue': assessment.revenue || 'Not completed',
      'Assessment - Priority': assessment.priority || 'Not completed',
      'Page URL': window.location.href,
      'Site Version': 'Growth OS FINAL 10/10',
      'Attribution': (() => { try { return sessionStorage.getItem('aplus_attribution') || ''; } catch (_) { return ''; } })()
    };
    delete payload.website;

    if (status) {
      status.className = 'form-status';
      status.textContent = 'Sending your Executive Review request securely…';
    }
    if (submit) submit.disabled = true;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {'content-type':'application/json'},
        body: JSON.stringify(payload)
      });
      let result = {};
      try { result = await response.json(); } catch (_) {}
      if (!response.ok) throw new Error(result.message || `Secure delivery failed (${response.status}).`);

      if (typeof window.gtag === 'function') window.gtag('event','executive_review_request',{value:997,currency:'USD'});
      if (typeof window.clarity === 'function') window.clarity('event','executive_review_request');

      reviewForm.hidden = true;
      $('#submissionSuccess').hidden = false;
      if (status) {
        status.className = 'form-status is-success';
        status.textContent = result.message || 'Request sent successfully.';
      }
    } catch (error) {
      const fallback = buildReviewEmailFallback(raw, assessment);
      if (status) {
        status.className = 'form-status is-error';
        status.innerHTML = `${error.message} <a href="${fallback}">Open the prefilled email backup</a>.`;
      }
    } finally {
      if (submit) submit.disabled = false;
    }
  });

  // Revenue V2 attribution + offer analytics
  const params = new URLSearchParams(window.location.search);
  const attribution = {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    referrer: document.referrer || ''
  };
  try {
    const existing = JSON.parse(sessionStorage.getItem('aplus_attribution') || '{}');
    sessionStorage.setItem('aplus_attribution', JSON.stringify({...existing, ...Object.fromEntries(Object.entries(attribution).filter(([,v])=>v))}));
  } catch (_) {}

  $$('[data-offer]').forEach(el => el.addEventListener('click', () => {
    const offer = el.dataset.offer || 'unknown';
    if (typeof window.gtag === 'function') window.gtag('event','revenue_offer_click',{offer});
    if (typeof window.clarity === 'function') window.clarity('event',`revenue_offer_${offer}`);
  }));



  // FINAL mobile navigation + footer year
  const mobileMenu = $('#mobileMenu');
  const mobileMenuToggle = $('#mobileMenuToggle');
  let mobileMenuReturnFocus = null;
  const openMobileMenu = () => {
    if (!mobileMenu || !mobileMenuToggle) return;
    mobileMenuReturnFocus = document.activeElement;
    mobileMenu.hidden = false;
    document.body.classList.add('mobile-menu-open');
    mobileMenuToggle.setAttribute('aria-expanded','true');
    mobileMenuToggle.setAttribute('aria-label','Close navigation');
    setTimeout(() => $('.mobile-menu-panel a', mobileMenu)?.focus(), 20);
  };
  const closeMobileMenu = () => {
    if (!mobileMenu || !mobileMenuToggle) return;
    mobileMenu.hidden = true;
    document.body.classList.remove('mobile-menu-open');
    mobileMenuToggle.setAttribute('aria-expanded','false');
    mobileMenuToggle.setAttribute('aria-label','Open navigation');
    if (mobileMenuReturnFocus && typeof mobileMenuReturnFocus.focus === 'function') mobileMenuReturnFocus.focus();
  };
  mobileMenuToggle?.addEventListener('click', () => mobileMenu.hidden ? openMobileMenu() : closeMobileMenu());
  $$('[data-close-mobile-menu]').forEach(el => el.addEventListener('click', closeMobileMenu));
  $$('.mobile-menu-panel a').forEach(a => a.addEventListener('click', closeMobileMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && mobileMenu && !mobileMenu.hidden) closeMobileMenu(); });
  const currentYear = $('#currentYear');
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());



  // Portfolio proof analytics: measure which live examples prospects inspect.
  document.querySelectorAll('[data-proof]').forEach(link => {
    link.addEventListener('click', () => {
      const project = (link.getAttribute('data-proof') || link.textContent || '').trim().slice(0,100);
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'portfolio_proof_click', {
          project_name: project,
          destination: link.href
        });
      }
      if (typeof window.clarity === 'function') {
        window.clarity('event', 'portfolio_proof_click');
      }
    });
  });

})();
