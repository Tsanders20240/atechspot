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

const upload=document.getElementById('tryonUpload');
const preview=document.getElementById('tryonPreview');
const launch=document.getElementById('tryonLaunch');
const status=document.getElementById('tryonStatus');
upload?.addEventListener('change',()=>{
  const file=upload.files?.[0];
  if(!file||!preview)return;
  const reader=new FileReader();
  reader.onload=()=>{preview.innerHTML='<img alt="Your private virtual try-on preview photo" src="'+reader.result+'">';};
  reader.readAsDataURL(file);
});
launch?.addEventListener('click',()=>{
  const provider=window.ABC_VTO_URL||'';
  if(provider){
    window.location.href=provider;
    return;
  }
  if(status)status.textContent='Virtual Try-On is ready to activate after the Shopify store, published Tapstitch apparel and a VTO app are connected. Your uploaded photo is previewed only in this browser and is not sent anywhere by this page.';
});
})();