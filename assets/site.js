
const toggle=document.querySelector(".mobile-toggle"),menu=document.querySelector(".menu");
if(toggle&&menu)toggle.addEventListener("click",()=>{const o=menu.classList.toggle("open");toggle.setAttribute("aria-expanded",String(o));});
document.querySelectorAll("[data-year]").forEach(e=>e.textContent=new Date().getFullYear());
document.querySelectorAll("form[data-secure-form]").forEach(form=>{
 const started=form.querySelector('input[name="form_started_at"]'); if(started)started.value=String(Date.now());
 form.addEventListener("submit",async e=>{
   e.preventDefault(); if(!form.reportValidity())return;
   const status=form.querySelector("[data-status]"),btn=form.querySelector("button");
   status.textContent="Sending your request…"; btn.disabled=true; const old=btn.textContent; btn.textContent="Sending…";
   const payload=Object.fromEntries(new FormData(form).entries()); payload.form_type=form.dataset.formType||document.title;
   try{
     const r=await fetch("/api/submit",{method:"POST",headers:{"content-type":"application/json","accept":"application/json"},body:JSON.stringify(payload)});
     const result=await r.json(); status.innerHTML=result.message||'Unable to send request. Please <a href="mailto:aplustechucation@gmail.com">email us</a> or call <a href="tel:+17133962993">(713) 396-2993</a>.';
     if(r.ok){form.reset();if(started)started.value=String(Date.now());}
   }catch{status.innerHTML='Form service unavailable. Please call <a href="tel:+17133962993">(713) 396-2993</a> or email <a href="mailto:aplustechucation@gmail.com">aplustechucation@gmail.com</a>.';}
   finally{btn.disabled=false;btn.textContent=old;}
 });
});


document.querySelectorAll("[data-event]").forEach(link=>{
  link.addEventListener("click",()=>{
    const eventName=link.dataset.event;
    if(typeof window.gtag==="function"){
      window.gtag("event",eventName,{
        link_text:(link.textContent||"").trim(),
        page_location:window.location.href
      });
    }
    if(typeof window.clarity==="function"){
      window.clarity("event",eventName);
    }
  });
});


// Booking choice buttons
document.querySelectorAll(".meeting-choice").forEach(link=>{
  link.addEventListener("click",()=>{
    const select=document.querySelector("#preferred-meeting");
    if(select){
      const desired=link.dataset.meeting||"";
      const match=[...select.options].find(o=>o.value===desired || o.textContent.includes(desired));
      if(match){select.value=match.value;}
    }
  });
});

// Query-string prefills for booking/contact links
const params=new URLSearchParams(window.location.search);
const service=params.get("service");
const meeting=params.get("meeting");
const topic=params.get("topic");
if(service){
  document.querySelectorAll('select[name="Service"]').forEach(select=>{
    const match=[...select.options].find(o=>o.value===service || o.textContent===service);
    if(match)select.value=match.value;
  });
}
if(meeting){
  document.querySelectorAll('select[name="Preferred Meeting"]').forEach(select=>{
    const match=[...select.options].find(o=>o.value===meeting || o.textContent.includes(meeting));
    if(match)select.value=match.value;
  });
}
if(topic){
  document.querySelectorAll('input[name="Topic"]').forEach(input=>input.value=topic);
}
