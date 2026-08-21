(()=>{
  document.documentElement.classList.add('v26-ready');
  // Make the intro available again after a new deployment while preserving normal per-session skip behavior.
  const intro=document.querySelector('.v26-intro');
  if(intro){
    try{
      const key='atechspot-v26-intro-seen';
      if(sessionStorage.getItem(key)==='1'){
        intro.classList.add('is-done');
        setTimeout(()=>intro.remove(),30);
      }else{
        intro.querySelectorAll('[data-enter-site]').forEach(btn=>btn.addEventListener('click',()=>sessionStorage.setItem(key,'1'),{once:true}));
      }
    }catch(e){}
  }
})();
