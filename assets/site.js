(() => {
  'use strict';
  const CANONICAL_APP='/app/';
  const LEGACY_APP_PATHS=new Set(['/apps','/apps/','/apps.html']);
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LIVE_PAYMENTS={executiveReview:'https://book.stripe.com/3cI3cw1j00aG6X93LA6EU04'};

  function ensureGa4(){
    const id='G-P5FFL89J6T';
    if(typeof window.gtag==='function')return;
    window.dataLayer=window.dataLayer||[];
    window.gtag=function(){window.dataLayer.push(arguments)};
    window.gtag('js',new Date());
    window.gtag('config',id,{send_page_view:true});
    if(!document.querySelector('script[src*="googletagmanager.com/gtag/js?id='+id+'"]')){const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(id);document.head.appendChild(script)}
  }

  function normalizedPath(pathname){if(!pathname||pathname==='/index.html')return '/';if(pathname.endsWith('/index.html'))return pathname.slice(0,-10)||'/';return pathname.endsWith('/')||pathname.includes('.')?pathname:`${pathname}/`}
  function normalizeRoutes(){document.querySelectorAll('a[href]').forEach(link=>{const href=link.getAttribute('href');if(LEGACY_APP_PATHS.has(href))link.setAttribute('href',CANONICAL_APP);if(['/solutions','/solutions/','/solutions.html'].includes(href))link.setAttribute('href','/services/');const clean={'/resources.html':'/resources/','/privacy.html':'/privacy/','/terms.html':'/terms/','/accessibility.html':'/accessibility/','/affiliate-disclosure.html':'/affiliate-disclosure/','/remote-support.html':'/remote-support/','/business.html':'/assessment/','/business/':'/assessment/'};if(clean[href])link.setAttribute('href',clean[href])})}
  function ensureSkipLink(){const main=document.querySelector('main');if(!main)return;if(!main.id)main.id='main';if(!document.querySelector('.skip-link')){const link=document.createElement('a');link.className='skip-link';link.href=`#${main.id}`;link.textContent='Skip to main content';document.body.prepend(link)}}
  function ensureAccessibleHeader(){const current=normalizedPath(location.pathname);document.querySelectorAll('.site-header').forEach((header,index)=>{const nav=header.querySelector('nav');if(!nav)return;if(!nav.id)nav.id=index===0?'nav':`nav-${index+1}`;nav.querySelectorAll('a[href]').forEach(link=>{try{const url=new URL(link.href,location.origin);if(url.origin===location.origin&&normalizedPath(url.pathname)===current)link.setAttribute('aria-current','page')}catch{}});let button=header.querySelector('.menu-btn');if(!button){button=document.createElement('button');button.className='menu-btn';button.type='button';button.id=index===0?'menuBtn':`menuBtn-${index+1}`;button.setAttribute('aria-controls',nav.id);button.setAttribute('aria-expanded','false');button.setAttribute('aria-label','Open navigation');button.textContent='☰';header.appendChild(button)}if(!button.dataset.wired){button.dataset.wired='true';button.addEventListener('click',()=>{const open=nav.classList.toggle('open');button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'Close navigation':'Open navigation')});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');button.setAttribute('aria-expanded','false');button.setAttribute('aria-label','Open navigation')}))}})}

  function ensureTransparentCorporateLogo(){
    if(document.documentElement.dataset.atechLogoFixed==='true')return;
    document.documentElement.dataset.atechLogoFixed='true';
    const style=document.createElement('style');
    style.textContent=`
      .site-header{min-height:88px}
      .site-header .brand,.footer-brand{background:none!important;filter:none!important;width:286px!important;height:72px!important;flex:0 0 286px!important;display:flex!important;align-items:center!important;overflow:visible!important}
      .brand.logo-ready .brand-mark,.brand.logo-ready .brand-name{display:none!important}
      .brand-logo-clean{display:none;width:286px;height:72px;object-fit:contain;object-position:left center;background:transparent!important;border:0!important;box-shadow:none!important;filter:drop-shadow(0 0 15px rgba(76,179,255,.20))}
      .brand.logo-ready .brand-logo-clean{display:block}
      .footer-brand{width:300px!important;height:78px!important;flex-basis:300px!important}
      .footer-brand .brand-logo-clean{width:300px;height:78px}
      @media(max-width:1020px){.site-header .brand{width:238px!important;height:64px!important;flex-basis:238px!important}.brand-logo-clean{width:238px;height:64px}}
      @media(max-width:650px){.site-header{min-height:76px}.site-header .brand{width:188px!important;height:54px!important;flex-basis:188px!important}.brand-logo-clean{width:188px;height:54px}.footer-brand{width:220px!important;height:64px!important;flex-basis:220px!important}.footer-brand .brand-logo-clean{width:220px;height:64px}}
    `;
    document.head.appendChild(style);
    const source=new Image();
    source.decoding='async';
    source.src='/assets/atechspot-logo.png?v=20260911-transparent';
    source.onload=()=>{
      try{
        const canvas=document.createElement('canvas');
        const max=900;
        const scale=Math.min(1,max/source.naturalWidth,max/source.naturalHeight);
        canvas.width=Math.max(1,Math.round(source.naturalWidth*scale));
        canvas.height=Math.max(1,Math.round(source.naturalHeight*scale));
        const ctx=canvas.getContext('2d',{willReadFrequently:true});
        ctx.drawImage(source,0,0,canvas.width,canvas.height);
        const image=ctx.getImageData(0,0,canvas.width,canvas.height),d=image.data,W=canvas.width,H=canvas.height;
        const visited=new Uint8Array(W*H),queue=new Int32Array(W*H);let head=0,tail=0;
        const nearWhite=i=>{const r=d[i],g=d[i+1],b=d[i+2];return r>214&&g>214&&b>214&&Math.max(r,g,b)-Math.min(r,g,b)<32};
        const push=(x,y)=>{const pos=y*W+x;if(visited[pos])return;const i=pos*4;if(!nearWhite(i))return;visited[pos]=1;queue[tail++]=pos};
        for(let x=0;x<W;x++){push(x,0);push(x,H-1)}
        for(let y=1;y<H-1;y++){push(0,y);push(W-1,y)}
        while(head<tail){const pos=queue[head++],x=pos%W,y=(pos/W)|0;d[pos*4+3]=0;if(x>0)push(x-1,y);if(x+1<W)push(x+1,y);if(y>0)push(x,y-1);if(y+1<H)push(x,y+1)}
        ctx.putImageData(image,0,0);
        let minX=W,minY=H,maxX=-1,maxY=-1;
        for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(d[(y*W+x)*4+3]>12){if(x<minX)minX=x;if(y<minY)minY=y;if(x>maxX)maxX=x;if(y>maxY)maxY=y}
        if(maxX<minX||maxY<minY)throw new Error('Logo bounds unavailable');
        const pad=Math.max(6,Math.round(Math.max(maxX-minX,maxY-minY)*.025));
        minX=Math.max(0,minX-pad);minY=Math.max(0,minY-pad);maxX=Math.min(W-1,maxX+pad);maxY=Math.min(H-1,maxY+pad);
        const out=document.createElement('canvas');out.width=maxX-minX+1;out.height=maxY-minY+1;
        out.getContext('2d').drawImage(canvas,minX,minY,out.width,out.height,0,0,out.width,out.height);
        const transparentLogo=out.toDataURL('image/png');
        document.querySelectorAll('.brand').forEach(brand=>{let img=brand.querySelector('.brand-logo-clean');if(!img){img=document.createElement('img');img.className='brand-logo-clean';img.alt='ATechSpot';img.decoding='async';brand.prepend(img)}img.src=transparentLogo;brand.classList.add('logo-ready')});
      }catch(err){console.warn('ATechSpot transparent logo fallback active.',err)}
    };
  }

  function enforcePrimaryCtas(){
    document.querySelectorAll('.site-header .desktop-cta').forEach(a=>{a.href='/intake/';a.textContent='Start My Project'});
    if(normalizedPath(location.pathname)!=='/')return;
    const heroPrimary=document.querySelector('.hero-actions .btn-primary');
    if(heroPrimary){heroPrimary.href='/intake/';heroPrimary.textContent='Start My Project →'}
    const growthPrimary=document.querySelector('.growth-copy .btn-primary');
    if(growthPrimary){growthPrimary.href='/assessment/';growthPrimary.textContent='Start With My Business Assessment'}
  }

  function wireLivePayments(){
    if(normalizedPath(location.pathname)!=='/services/')return;
    document.querySelectorAll('.price').forEach(card=>{
      const title=(card.querySelector('h3')?.textContent||'').trim();
      const link=card.querySelector('a');
      if(!link)return;
      if(title==='Executive Growth Review'){
        link.href=LIVE_PAYMENTS.executiveReview;
        link.textContent='Book securely with Stripe →';
        link.setAttribute('aria-label','Book the $997 Executive Growth Review securely with Stripe');
        link.dataset.livePayment='true';
        const note=document.createElement('p');note.className='payment-disclosure';note.style.cssText='margin-top:10px;font-size:.78rem;line-height:1.5;color:#8fa5b7';note.innerHTML='One-time $997 charge. Review <a href="/payments/" style="color:#65dff0">Payments & Billing</a> and <a href="/terms/" style="color:#65dff0">Terms</a> before checkout.';card.appendChild(note);
      }
      if(title==='Project Build'){
        link.href='/intake/';link.textContent='Get written scope & pricing →';
      }
      if(title==='GrowthCare'){
        link.href='/intake/?service=GrowthCare';link.textContent='Apply for GrowthCare →';
        const note=document.createElement('p');note.className='payment-disclosure';note.style.cssText='margin-top:10px;font-size:.78rem;line-height:1.5;color:#8fa5b7';note.textContent='Recurring billing starts only after written scope and monthly pricing are confirmed.';card.appendChild(note);
      }
    });
  }

  function contactRouteFromEmailHref(href){try{const raw=String(href||'');if(!raw.toLowerCase().startsWith('mailto:'))return null;const [addressPart,query='']=raw.slice(7).split('?');let local=(decodeURIComponent(addressPart||'').trim().toLowerCase().split('@')[0]||'hello');const aliases={partnerships:'hello',operations:'hello',info:'hello',contact:'hello'};local=aliases[local]||local;const allowed=new Set(['jason','hello','sales','support','billing','legal']);const department=allowed.has(local)?local:'hello';const source=new URLSearchParams(query),params=new URLSearchParams();params.set('department',department);if(source.get('subject'))params.set('subject',source.get('subject'));return `/contact/?${params.toString()}#contact-form`}catch{return '/contact/'}}

  ensureGa4();ensureTransparentCorporateLogo();normalizeRoutes();ensureSkipLink();ensureAccessibleHeader();enforcePrimaryCtas();wireLivePayments();
  document.addEventListener('click',event=>{const link=event.target.closest&&event.target.closest('a[href^="mailto:"]');if(!link)return;const route=contactRouteFromEmailHref(link.getAttribute('href'));if(!route)return;event.preventDefault();location.href=route},true);

  function formPayload(form){const data=Object.fromEntries(new FormData(form).entries());if(form.dataset.formType)data['Form Type']=form.dataset.formType;return data}
  async function sendWebsiteForm(form){const endpoint=form.dataset.endpoint||'/api/contact',options={method:'POST',headers:{'content-type':'application/json','accept':'application/json'},body:JSON.stringify(formPayload(form)),credentials:'same-origin'};let response=await fetch(endpoint,options);if(response.status===404&&endpoint.startsWith('/api/')&&location.hostname==='www.atechspot.com'){response=await fetch(`https://atechspot.pages.dev${endpoint}`,{...options,credentials:'omit'})}let result={};try{result=await response.json()}catch{}if(!response.ok){const error=new Error(result.message||`Form delivery failed (${response.status}).`);error.status=response.status;throw error}return result}
  function trackFormSuccess(form){const formType=form.dataset.formType||'ATechSpot Website Form';if(typeof window.gtag==='function'){window.gtag('event','form_submit_success',{form_type:formType,page_location:location.href});window.gtag('event','generate_lead',{form_type:formType,page_location:location.href})}if(typeof window.clarity==='function')window.clarity('event','form_submit_success')}
  function wireForm(form){if(form.dataset.formWired)return;form.dataset.formWired='true';const started=form.querySelector('input[name="form_started_at"]');if(started)started.value=String(Date.now());form.addEventListener('submit',async event=>{event.preventDefault();if(!form.reportValidity())return;const status=form.querySelector('[data-status]');const button=form.querySelector('button[type="submit"]');const original=button?.textContent||'';if(status){status.textContent='Sending your request securely…';status.removeAttribute('data-error')}if(button){button.disabled=true;button.setAttribute('aria-busy','true');button.textContent='Sending…'}try{const result=await sendWebsiteForm(form);trackFormSuccess(form);if(status)status.textContent=result.message||'Thank you. Your request was received successfully.';const successUrl=form.dataset.successUrl;if(successUrl){location.assign(successUrl);return}form.reset();if(started)started.value=String(Date.now())}catch(error){console.error('ATechSpot form delivery error',error);if(status){status.textContent='We could not send the form right now. Please try again shortly or call (713) 396-2993.';status.setAttribute('data-error','true')}}finally{if(button){button.disabled=false;button.removeAttribute('aria-busy');button.textContent=original}}})}
  document.querySelectorAll('[data-email-form],[data-secure-form]').forEach(wireForm);

  const params=new URLSearchParams(location.search);const service=params.get('service'),meeting=params.get('meeting'),topic=params.get('topic'),department=params.get('department'),subject=params.get('subject');
  if(service)document.querySelectorAll('select[name="Service"]').forEach(select=>{const match=[...select.options].find(o=>o.value===service||o.textContent.trim()===service);if(match)select.value=match.value});
  if(meeting)document.querySelectorAll('select[name="Preferred Meeting"]').forEach(select=>{const match=[...select.options].find(o=>o.value===meeting||o.textContent.includes(meeting));if(match)select.value=match.value});
  if(topic){document.querySelectorAll('input[name="Topic"]').forEach(input=>input.value=topic);document.querySelectorAll('select[name="Topic"]').forEach(select=>{const value=topic.trim().toLowerCase();const match=[...select.options].find(o=>o.value.trim().toLowerCase()===value||o.textContent.trim().toLowerCase()===value);if(match)select.value=match.value})}
  if(department)document.querySelectorAll('select[name="Department"]').forEach(select=>{const match=[...select.options].find(o=>o.value===department);if(match)select.value=match.value});
  if(subject)document.querySelectorAll('input[name="Subject"]').forEach(input=>input.value=subject);
  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
  document.querySelectorAll('a[href="https://store.bookbaby.com/profile/abc"]').forEach(link=>link.href='https://store.bookbaby.com/book/a-techucations-abcs-of-technology');

  if(!reduceMotion){document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',()=>{}))}
})();