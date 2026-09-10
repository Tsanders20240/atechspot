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
    return `/contact/?${params.toString()}#contact-form`;
  }catch{return '/contact/';}
}

document.addEventListener('click',event=>{
  const link=event.target.closest&&event.target.closest('a[href^="mailto:"]');
  if(!link) return;
  const route=contactRouteFromEmailHref(link.getAttribute('href'));
  if(!route) return;
  event.preventDefault();
  window.location.href=route;
},true);

const DEPARTMENT_EMAILS={
  jason:'jason@atechspot.com',
  support:'support@atechspot.com',
  partnerships:'partnerships@atechspot.com',
  operations:'operations@atechspot.com',
  legal:'legal@atechspot.com'
};

function formPayload(form){return Object.fromEntries(new FormData(form).entries());}

function webEmailUrl(form){
  const data=formPayload(form);
  const department=String(data.Department||'jason').toLowerCase();
  const to=DEPARTMENT_EMAILS[department]||DEPARTMENT_EMAILS.jason;
  const subject=String(data.Subject||data.Topic||data.Service||form.dataset.formType||'ATechSpot Website Inquiry').trim();
  const ignored=new Set(['website','form_started_at','cf-turnstile-response']);
  const lines=[];
  Object.entries(data).forEach(([key,value])=>{
    const text=String(value??'').trim();
    if(!ignored.has(key)&&text) lines.push(`${key}: ${text}`);
  });
  lines.push('','Sent from ATechSpot.com');
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
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
  if(!response.ok){
    const error=new Error(result.message||`Form delivery failed (${response.status}).`);
    error.status=response.status;
    throw error;
  }
  return result;
}

function openWebEmailFallback(form,status){
  if(status) status.textContent='Opening your web email with this message prefilled…';
  window.location.href=webEmailUrl(form);
}

function trackFormSuccess(form){
  const formType=form.dataset.formType||'ATechSpot Website Form';
  if(typeof window.gtag==='function')window.gtag('event','form_submit_success',{form_type:formType,page_location:window.location.href});
  if(typeof window.clarity==='function')window.clarity('event','form_submit_success');
}

function wireForm(form){
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
      trackFormSuccess(form);
      form.reset();
      if(started) started.value=String(Date.now());
    }catch(error){
      openWebEmailFallback(form,status);
      return;
    }finally{
      if(button) button.disabled=false;
    }
  });
}

document.querySelectorAll('[data-email-form]').forEach(wireForm);
document.querySelectorAll('[data-secure-form]').forEach(form=>{
  if(form.matches('[data-email-form]')) return;
  wireForm(form);
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
if(service){document.querySelectorAll('select[name="Service"]').forEach(select=>{const match=[...select.options].find(o=>o.value===service||o.textContent===service);if(match)select.value=match.value;});}
if(meeting){document.querySelectorAll('select[name="Preferred Meeting"]').forEach(select=>{const match=[...select.options].find(o=>o.value===meeting||o.textContent.includes(meeting));if(match)select.value=match.value;});}
if(topic){
  document.querySelectorAll('input[name="Topic"]').forEach(input=>input.value=topic);
  document.querySelectorAll('select[name="Topic"]').forEach(select=>{
    const normalized=topic.trim().toLowerCase();
    const match=[...select.options].find(o=>o.value.trim().toLowerCase()===normalized||o.textContent.trim().toLowerCase()===normalized);
    if(match)select.value=match.value;
  });
}
if(department){document.querySelectorAll('select[name="Department"]').forEach(select=>{const match=[...select.options].find(o=>o.value===department);if(match)select.value=match.value;});}
if(subject)document.querySelectorAll('input[name="Subject"]').forEach(input=>input.value=subject);

if(service){
  const serviceSelect=document.querySelector('#service-requested');
  if(serviceSelect){const match=[...serviceSelect.options].find(option=>option.value===service||option.textContent.trim()===service);if(match)serviceSelect.value=match.value;}
}

// Replace the retired BookBaby profile URL everywhere with the current live product page.
document.querySelectorAll('a[href="https://store.bookbaby.com/profile/abc"]').forEach(link=>{
  link.href='https://store.bookbaby.com/book/a-techucations-abcs-of-technology';
});
