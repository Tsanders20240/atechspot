
const toggle=document.querySelector(".mobile-toggle"),menu=document.querySelector(".menu");
if(toggle&&menu)toggle.addEventListener("click",()=>{const o=menu.classList.toggle("open");toggle.setAttribute("aria-expanded",String(o));});
document.querySelectorAll("[data-year]").forEach(e=>e.textContent=new Date().getFullYear());

document.querySelectorAll("form[data-secure-form]").forEach(form=>{
  const started=form.querySelector('input[name="form_started_at"]');
  if(started)started.value=String(Date.now());

  form.addEventListener("submit",async e=>{
    e.preventDefault();
    const status=form.querySelector("[data-status]");
    const button=form.querySelector('button[type="submit"],button:not([type])');
    if(!form.reportValidity()) return;

    status.textContent="Verifying and sending your request…";
    if(button){button.disabled=true;button.dataset.original=button.textContent;button.textContent="Sending…";}

    const payload=Object.fromEntries(new FormData(form).entries());
    payload.form_type=form.dataset.formType||document.title;

    try{
      const response=await fetch("/api/submit",{
        method:"POST",
        headers:{"content-type":"application/json","accept":"application/json"},
        body:JSON.stringify(payload)
      });
      const result=await response.json();
      status.textContent=result.message||"The request could not be sent.";
      if(response.ok){
        form.reset();
        if(started)started.value=String(Date.now());
        if(window.turnstile)window.turnstile.reset();
        status.textContent="Thank you. Your verified request was sent successfully. A+ Techucation will review it before any payment or appointment step.";
      }
    }catch{
      status.textContent="The secure form service is temporarily unavailable. Please call (713) 396-2993 or email aplustechucation@gmail.com.";
    }finally{
      if(button){button.disabled=false;button.textContent=button.dataset.original||"Submit";}
    }
  });
});
