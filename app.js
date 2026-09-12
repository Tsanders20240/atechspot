(() => {
  const core = document.createElement('script');
  core.src = '/app-core.js?v=20260912-3';
  core.async = false;
  core.onload = () => {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = '/flagship-fix.css?v=20260912-3';
    document.head.appendChild(css);
  };
  core.onerror = () => {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = '/flagship-fix.css?v=20260912-3';
    document.head.appendChild(css);
  };
  document.head.appendChild(core);
})();