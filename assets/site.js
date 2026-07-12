
function buildEmailFallback(form){
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
    "The website form could not send automatically.\n\n" +
    lines.join("\n") +
    "\n\nPlease do not include passwords, Social Security numbers, or full account numbers."
  );

  return `mailto:aplustechucation@gmail.com?subject=${subject}&body=${body}`;
}

document.querySelectorAll("[data-email-form]").forEach(form=>{
  const started = form.querySelector('input[name="form_started_at"]');
  if (started) started.value = String(Date.now());

  form.addEventListener("submit", async event=>{
    event.preventDefault();
    if (!form.reportValidity()) return;

    const status = form.querySelector("[data-status]");
    const button = form.querySelector('button[type="submit"]');
    const endpoint = form.dataset.endpoint;

    if (status) status.textContent = "Sending your request…";
    if (button) button.disabled = true;

    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {"content-type":"application/json"},
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Unable to send.");

      if (status) status.textContent = result.message || "Thank you. Your request was sent successfully.";
      form.reset();
      if (started) started.value = String(Date.now());
    } catch (error) {
      if (status) {
        status.innerHTML =
          'Automatic delivery is unavailable. <a href="' +
          buildEmailFallback(form) +
          '">Open the prefilled email backup</a>.';
      }
    } finally {
      if (button) button.disabled = false;
    }
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
