(() => {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(a => a.addEventListener('click', e => {
    const el = document.querySelector(a.getAttribute('href'));
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({behavior:'smooth', block:'start'});
  }));
})();
