(()=>{
  document.documentElement.classList.add('v27-ready');
  const intro=document.querySelector('.v26-intro');
  if(!intro) return;
  const key='atechspot-v27-intro-seen';
  const finish=()=>{
    if(intro.dataset.closing==='1') return;
    intro.dataset.closing='1';
    try{sessionStorage.setItem(key,'1')}catch(e){}
    intro.classList.add('is-done');
    window.setTimeout(()=>intro.remove(),720);
  };
  let seen=false;
  try{seen=sessionStorage.getItem(key)==='1'}catch(e){}
  if(seen){intro.remove();return;}
  intro.querySelectorAll('[data-enter-site]').forEach(btn=>btn.addEventListener('click',finish));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')finish()},{passive:true});
})();
