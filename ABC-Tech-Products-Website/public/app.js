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
const photo=document.getElementById('tryonPhoto');
const empty=document.getElementById('tryonEmpty');
const overlay=document.getElementById('garmentOverlay');
const garmentShape=document.getElementById('garmentShape');
const garmentMain=document.getElementById('garmentMain');
const garmentSub=document.getElementById('garmentSub');
const launch=document.getElementById('tryonLaunch');
const save=document.getElementById('tryonSave');
const reset=document.getElementById('tryonReset');
const status=document.getElementById('tryonStatus');
const collection=document.getElementById('tryonCollection');
const garment=document.getElementById('tryonGarment');
const scale=document.getElementById('tryonScale');
const xctrl=document.getElementById('tryonX');
const yctrl=document.getElementById('tryonY');

let loadedDataUrl='';
const designs={
  'ABC Tech Kids':{main:'FUTURE BUILDER',sub:'BRIGHT MINDS • BIG FUTURES',fill:'#1565ff',accent:'#f4ff3b'},
  'Future Mode':{main:'OUTCODE',sub:'THE ORDINARY',fill:'#090f20',accent:'#ff4fc3'},
  'A+ Tech Core':{main:'A+ TECH',sub:'IDEAS • PEOPLE • IMPACT',fill:'#111111',accent:'#46e5ff'},
  'Creator Edition':{main:'BUILT NEXT',sub:'CREATE • CODE • CONNECT',fill:'#161126',accent:'#ff7a3d'}
};

function applyDesign(){
  if(!overlay)return;
  const d=designs[collection?.value]||designs['A+ Tech Core'];
  garmentShape?.setAttribute('fill',d.fill);
  garmentMain.textContent=d.main;
  garmentSub.textContent=d.sub;
  garmentSub.setAttribute('fill',d.accent);
  if(garment?.value==='hoodie'){
    garmentShape?.setAttribute('d','M120 105 L155 70 Q210 20 265 70 L300 105 L380 155 L340 235 L305 205 L305 485 L115 485 L115 205 L80 235 L40 155 Z M155 70 Q210 125 265 70');
  }else{
    garmentShape?.setAttribute('d','M120 70 L170 35 Q210 60 250 35 L300 70 L380 125 L335 205 L300 180 L300 470 L120 470 L120 180 L85 205 L40 125 Z');
  }
}
function applyFit(){
  if(!overlay)return;
  const s=Number(scale?.value||46)/100;
  const x=Number(xctrl?.value||0);
  const y=Number(yctrl?.value||4);
  overlay.style.width=(88*s)+'%';
  overlay.style.left=(50+x)+'%';
  overlay.style.top=(48+y)+'%';
}
function revealOverlay(){
  if(!loadedDataUrl){
    if(status)status.textContent='Upload a photo first.';
    return false;
  }
  overlay.hidden=false;
  applyDesign();applyFit();
  if(status)status.textContent='A+ look applied. Drag the garment or use Size / Left-Right / Up-Down to fine-tune the fit.';
  return true;
}

upload?.addEventListener('change',()=>{
  const file=upload.files?.[0];
  if(!file||!photo)return;
  if(!file.type.startsWith('image/')){if(status)status.textContent='Choose an image file.';return;}
  const reader=new FileReader();
  reader.onload=()=>{
    loadedDataUrl=String(reader.result||'');
    photo.src=loadedDataUrl;
    photo.hidden=false;
    empty?.setAttribute('hidden','');
    overlay.hidden=true;
    if(status)status.textContent='Photo loaded locally. Choose your collection, then create the try-on preview.';
  };
  reader.readAsDataURL(file);
});
[collection,garment].forEach(el=>el?.addEventListener('change',()=>{applyDesign();if(!overlay?.hidden){applyFit();if(status)status.textContent='Look updated for '+collection.value+'.';}}));
[scale,xctrl,yctrl].forEach(el=>el?.addEventListener('input',applyFit));
launch?.addEventListener('click',()=>{
  if(mode==='live'&&vto){location.href=vto;return;}
  if(revealOverlay()) launch.textContent='Look Applied ✓';
});

reset?.addEventListener('click',()=>{
  if(scale)scale.value='46';
  if(xctrl)xctrl.value='0';
  if(yctrl)yctrl.value='4';
  applyFit();
  if(status)status.textContent='Fit reset to the recommended starting position.';
  if(launch)launch.textContent='Apply A+ Look →';
});

let dragging=false,dragStartX=0,dragStartY=0,startLeft=50,startTop=52;
overlay?.addEventListener('pointerdown',e=>{
  if(overlay.hidden)return;
  dragging=true;overlay.setPointerCapture(e.pointerId);
  dragStartX=e.clientX;dragStartY=e.clientY;
  startLeft=parseFloat(overlay.style.left)||50;startTop=parseFloat(overlay.style.top)||58;
});
overlay?.addEventListener('pointermove',e=>{
  if(!dragging)return;
  const box=overlay.parentElement.getBoundingClientRect();
  const dx=(e.clientX-dragStartX)/box.width*100;
  const dy=(e.clientY-dragStartY)/box.height*100;
  overlay.style.left=(startLeft+dx)+'%';
  overlay.style.top=(startTop+dy)+'%';
});
overlay?.addEventListener('pointerup',()=>{dragging=false;});

save?.addEventListener('click',()=>{
  if(!loadedDataUrl||overlay?.hidden){if(status)status.textContent='Create a try-on preview first.';return;}
  const stage=document.querySelector('.tryon-stage');
  const rect=stage.getBoundingClientRect();
  const canvas=document.createElement('canvas');
  canvas.width=Math.max(900,Math.round(rect.width*2));
  canvas.height=Math.round(canvas.width*(rect.height/rect.width));
  const ctx=canvas.getContext('2d');
  const img=new Image();
  img.onload=()=>{
    const scaleContain=Math.min(canvas.width/img.width,canvas.height/img.height);
    const dw=img.width*scaleContain,dh=img.height*scaleContain;
    const dx=(canvas.width-dw)/2,dy=(canvas.height-dh)/2;
    ctx.fillStyle='#eef3f8';ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img,dx,dy,dw,dh);
    const svg=new XMLSerializer().serializeToString(overlay);
    const svgBlob=new Blob([svg],{type:'image/svg+xml;charset=utf-8'});
    const svgUrl=URL.createObjectURL(svgBlob);
    const g=new Image();
    g.onload=()=>{
      const stageRect=stage.getBoundingClientRect();
      const overlayRect=overlay.getBoundingClientRect();
      const sx=canvas.width/stageRect.width,sy=canvas.height/stageRect.height;
      ctx.drawImage(g,(overlayRect.left-stageRect.left)*sx,(overlayRect.top-stageRect.top)*sy,overlayRect.width*sx,overlayRect.height*sy);
      URL.revokeObjectURL(svgUrl);
      const link=document.createElement('a');
      link.download='abc-tech-products-tryon-preview.png';
      link.href=canvas.toDataURL('image/png');
      link.click();
      if(status)status.textContent='Preview saved to your device.';
    };
    g.src=svgUrl;
  };
  img.src=loadedDataUrl;
});
applyDesign();applyFit();

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