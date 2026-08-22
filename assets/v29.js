(() => {
  'use strict';
  const intro = document.getElementById('atech-v29-intro');
  if (!intro) return;

  const key = 'atechspot-v29-intro-seen';
  let closing = false;

  const finish = () => {
    if (closing) return;
    closing = true;
    try { sessionStorage.setItem(key, '1'); } catch (_) {}
    document.documentElement.classList.add('v29-intro-seen');
    intro.classList.add('v29-is-closing');
    window.setTimeout(() => intro.remove(), 190);
  };

  let seen = false;
  try { seen = sessionStorage.getItem(key) === '1'; } catch (_) {}
  if (seen) {
    intro.remove();
    return;
  }

  intro.querySelectorAll('[data-v29-enter]').forEach((button) => {
    button.addEventListener('click', finish, { once: true });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') finish();
  });
})();
