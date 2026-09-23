(()=>{'use strict';

const menu=document.getElementById('menu');
const nav=document.getElementById('nav');
menu?.addEventListener('click',()=>{
  const open=nav.classList.toggle('open');
  menu.setAttribute('aria-expanded',String(open));
});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  nav.classList.remove('open');
  menu?.setAttribute('aria-expanded','false');
}));

const mode=window.ABC_COMMERCE_MODE||'preview';
const checkout=window.ABC_CHECKOUT_URL||'';
const vto=window.ABC_VTO_URL||'';

const modal=document.getElementById('productModal');
const modalTitle=document.getElementById('modalTitle');
const modalClose=document.getElementById('modalClose');
const modalLaunch=document.getElementById('modalLaunch');

document.querySelectorAll('.preview-product').forEach(btn=>{
  btn.addEventListener('click',()=>{
    if(modalTitle) modalTitle.textContent=btn.dataset.product||'Preview Drop';
    if(modal) modal.hidden=false;
    document.body.style.overflow='hidden';
  });
});
function closeModal(){
  if(modal)modal.hidden=true;
  document.body.style.overflow='';
}
modalClose?.addEventListener('click',closeModal);
modal?.addEventListener('click',e=>{if(e.target===modal)closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
modalLaunch?.addEventListener('click',()=>{
  closeModal();
  document.getElementById('launch')?.scrollIntoView({behavior:'smooth'});
});

const upload=document.getElementById('tryonUpload');
const preview=document.getElementById('tryonPreview');
const launch=document.getElementById('tryonLaunch');
const status=document.getElementById('tryonStatus');

upload?.addEventListener('change',()=>{
  const file=upload.files?.[0];
  if(!file||!preview)return;
  if(!file.type.startsWith('image/')){
    if(status)status.textContent='Choose an image file to preview.';
    return;
  }
  const reader=new FileReader();
  reader.onload=()=>{
    preview.innerHTML='<img alt="Your private local try-on preview photo" src="'+reader.result+'">';
    if(status)status.textContent='Photo loaded locally in this browser. It has not been uploaded by this page.';
  };
  reader.readAsDataURL(file);
});

launch?.addEventListener('click',()=>{
  if(mode==='live'&&vto){
    location.href=vto;
    return;
  }
  if(status){
    status.textContent='AI garment try-on is launch-ready but not active yet. It will activate after live commerce, published products, and the try-on provider are authorized.';
  }
});

document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id=a.getAttribute('href');
    if(!id||id==='#')return;
    const target=document.querySelector(id);
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
    }
  });
});

if(mode==='live'&&checkout){
  document.querySelectorAll('.preview-product').forEach(btn=>{
    btn.textContent='Shop Now →';
    btn.addEventListener('click',e=>{
      e.stopImmediatePropagation();
      location.href=checkout;
    },true);
  });
}
})();