
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
    "Automatic website delivery was unavailable.\n\n" +
    lines.join("\n") +
    "\n\nDo not include passwords, Social Security numbers, or full account numbers."
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

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {"content-type":"application/json"},
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries()))
      });

      let result = {};
      try { result = await response.json(); } catch {}

      if (!response.ok) {
        throw new Error(result.message || `Form delivery failed (${response.status}).`);
      }

      if (status) status.textContent =
        result.message || "Thank you. Your request was emailed successfully.";

      form.reset();
      if (started) started.value = String(Date.now());
    } catch (error) {
      if (status) {
        status.innerHTML =
          `${error.message} ` +
          `<a href="${buildEmailFallback(form)}">Open the prefilled email backup</a>.`;
      }
    } finally {
      if (button) button.disabled = false;
    }
  });
});

// V21 shared Apple-style category navigation
const mainHeader=document.querySelector(".header");
if(mainHeader&&!document.querySelector(".v21-tabs")){
  const current=location.pathname.replace(/\/$/,"")||"/";
  const tabs=[
    ["AI","/ai-readiness"],["Websites","/website-development"],["Business","/business"],
    ["Remote Support","/remote-support"],["Data Recovery","/data-recovery"],
    ["Learning","/learning"],["Accessibility","/accessibility-support"],["Start Intake","/intake"]
  ];
  const tabLinks=tabs.map(([label,href])=>`<a href="${href}"${current===href?' aria-current="true"':''}>${label}</a>`).join("");
  mainHeader.insertAdjacentHTML("afterend",`<nav class="v21-tabs" aria-label="Technology categories"><div class="container v21-tabs-inner">${tabLinks}</div></nav><div class="v21-announcement">Not sure which service fits? Start with a short, human-reviewed intake. <a href="/intake">Get a recommendation ›</a></div>`);
}

// V21 revenue funnel added to informational pages without changing their content
const pageMain=document.querySelector("main");
const excludedPages=["/","/intake","/contact","/booking","/payment","/privacy","/terms","/accessibility"];
const normalizedPath=location.pathname.replace(/\/$/,"")||"/";
if(pageMain&&!excludedPages.includes(normalizedPath)&&!pageMain.querySelector(".v21-page-cta")){
  pageMain.insertAdjacentHTML("beforeend",`<section class="v21-page-cta"><div class="container"><h2>Move from information to action.</h2><p>Tell us the outcome you want. Your request is reviewed for fit, scope, timing and the most useful next step before payment or booking.</p><div class="actions" style="justify-content:center"><a class="button primary" href="/intake">Start My Intake</a><a class="button secondary" href="/contact">Ask a Question</a></div></div></section>`);
}

// V19 service finder
const serviceFinder = document.querySelector("[data-service-finder]");
if (serviceFinder) {
  const select = serviceFinder.querySelector("select");
  const result = serviceFinder.querySelector("[data-finder-result]");
  const title = result?.querySelector("strong");
  const copy = result?.querySelector("span");
  const link = result?.querySelector("a");
  const routes = {
    customers:["Business Technology Audit","Map your website, leads, booking and follow-up before investing.","/business-audit"],
    website:["Website Development","Improve your message, mobile experience, lead capture and conversion path.","/website-development"],
    automate:["AI & Automation Planning","Identify repetitive work and build a practical human-reviewed workflow.","/ai-readiness"],
    support:["Technology Support","Start with a structured intake so the right support path is clear.","/remote-support"],
    learn:["AI Training","Build confident, responsible AI skills for work, business or everyday use.","/ai-training"],
    accessible:["Accessibility Support","Create a more usable technology setup around individual access needs.","/accessibility-support"]
  };
  select?.addEventListener("change",()=>{
    const match=routes[select.value];
    if(!match||!result)return result?.classList.remove("show");
    title.textContent=match[0];copy.textContent=match[1];link.href=match[2];result.classList.add("show");
  });
}

// V19 conversion helpers
if (!document.querySelector(".v19-mobile-cta")) {
  document.body.insertAdjacentHTML("beforeend",`<div class="v19-mobile-cta" aria-label="Quick actions"><a class="button secondary" href="tel:+17133962993">Call</a><a class="button primary" href="/intake">Start Intake</a></div><button class="v19-backtop" type="button" aria-label="Back to top">↑</button>`);
}
const backTop=document.querySelector(".v19-backtop");
window.addEventListener("scroll",()=>backTop?.classList.toggle("show",window.scrollY>700),{passive:true});
backTop?.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));











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


// Prefill the universal intake service from links such as /intake?service=Website%20Design
const intakeParams = new URLSearchParams(window.location.search);
const intakeService = intakeParams.get("service");
if (intakeService) {
  const serviceSelect = document.querySelector("#service-requested");
  if (serviceSelect) {
    const match = [...serviceSelect.options].find(
      option => option.value === intakeService || option.textContent.trim() === intakeService
    );
    if (match) serviceSelect.value = match.value;
  }
}
