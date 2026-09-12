(()=>{
  const form=document.getElementById('universalIntake');
  if(!form)return;

  const panels=[...form.querySelectorAll('.intake-panel')];
  const steps=[...document.querySelectorAll('#intakeSteps li')];
  const back=document.getElementById('intakeBack');
  const next=document.getElementById('intakeNext');
  const submit=document.getElementById('intakeSubmit');
  const progress=document.getElementById('intakeProgress');
  const status=form.querySelector('[data-status]');
  const started=form.querySelector('input[name="form_started_at"]');
  let current=0;
  let sending=false;

  // Always use the production same-origin API. Never hand the lead off to a mail client.
  form.dataset.endpoint='/api/intake';
  if(started)started.value=String(Date.now());

  const field=name=>form.elements.namedItem(name);
  const value=name=>{const item=field(name);if(!item)return'';if(typeof item.value==='string')return item.value.trim();return[...item].find(input=>input.checked)?.value||''};
  const safe=text=>String(text||'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  function validate(){
    const error=panels[current]?.querySelector('[data-panel-error]');
    for(const input of panels[current].querySelectorAll('[required]')){
      if(!input.checkValidity()){
        if(error)error.textContent=current===0?'Choose a starting point to continue.':'Complete the required fields to continue.';
        input.reportValidity();
        return false;
      }
    }
    if(error)error.textContent='';
    return true;
  }

  function recommendation(){
    const goal=value('Topic'),budget=value('Budget Range');
    if(budget.includes('low-cost')||goal.includes('Learn AI'))return['AI Readiness & Learning Plan','A guided skills assessment will identify the right coaching, class or self-paced learning path.'];
    if(goal.includes('Executive')||budget.includes('$5,000')||budget.includes('$15,000'))return['Executive Growth Review','A deeper strategy review will prioritize the revenue, technology and operating systems to address first.'];
    if(/Website|App|Automation|Software|Launch/.test(goal))return['Project Discovery Assessment','We’ll clarify requirements, recommend a build path and prepare the right scope before development begins.'];
    return['ATechSpot Discovery Assessment','We’ll review your goals, identify the best ecosystem path and reply with the next practical step.'];
  }

  function buildReview(){
    const rec=recommendation();
    document.getElementById('recommendationTitle').textContent=rec[0];
    document.getElementById('recommendationCopy').textContent=rec[1];
    const rows=[['Ecosystem path',value('Ecosystem Path')],['Primary goal',value('Topic')],['Main outcome',value('Primary Business Outcome')],['Current stage',value('Current Stage')],['Timeline',value('Preferred Timeframe')],['Investment',value('Budget Range')],['Support preference',value('Preferred Support')],['Client',value('Full Name')],['Business',value('Business or Organization')||'Not provided'],['Email',value('Email')],['Phone',value('Phone')]];
    document.getElementById('intakeReview').innerHTML=rows.map(row=>'<div><small>'+row[0]+'</small><b>'+safe(row[1])+'</b></div>').join('');
  }

  function show(index){
    current=index;
    panels.forEach((panel,i)=>panel.classList.toggle('active',i===current));
    steps.forEach((step,i)=>{step.classList.toggle('active',i===current);step.classList.toggle('done',i<current)});
    back.hidden=current===0;
    next.hidden=current===panels.length-1;
    submit.hidden=current!==panels.length-1;
    progress.style.width=((current+1)/panels.length*100)+'%';
    if(current===panels.length-1)buildReview();
    document.getElementById('client-onboarding').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  }

  async function submitSecurely(event){
    event.preventDefault();
    event.stopImmediatePropagation();
    if(sending)return;
    if(!form.reportValidity())return;
    sending=true;
    const original=submit.textContent;
    submit.disabled=true;
    submit.setAttribute('aria-busy','true');
    submit.textContent='Sending securely…';
    if(status){status.textContent='Sending your assessment securely to ATechSpot…';status.removeAttribute('data-error')}

    const payload=Object.fromEntries(new FormData(form).entries());
    payload['Form Type']='ATechSpot Universal Client Onboarding';

    try{
      const response=await fetch('/api/intake',{
        method:'POST',
        headers:{'content-type':'application/json','accept':'application/json'},
        credentials:'same-origin',
        body:JSON.stringify(payload)
      });
      let result={};
      try{result=await response.json()}catch{}
      if(!response.ok)throw new Error(result.message||`Secure submission failed (${response.status}).`);
      if(typeof window.gtag==='function'){
        window.gtag('event','form_submit_success',{form_type:'ATechSpot Universal Client Onboarding',page_location:location.href});
        window.gtag('event','generate_lead',{form_type:'ATechSpot Universal Client Onboarding',page_location:location.href});
      }
      if(status)status.textContent=result.message||'Your assessment was received successfully.';
      location.assign('/intake/thank-you/');
    }catch(error){
      console.error('ATechSpot secure intake delivery error',error);
      if(status){status.textContent=error.message||'We could not send your assessment right now. Please try again shortly or call (713) 396-2993.';status.setAttribute('data-error','true')}
      sending=false;
      submit.disabled=false;
      submit.removeAttribute('aria-busy');
      submit.textContent=original;
    }
  }

  next.addEventListener('click',()=>{if(validate())show(current+1)});
  back.addEventListener('click',()=>show(current-1));
  // Capture phase guarantees this secure handler wins over any cached generic/mail-client fallback.
  form.addEventListener('submit',submitSecurely,true);
  show(0);
})();
