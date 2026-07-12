
function submitByEmail(form){
  const data = Object.fromEntries(new FormData(form).entries());
  const ignored = new Set(["website","form_started_at","cf-turnstile-response"]);
  const lines = [];

  Object.entries(data).forEach(([key,value])=>{
    const text = String(value ?? "").trim();
    if (!ignored.has(key) && text) lines.push(`${key}: ${text}`);
  });

  const subject = encodeURIComponent(
    `[AtechSpot Website] ${form.dataset.formType || "Customer Request"}`
  );

  const body = encodeURIComponent(
    "New request from AtechSpot.com\n\n" +
    lines.join("\n") +
    "\n\nSecurity reminder: Do not include passwords, Social Security numbers, or full account numbers."
  );

  window.location.href =
    `mailto:aplustechucation@gmail.com?subject=${subject}&body=${body}`;
}

document.querySelectorAll("[data-secure-form]").forEach(form=>{
  const started = form.querySelector('input[name="form_started_at"]');
  if (started) started.value = String(Date.now());

  form.addEventListener("submit", event=>{
    event.preventDefault();

    const status = form.querySelector("[data-status]");
    const honeypot = form.querySelector('input[name="website"]');

    if (honeypot && honeypot.value.trim()) {
      if (status) status.textContent = "Thank you.";
      return;
    }

    if (!form.reportValidity()) return;

    if (status) {
      status.textContent =
        "Opening your email app with the request filled in. Review it, then press Send.";
    }

    submitByEmail(form);
  });
});





const toggle=document.querySelector(".mobile-toggle"),menu=document.querySelector(".menu");
if(toggle&&menu)toggle.addEventListener("click",()=>{const o=menu.classList.toggle("open");toggle.setAttribute("aria-expanded",String(o));});
document.querySelectorAll("[data-year]").forEach(e=>e.textContent=new Date().getFullYear());



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
