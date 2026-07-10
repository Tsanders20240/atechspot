
const toggle=document.querySelector(".mobile-toggle"),menu=document.querySelector(".menu");
if(toggle&&menu)toggle.addEventListener("click",()=>{const o=menu.classList.toggle("open");toggle.setAttribute("aria-expanded",String(o));});
document.querySelectorAll("[data-year]").forEach(e=>e.textContent=new Date().getFullYear());
document.querySelectorAll("form[data-secure-form]").forEach(form=>{
 const started=form.querySelector('input[name="form_started_at"]'); if(started)started.value=String(Date.now());
 form.addEventListener("submit",async e=>{
   e.preventDefault(); if(!form.reportValidity())return;
   const status=form.querySelector("[data-status]"),btn=form.querySelector("button");
   status.textContent="Verifying and sending your request…"; btn.disabled=true; const old=btn.textContent; btn.textContent="Sending…";
   const payload=Object.fromEntries(new FormData(form).entries()); payload.form_type=form.dataset.formType||document.title;
   try{
     const r=await fetch("/api/submit",{method:"POST",headers:{"content-type":"application/json","accept":"application/json"},body:JSON.stringify(payload)});
     const result=await r.json(); status.textContent=result.message||"Unable to send request.";
     if(r.ok){form.reset();if(started)started.value=String(Date.now());if(window.turnstile)window.turnstile.reset();}
   }catch{status.textContent="Secure form service unavailable. Please call (713) 396-2993 or email aplustechucation@gmail.com.";}
   finally{btn.disabled=false;btn.textContent=old;}
 });
});
