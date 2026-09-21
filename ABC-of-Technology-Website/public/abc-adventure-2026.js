(()=>{'use strict';
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

const menu=document.querySelector('.nav-toggle-abc');
const nav=document.querySelector('header .nav');
if(menu&&nav){
  menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
}

const map=document.getElementById('adventureMap');
if(map&&typeof WORDS!=='undefined'){
  WORDS.forEach((w,i)=>{
    const b=document.createElement('button');
    b.type='button';b.className='adventure-letter';
    b.setAttribute('aria-label',`${w[0]} is for ${w[1]}. Open this letter in the ABC Tech Bus activity.`);
    b.innerHTML=`<strong>${w[0]}</strong><small>${w[1]}</small>`;
    b.addEventListener('click',()=>{
      if(typeof renderWord==='function')renderWord(i);
      document.getElementById('play')?.scrollIntoView({behavior:reduced?'auto':'smooth'});
      setTimeout(()=>document.getElementById('speakWord')?.focus(),350);
      if(typeof gtag==='function')gtag('event','abc_adventure_letter',{letter:w[0],technology_word:w[1]});
    });
    map.appendChild(b);
  });
}

const spotlight=document.getElementById('adventureSpotlight');
const spotlightTitle=document.getElementById('adventureSpotlightTitle');
const spotlightText=document.getElementById('adventureSpotlightText');
const spotlightLink=document.getElementById('adventureSpotlightLink');
const modes=[
  ['READ','Open the real book world.','Preview supplied pages from ABC’s of Technology.','#book'],
  ['RIDE','Ride the ABC Tech Bus.','Pick A–Z technology words, hear them aloud and try a quick challenge.','#play'],
  ['CREATE','Explore STEM together.','Try six grown-up-guided science, technology, engineering and math activities.','#stem'],
  ['SPELL','Listen. Spell. Learn.','Build technology vocabulary with the A–Z spelling bee.','#spelling'],
  ['COLOR','Print all 26 A–Z pages.','Use screen-free printable technology coloring activities.','#color'],
  ['LISTEN','Bring the words to life.','Use spoken vocabulary, songs and approved video learning with a grown-up.','#watch']
];
let modeIndex=0,timer;
function showMode(i){
  modeIndex=i%modes.length;
  const m=modes[modeIndex];
  if(spotlight){spotlight.dataset.mode=m[0];}
  if(spotlightTitle)spotlightTitle.textContent=m[1];
  if(spotlightText)spotlightText.textContent=m[2];
  if(spotlightLink)spotlightLink.href=m[3];
  document.querySelectorAll('.spot-dot').forEach((d,n)=>d.classList.toggle('active',n===modeIndex));
}
function startModes(){
  if(reduced)return;
  clearInterval(timer);
  timer=setInterval(()=>showMode((modeIndex+1)%modes.length),4200);
}
document.querySelectorAll('.spot-dot').forEach((d,i)=>d.addEventListener('click',()=>{showMode(i);startModes()}));
showMode(0);startModes();

document.querySelectorAll('[data-parent-cta]').forEach(a=>a.addEventListener('click',()=>{
  if(typeof gtag==='function')gtag('event','abc_parent_product_click',{product:a.dataset.parentCta||'unknown',destination:a.href||''});
}));

const shop=document.getElementById('shop');
if(shop&&'IntersectionObserver'in window){
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{
    if(e.isIntersecting&&typeof gtag==='function'){gtag('event','abc_grownup_shop_view');io.disconnect();}
  }),{threshold:.25});io.observe(shop);
}
})();