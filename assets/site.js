function contactRouteFromEmailHref(href){
  try{
    const raw=String(href||'');
    if(!raw.toLowerCase().startsWith('mailto:')) return null;
    const withoutScheme=raw.slice(7);
    const [addressPart,query='']=withoutScheme.split('?');
    const address=decodeURIComponent(addressPart||'').trim().toLowerCase();
    const local=(address.split('@')[0]||'jason').toLowerCase();
    const allowed=new Set(['jason','support','partnerships','operations','legal']);
    const department=allowed.has(local)?local:'jason';
    const sourceParams=new URLSearchParams(query);
    const params=new URLSearchParams();
    params.set('department',department);
    const subject=sourceParams.get('subject');
    if(subject) params.set('subject',subject);
    return `/contact.html?${params.toString()}`;
  }catch{return '/contact.html';}
}

// Keep ATechSpot correspondence inside the website instead of launching a device email app.
document.addEventListener('click',event=>{
  const link=event.target.closest&&event.target.closest('a[href^="mailto:"]');
  if(!link) return;
  const route=contactRouteFromEmailHref(link.getAttribute('href'));
  if(!route) return;
  event.preventDefault();
  window.location.href=route;
},true);

function formPayload(form){
  return Object.fromEntries(new FormData(form).entries());
}

async function sendWebsiteForm(form){
  const endpoint=form.dataset.endpoint||'/api/contact';
  const response=await fetch(endpoint,{
    method:'POST',
    headers:{'content-type':'application/json'},
    body:JSON.stringify(formPayload(form))
  });
  let result={};
  try{result=await response.json();}catch{}
  if(!response.ok) throw new Error(result.message||`Form delivery failed (${response.status}).`);
  return result;
}

document.querySelectorAll('[data-email-form]').forEach(form=>{
  const started=form.querySelector('input[name="form_started_at"]');
  if(started) started.value=String(Date.now());

  form.addEventListener('submit',async event=>{
    event.preventDefault();
    if(!form.reportValidity()) return;
    const status=form.querySelector('[data-status]');
    const button=form.querySelector('button[type="submit"]');
    if(status) status.textContent='Sending your request…';
    if(button) button.disabled=true;
    try{
      const result=await sendWebsiteForm(form);
      if(status) status.textContent=result.message||'Thank you. Your request was sent successfully.';
      form.reset();
      if(started) started.value=String(Date.now());
    }catch(error){
      if(status){
        status.innerHTML=`${error.message} Please use the <a href="/contact.html">ATechSpot contact page</a> or call (713) 396-2993.`;
      }
    }finally{
      if(button) button.disabled=false;
    }
  });
});

const toggle=document.querySelector('.mobile-toggle'),menu=document.querySelector('.menu');
if(toggle&&menu)toggle.addEventListener('click',()=>{const o=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',String(o));});
document.querySelectorAll('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());

document.querySelectorAll('[data-event]').forEach(link=>{
  link.addEventListener('click',()=>{
    const eventName=link.dataset.event;
    if(typeof window.gtag==='function')window.gtag('event',eventName,{link_text:(link.textContent||'').trim(),page_location:window.location.href});
    if(typeof window.clarity==='function')window.clarity('event',eventName);
  });
});

document.querySelectorAll('.meeting-choice').forEach(link=>{
  link.addEventListener('click',()=>{
    const select=document.querySelector('#preferred-meeting');
    if(select){
      const desired=link.dataset.meeting||'';
      const match=[...select.options].find(o=>o.value===desired||o.textContent.includes(desired));
      if(match)select.value=match.value;
    }
  });
});

const params=new URLSearchParams(window.location.search);
const service=params.get('service');
const meeting=params.get('meeting');
const topic=params.get('topic');
const department=params.get('department');
const subject=params.get('subject');
if(service){
  document.querySelectorAll('select[name="Service"]').forEach(select=>{
    const match=[...select.options].find(o=>o.value===service||o.textContent===service);
    if(match)select.value=match.value;
  });
}
if(meeting){
  document.querySelectorAll('select[name="Preferred Meeting"]').forEach(select=>{
    const match=[...select.options].find(o=>o.value===meeting||o.textContent.includes(meeting));
    if(match)select.value=match.value;
  });
}
if(topic)document.querySelectorAll('input[name="Topic"]').forEach(input=>input.value=topic);
if(department){
  document.querySelectorAll('select[name="Department"]').forEach(select=>{
    const match=[...select.options].find(o=>o.value===department);
    if(match)select.value=match.value;
  });
}
if(subject)document.querySelectorAll('input[name="Subject"]').forEach(input=>input.value=subject);

const intakeService=params.get('service');
if(intakeService){
  const serviceSelect=document.querySelector('#service-requested');
  if(serviceSelect){
    const match=[...serviceSelect.options].find(option=>option.value===intakeService||option.textContent.trim()===intakeService);
    if(match)serviceSelect.value=match.value;
  }
}

// Previously these forms opened a mail client. They now use the same website delivery endpoint.
document.querySelectorAll('[data-secure-form]').forEach(form=>{
  const started=form.querySelector('input[name="form_started_at"]');
  if(started)started.value=String(Date.now());
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    const data=formPayload(form);
    if(String(data.website||'').trim())return;
    const status=form.querySelector('[data-status]');
    const button=form.querySelector('button[type="submit"]');
    if(status)status.textContent='Sending your request…';
    if(button)button.disabled=true;
    try{
      const result=await sendWebsiteForm(form);
      if(status)status.textContent=result.message||'Thank you. Your request was sent successfully.';
      form.reset();
      if(started)started.value=String(Date.now());
    }catch(error){
      if(status)status.innerHTML=`${error.message} Please use the <a href="/contact.html">ATechSpot contact page</a> or call (713) 396-2993.`;
    }finally{
      if(button)button.disabled=false;
    }
  });
});
