(()=>{'use strict';
const menu=document.getElementById('menu'),nav=document.getElementById('nav');
menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu?.setAttribute('aria-expanded','false');}));

const profiles={
  Kids:{
    collection:'ABC Tech Kids',
    copy:'Start with bright, playful learning designs connected to robots, STEM, the technology alphabet and the ABC of Technology world.'
  },
  Teens:{
    collection:'Future Mode',
    copy:'Start with the Gen Z teen streetwear lane: gaming, AI, coding, creator culture and bold digital-identity graphics.'
  },
  Adults:{
    collection:'A+ Tech Core',
    copy:'Start with cleaner A+ Techucation lifestyle pieces for creators, entrepreneurs, educators and everyday technology culture.'
  }
};
document.getElementById('finderForm')?.addEventListener('submit',e=>{
  e.preventDefault();
  const audience=document.getElementById('audience')?.value;
  const style=document.getElementById('style')?.value;
  const interest=document.getElementById('interest')?.value;
  const result=document.getElementById('finderResult');
  if(!audience||!style||!interest||!result)return;
  const p=profiles[audience];
  result.innerHTML=`<strong>${p.collection}</strong><p><b>Your style:</b> ${style}. <b>Your tech world:</b> ${interest}.</p><p>${p.copy}</p><a href="#drops">Explore the collection architecture →</a>`;
  result.classList.add('show');
  result.scrollIntoView({behavior:'smooth',block:'nearest'});
});
})();