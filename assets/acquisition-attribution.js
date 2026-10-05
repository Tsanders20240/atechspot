(() => {
 const key='atechspot-acquisition-attribution-v1',params=new URLSearchParams(location.search);
 const clean=v=>String(v||'').trim().slice(0,120);
 let a={source:'direct / unknown',campaign:'unattributed',medium:'',landing:location.pathname};
 try{a=JSON.parse(sessionStorage.getItem(key))||a}catch{}
 if(params.has('utm_source')||params.has('utm_campaign')){
 a={source:clean(params.get('utm_source'))||'unknown',campaign:clean(params.get('utm_campaign'))||'unattributed',medium:clean(params.get('utm_medium')),landing:location.pathname};
 }else if(a.source==='direct / unknown'&&document.referrer){
 try{const r=new URL(document.referrer);if(r.origin!==location.origin)a.source=r.hostname}catch{}
 }
 try{sessionStorage.setItem(key,JSON.stringify(a))}catch{}
 document.querySelectorAll('form[data-endpoint="/api/assessment"]').forEach(form=>{
 const hidden=(name,value)=>{let input=form.querySelector('input[name="'+name+'"]');if(!input){input=document.createElement('input');input.type='hidden';input.name=name;form.appendChild(input)}input.value=value;return input};
 hidden('Lead Source',a.source);hidden('Campaign',a.campaign);hidden('Lead Medium',a.medium);hidden('Landing Page',a.landing);
 const submission=hidden('Submission ID',crypto.randomUUID());
 // Stable across network retries; a successful reset starts a new submission.
 form.addEventListener('reset',()=>{submission.value=crypto.randomUUID()});
 const service=form.querySelector('[name="Service Interest"]'),requested=params.get('service');
 if(service&&requested&&[...service.options].some(o=>o.value===requested))service.value=requested;
 const industry=form.querySelector('[name="Industry"]');if(industry&&params.get('industry'))industry.value=clean(params.get('industry'));
 });
})();
