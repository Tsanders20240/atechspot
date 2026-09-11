(() => {
  const intro = document.getElementById('microIntro');
  const seen = sessionStorage.getItem('atechspotIntroSeen');
  if (seen) intro?.classList.add('done');
  else setTimeout(() => {
    intro?.classList.add('done');
    sessionStorage.setItem('atechspotIntroSeen', '1');
  }, 1050);

  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  menuBtn?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
  }));

  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  }), { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  const nodeLabel = document.getElementById('activeNode');
  document.querySelectorAll('.node-stack button').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      document.querySelectorAll('.node-stack button').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      if (nodeLabel) nodeLabel.textContent = btn.dataset.node.toUpperCase() + ' ACTIVE';
    });
    btn.addEventListener('focus', () => btn.dispatchEvent(new Event('mouseenter')));
  });

  const routeResult = document.getElementById('routeResult');
  const routes = {
    website: {
      text: 'Recommended starting point: Website & Conversion Architecture — audit the message, search intent, customer path and conversion friction before rebuilding.',
      topic: 'Website, Funnel or Conversion System'
    },
    automation: {
      text: 'Recommended starting point: Automation Opportunity Map — identify repetitive work, trigger points, handoffs and tasks that can be safely automated.',
      topic: 'Business Automation'
    },
    systems: {
      text: 'Recommended starting point: Business Systems Architecture — map the current tools, data flow, ownership and integration gaps before adding new software.',
      topic: 'Not sure — diagnose the problem first'
    },
    app: {
      text: 'Recommended starting point: App Discovery — define the user, problem, workflow, must-have functionality and success metric before development.',
      topic: 'Business App or Internal Tool'
    },
    ai: {
      text: 'Recommended starting point: AI Readiness Review — prioritize practical AI use cases around measurable business value, approved data and human oversight.',
      topic: 'AI Strategy & Implementation'
    },
    ecommerce: {
      text: 'Recommended starting point: Ecommerce Revenue Review — inspect product discovery, merchandising, trust, checkout friction, follow-up and retention.',
      topic: 'Ecommerce Growth System'
    }
  };
  document.querySelectorAll('.problem-card').forEach(card => card.addEventListener('click', () => {
    if (!routeResult) return;
    const recommendation = routes[card.dataset.route];
    if (!recommendation) return;
    const intakeUrl = `/intake/?topic=${encodeURIComponent(recommendation.topic)}#project-intake`;
    routeResult.innerHTML = `<div class="route-copy"><strong>Your recommended starting point</strong><span>${recommendation.text}</span></div><div class="route-actions"><a class="btn btn-primary" href="${intakeUrl}">Continue With This Need →</a><a class="btn btn-ghost" href="/contact/">Ask ATechSpot a Question</a></div>`;
    routeResult.classList.add('show');
    routeResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    if (window.gtag) gtag('event', 'assessment_route_selected', { route: card.dataset.route, recommended_topic: recommendation.topic });
  }));

  const conversionStyle = document.createElement('style');
  conversionStyle.textContent = `
    .route-result.show{display:grid;grid-template-columns:1.3fr .7fr;gap:22px;align-items:center;padding:24px;border:1px solid #23506f;border-radius:18px;background:linear-gradient(135deg,#091d2e,#07131f)}
    .route-copy{display:grid;gap:7px}.route-copy strong{color:#65dff0;font-size:11px;letter-spacing:.12em;text-transform:uppercase}.route-copy span{color:#b2c5d4;line-height:1.65}
    .route-actions{display:flex;gap:9px;flex-wrap:wrap;justify-content:flex-end}.route-actions .btn{white-space:nowrap}
    .founder-id{margin:0 0 18px!important;padding:12px 14px;border-left:2px solid #65dff0;background:#071827;border-radius:8px;color:#dcebf7!important}.founder-id strong{color:#fff}.founder-id span{color:#7f9aae}
    @media(max-width:760px){.route-result.show{grid-template-columns:1fr}.route-actions{justify-content:flex-start}}
  `;
  document.head.appendChild(conversionStyle);

  const canvas = document.getElementById('networkCanvas');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dpr = 1, pts = [];
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = Array.from({ length: Math.min(58, Math.max(28, Math.floor(w / 24))) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - .5) * .18,
        vy: (Math.random() - .5) * .18
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        ctx.beginPath();
        ctx.fillStyle = 'rgba(90,193,255,.28)';
        ctx.arc(a.x, a.y, 1.1, 0, Math.PI * 2);
        ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
          if (d < 125) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(82,189,255,${(1 - d / 125) * .08})`;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    };
    resize();
    addEventListener('resize', resize);
    draw();
  }

  /* Founder portrait: use the validated optimized production asset. */
  const founderImg = document.querySelector('.founder-photo-card img');
  if (founderImg) {
    founderImg.src = '/assets/atechspot-founder-ceo.webp?v=20260910-10';
    founderImg.alt = 'Jason Hughes, Founder and CEO of ATechSpot, in the ATechSpot technology command center';
    founderImg.removeAttribute('srcset');
    founderImg.loading = 'lazy';
    founderImg.decoding = 'async';
    founderImg.style.opacity = '1';
  }

  const founderCopy = document.querySelector('.founder-copy');
  if (founderCopy && !founderCopy.querySelector('.founder-id')) {
    const firstParagraph = founderCopy.querySelector('p');
    const identity = document.createElement('p');
    identity.className = 'founder-id';
    identity.innerHTML = '<strong>Jason Hughes</strong> <span>· Founder &amp; CEO, ATechSpot</span>';
    if (firstParagraph) founderCopy.insertBefore(identity, firstParagraph);
    else founderCopy.appendChild(identity);
  }

  /* Give every offer a clear conversion destination. */
  document.querySelectorAll('.price-card').forEach(card => {
    const title = card.querySelector('h3')?.textContent.trim();
    const link = card.querySelector('a');
    if (!link) return;
    if (title === 'Executive Growth Review') link.href = '/intake/?topic=Executive%20Growth%20Review#project-intake';
    if (title === 'Implementation') link.href = '/intake/#project-intake';
    if (title === 'GrowthCare') link.href = '/intake/?topic=GrowthCare%20Ongoing%20Optimization#project-intake';
  });

  /* Exact ATechSpot logo treatment. Keep the CSS wordmark as a fail-safe, and
     remove only edge-connected near-white pixels so internal white logo details survive. */
  const logoStyle = document.createElement('style');
  logoStyle.textContent = `
    .site-header{min-height:94px}
    .site-header .brand,.footer-brand{background:none!important;filter:none!important;width:320px!important;height:82px!important;flex:0 0 320px!important;display:flex!important;align-items:center!important;overflow:visible!important}
    .brand.logo-ready .brand-mark,.brand.logo-ready .brand-name{display:none!important}
    .brand-logo-clean{display:none;width:320px;height:82px;object-fit:contain;object-position:left center;filter:drop-shadow(0 0 16px rgba(76,179,255,.22))}
    .brand.logo-ready .brand-logo-clean{display:block}
    .footer-brand{width:340px!important;height:92px!important;flex-basis:340px!important}
    .footer-brand .brand-logo-clean{width:340px;height:92px}
    @media(max-width:1020px){.site-header .brand{width:255px!important;height:72px!important;flex-basis:255px!important}.brand-logo-clean{width:255px;height:72px}}
    @media(max-width:650px){.site-header{min-height:78px}.site-header .brand{width:225px!important;height:64px!important;flex-basis:225px!important}.brand-logo-clean{width:225px;height:64px}.footer-brand{width:240px!important;height:72px!important;flex-basis:240px!important}.footer-brand .brand-logo-clean{width:240px;height:72px}}
  `;
  document.head.appendChild(logoStyle);

  const processLogo = () => {
    const source = new Image();
    source.decoding = 'async';
    source.src = '/assets/atechspot-logo.png?v=20260910-10';
    source.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const max = 800;
        const scale = Math.min(1, max / source.naturalWidth, max / source.naturalHeight);
        canvas.width = Math.max(1, Math.round(source.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(source.naturalHeight * scale));
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
        const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = image.data;
        const W = canvas.width, H = canvas.height;
        const visited = new Uint8Array(W * H);
        const queue = new Int32Array(W * H);
        let head = 0, tail = 0;
        const nearWhite = i => {
          const r = d[i], g = d[i + 1], b = d[i + 2];
          return r > 218 && g > 218 && b > 218 && Math.max(r, g, b) - Math.min(r, g, b) < 28;
        };
        const push = (x, y) => {
          const p = y * W + x;
          if (visited[p]) return;
          const i = p * 4;
          if (!nearWhite(i)) return;
          visited[p] = 1;
          queue[tail++] = p;
        };
        for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); }
        for (let y = 1; y < H - 1; y++) { push(0, y); push(W - 1, y); }
        while (head < tail) {
          const p = queue[head++], x = p % W, y = (p / W) | 0;
          d[p * 4 + 3] = 0;
          if (x > 0) push(x - 1, y);
          if (x + 1 < W) push(x + 1, y);
          if (y > 0) push(x, y - 1);
          if (y + 1 < H) push(x, y + 1);
        }
        ctx.putImageData(image, 0, 0);

        let minX = W, minY = H, maxX = -1, maxY = -1;
        for (let y = 0; y < H; y++) {
          for (let x = 0; x < W; x++) {
            if (d[(y * W + x) * 4 + 3] > 12) {
              if (x < minX) minX = x;
              if (y < minY) minY = y;
              if (x > maxX) maxX = x;
              if (y > maxY) maxY = y;
            }
          }
        }
        if (maxX < minX || maxY < minY) throw new Error('Logo bounds unavailable');
        const pad = Math.max(6, Math.round(Math.max(maxX - minX, maxY - minY) * .02));
        minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad);
        maxX = Math.min(W - 1, maxX + pad); maxY = Math.min(H - 1, maxY + pad);
        const out = document.createElement('canvas');
        out.width = maxX - minX + 1;
        out.height = maxY - minY + 1;
        out.getContext('2d').drawImage(canvas, minX, minY, out.width, out.height, 0, 0, out.width, out.height);
        const transparentLogo = out.toDataURL('image/png');

        document.querySelectorAll('.brand').forEach(brand => {
          let img = brand.querySelector('.brand-logo-clean');
          if (!img) {
            img = document.createElement('img');
            img.className = 'brand-logo-clean';
            img.alt = 'ATechSpot';
            img.decoding = 'async';
            brand.prepend(img);
          }
          img.src = transparentLogo;
          brand.classList.add('logo-ready');
        });
      } catch (err) {
        console.warn('ATechSpot logo cleanup fallback active.', err);
      }
    };
  };
  processLogo();
})();
