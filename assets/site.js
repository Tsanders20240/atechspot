(() => {
  const CANONICAL_APP = '/app/';
  const LEGACY_APP_PATHS = new Set(['/apps', '/apps/', '/apps.html']);

  function normalizeCanonicalRoutes() {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (LEGACY_APP_PATHS.has(href)) link.setAttribute('href', CANONICAL_APP);
      if (href === '/solutions' || href === '/solutions/' || href === '/solutions.html') {
        link.setAttribute('href', '/services/');
      }
    });
  }

  function ensureAccessibleHeader() {
    document.querySelectorAll('.site-header').forEach((header, index) => {
      const nav = header.querySelector('nav');
      if (!nav) return;
      if (!nav.id) nav.id = index === 0 ? 'nav' : `nav-${index + 1}`;
      if (!header.querySelector('.menu-btn')) {
        const button = document.createElement('button');
        button.className = 'menu-btn';
        button.type = 'button';
        button.id = index === 0 ? 'menuBtn' : `menuBtn-${index + 1}`;
        button.setAttribute('aria-controls', nav.id);
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-label', 'Open navigation');
        button.textContent = '☰';
        header.appendChild(button);
      }
    });
  }

  normalizeCanonicalRoutes();
  ensureAccessibleHeader();

  function contactRouteFromEmailHref(href) {
    try {
      const raw = String(href || '');
      if (!raw.toLowerCase().startsWith('mailto:')) return null;
      const withoutScheme = raw.slice(7);
      const [addressPart, query = ''] = withoutScheme.split('?');
      const address = decodeURIComponent(addressPart || '').trim().toLowerCase();
      const local = (address.split('@')[0] || 'jason').toLowerCase();
      const allowed = new Set(['jason', 'support', 'partnerships', 'operations', 'legal']);
      const department = allowed.has(local) ? local : 'jason';
      const sourceParams = new URLSearchParams(query);
      const params = new URLSearchParams();
      params.set('department', department);
      const subject = sourceParams.get('subject');
      if (subject) params.set('subject', subject);
      return `/contact/?${params.toString()}#contact-form`;
    } catch {
      return '/contact/';
    }
  }

  document.addEventListener('click', event => {
    const link = event.target.closest && event.target.closest('a[href^="mailto:"]');
    if (!link) return;
    const route = contactRouteFromEmailHref(link.getAttribute('href'));
    if (!route) return;
    event.preventDefault();
    window.location.href = route;
  }, true);

  const DEPARTMENT_EMAILS = {
    jason: 'jason@atechspot.com',
    support: 'support@atechspot.com',
    partnerships: 'partnerships@atechspot.com',
    operations: 'operations@atechspot.com',
    legal: 'legal@atechspot.com'
  };

  function formPayload(form) {
    const data = Object.fromEntries(new FormData(form).entries());
    if (form.dataset.formType) data['Form Type'] = form.dataset.formType;
    return data;
  }

  function webEmailUrl(form) {
    const data = formPayload(form);
    const department = String(data.Department || 'jason').toLowerCase();
    const to = DEPARTMENT_EMAILS[department] || DEPARTMENT_EMAILS.jason;
    const subject = String(data.Subject || data.Topic || data.Service || form.dataset.formType || 'ATechSpot Website Inquiry').trim();
    const ignored = new Set(['website', 'form_started_at', 'cf-turnstile-response']);
    const lines = [];
    Object.entries(data).forEach(([key, value]) => {
      const text = String(value ?? '').trim();
      if (!ignored.has(key) && text) lines.push(`${key}: ${text}`);
    });
    lines.push('', 'Sent from ATechSpot.com');
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
  }

  async function sendWebsiteForm(form) {
    const endpoint = form.dataset.endpoint || '/api/contact';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(formPayload(form))
    });
    let result = {};
    try { result = await response.json(); } catch {}
    if (!response.ok) {
      const error = new Error(result.message || `Form delivery failed (${response.status}).`);
      error.status = response.status;
      throw error;
    }
    return result;
  }

  function openWebEmailFallback(form, status) {
    if (status) status.textContent = 'The secure form could not complete. Opening your web email with this message prefilled…';
    window.location.href = webEmailUrl(form);
  }

  function trackFormSuccess(form) {
    const formType = form.dataset.formType || 'ATechSpot Website Form';
    if (typeof window.gtag === 'function') window.gtag('event', 'form_submit_success', { form_type: formType, page_location: window.location.href });
    if (typeof window.clarity === 'function') window.clarity('event', 'form_submit_success');
  }

  function wireForm(form) {
    const started = form.querySelector('input[name="form_started_at"]');
    if (started) started.value = String(Date.now());
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const status = form.querySelector('[data-status]');
      const button = form.querySelector('button[type="submit"]');
      const originalText = button?.textContent || '';
      if (status) status.textContent = 'Sending your request…';
      if (button) {
        button.disabled = true;
        button.setAttribute('aria-busy', 'true');
        button.textContent = 'Sending…';
      }
      try {
        const result = await sendWebsiteForm(form);
        if (status) status.textContent = result.message || 'Thank you. Your request was sent successfully.';
        trackFormSuccess(form);
        form.reset();
        if (started) started.value = String(Date.now());
      } catch (error) {
        openWebEmailFallback(form, status);
        return;
      } finally {
        if (button) {
          button.disabled = false;
          button.removeAttribute('aria-busy');
          button.textContent = originalText;
        }
      }
    });
  }

  document.querySelectorAll('[data-email-form]').forEach(wireForm);
  document.querySelectorAll('[data-secure-form]').forEach(form => {
    if (form.matches('[data-email-form]')) return;
    wireForm(form);
  });

  document.querySelectorAll('[data-year]').forEach(element => {
    element.textContent = new Date().getFullYear();
  });

  document.querySelectorAll('[data-event]').forEach(link => {
    link.addEventListener('click', () => {
      const eventName = link.dataset.event;
      if (typeof window.gtag === 'function') window.gtag('event', eventName, { link_text: (link.textContent || '').trim(), page_location: window.location.href });
      if (typeof window.clarity === 'function') window.clarity('event', eventName);
    });
  });

  document.querySelectorAll('.meeting-choice').forEach(link => {
    link.addEventListener('click', () => {
      const select = document.querySelector('#preferred-meeting');
      if (!select) return;
      const desired = link.dataset.meeting || '';
      const match = [...select.options].find(option => option.value === desired || option.textContent.includes(desired));
      if (match) select.value = match.value;
    });
  });

  const params = new URLSearchParams(window.location.search);
  const service = params.get('service');
  const meeting = params.get('meeting');
  const topic = params.get('topic');
  const department = params.get('department');
  const subject = params.get('subject');

  if (service) {
    document.querySelectorAll('select[name="Service"]').forEach(select => {
      const match = [...select.options].find(option => option.value === service || option.textContent === service);
      if (match) select.value = match.value;
    });
  }
  if (meeting) {
    document.querySelectorAll('select[name="Preferred Meeting"]').forEach(select => {
      const match = [...select.options].find(option => option.value === meeting || option.textContent.includes(meeting));
      if (match) select.value = match.value;
    });
  }
  if (topic) {
    document.querySelectorAll('input[name="Topic"]').forEach(input => { input.value = topic; });
    document.querySelectorAll('select[name="Topic"]').forEach(select => {
      const normalized = topic.trim().toLowerCase();
      const match = [...select.options].find(option => option.value.trim().toLowerCase() === normalized || option.textContent.trim().toLowerCase() === normalized);
      if (match) select.value = match.value;
    });
  }
  if (department) {
    document.querySelectorAll('select[name="Department"]').forEach(select => {
      const match = [...select.options].find(option => option.value === department);
      if (match) select.value = match.value;
    });
  }
  if (subject) {
    document.querySelectorAll('input[name="Subject"]').forEach(input => { input.value = subject; });
  }

  if (service) {
    const serviceSelect = document.querySelector('#service-requested');
    if (serviceSelect) {
      const match = [...serviceSelect.options].find(option => option.value === service || option.textContent.trim() === service);
      if (match) serviceSelect.value = match.value;
    }
  }

  document.querySelectorAll('a[href="https://store.bookbaby.com/profile/abc"]').forEach(link => {
    link.href = 'https://store.bookbaby.com/book/a-techucations-abcs-of-technology';
  });
})();