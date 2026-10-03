"use strict";
const looks = [{"src": "/assets/portfolio/look-01.webp", "alt": "Red satin slit gown, straight black hair and green eyes \u2014 AI fashion concept", "width": 899, "height": 1600}, {"src": "/assets/portfolio/look-02.webp", "alt": "Emerald tailored suit with long brunette hair \u2014 AI fashion concept", "width": 1024, "height": 1536}, {"src": "/assets/portfolio/look-03.webp", "alt": "Cobalt tailored suit with long black waves \u2014 AI fashion concept", "width": 1024, "height": 1536}, {"src": "/assets/portfolio/look-04.webp", "alt": "Gold trouser suit with straight black hair \u2014 AI fashion concept", "width": 1086, "height": 1448}, {"src": "/assets/portfolio/look-05.webp", "alt": "Black sleeveless jumpsuit with platinum pixie curls \u2014 AI fashion concept", "width": 1024, "height": 1536}, {"src": "/assets/portfolio/look-06.webp", "alt": "Black menswear suit with ivory shirt \u2014 AI fashion concept", "width": 1024, "height": 1536}, {"src": "/assets/portfolio/look-07.webp", "alt": "Athletic platinum-haired model in a black tailored jumpsuit \u2014 AI fashion concept", "width": 1024, "height": 1536}, {"src": "/assets/portfolio/look-08.webp", "alt": "Red catsuit, back view with head turned toward the camera \u2014 AI fashion concept", "width": 899, "height": 1600}, {"src": "/assets/portfolio/look-09.webp", "alt": "White asymmetric evening gown \u2014 AI fashion concept", "width": 1086, "height": 1448}, {"src": "/assets/portfolio/look-10.webp", "alt": "Ivory fitted catsuit \u2014 AI fashion concept", "width": 1086, "height": 1448}, {"src": "/assets/portfolio/look-11.webp", "alt": "White tailored trouser suit \u2014 AI fashion concept", "width": 1086, "height": 1448}, {"src": "/assets/portfolio/look-12.webp", "alt": "Navy catsuit with braided hair \u2014 AI fashion concept", "width": 1086, "height": 1448}, {"src": "/assets/portfolio/look-13.webp", "alt": "Cobalt evening gown \u2014 AI fashion concept", "width": 1024, "height": 1536}, {"src": "/assets/portfolio/look-14.webp", "alt": "Gold pleated maxi dress \u2014 AI fashion concept", "width": 1024, "height": 1536}, {"src": "/assets/portfolio/look-15.webp", "alt": "Bronze satin dress with jacket \u2014 AI fashion concept", "width": 1024, "height": 1536}, {"src": "/assets/portfolio/look-16.webp", "alt": "Coral tailored suit \u2014 AI fashion concept", "width": 1024, "height": 1536}, {"src": "/assets/portfolio/look-17.webp", "alt": "Silver evening gown \u2014 AI fashion concept", "width": 1024, "height": 1536}];
const intro = document.getElementById("intro");
const site = document.getElementById("site");
const logo = document.getElementById("logo3d");
const label = document.getElementById("slideLabel");
const progress = document.getElementById("slideProgress");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let slide = 0;
let timer;
function showSlide() {
  label.textContent = String(slide + 1).padStart(2, "0") + " / 17 · FASHION CONCEPTS";
  progress.style.width = ((slide + 1) / looks.length * 100) + "%";
  logo.style.setProperty("--p1", ["#eee9df", "#dc3535", "#c0a86e"][slide % 3]);
  logo.style.setProperty("--p2", "#777");
  slide = (slide + 1) % looks.length;
}
function enterSite(focusHero = false) {
  clearInterval(timer);
  intro.hidden = true;
  site.inert = false;
  if (focusHero) {
    const heading = document.querySelector("h1");
    heading.tabIndex = -1;
    heading.focus({preventScroll: true});
    document.getElementById("top").scrollIntoView({behavior: reducedMotion ? "instant" : "smooth"});
  }
}
if (!location.hash) {
  intro.hidden = false;
  site.inert = true;
  requestAnimationFrame(() => intro.classList.add("logo-ready"));
  showSlide();
  if (!reducedMotion) timer = setInterval(showSlide, 1600);
}
document.getElementById("enterSite").addEventListener("click", () => enterSite(true));
window.addEventListener("hashchange", () => enterSite());
const menu = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
function closeMenu() { nav.classList.remove("open"); menu.setAttribute("aria-expanded", "false"); }
menu.addEventListener("click", () => menu.setAttribute("aria-expanded", String(nav.classList.toggle("open"))));
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
const dialog = document.getElementById("portraitDialog");
const portrait = document.getElementById("portraitImage");
let currentLook = 0;
function showPortrait(index) {
  currentLook = (index + looks.length) % looks.length;
  portrait.src = looks[currentLook].src;
  portrait.alt = looks[currentLook].alt;
  document.getElementById("portraitCount").textContent = (currentLook + 1) + " / " + looks.length + " · AI fashion concept";
}
document.querySelectorAll("[data-look]").forEach(button => button.addEventListener("click", () => {
  showPortrait(Number(button.dataset.look));
  dialog.showModal();
  document.body.classList.add("portrait-open");
}));
dialog.querySelector(".portrait-close").addEventListener("click", () => dialog.close());
dialog.querySelector(".portrait-prev").addEventListener("click", () => showPortrait(currentLook - 1));
dialog.querySelector(".portrait-next").addEventListener("click", () => showPortrait(currentLook + 1));
dialog.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    e.preventDefault();
    showPortrait(currentLook + (e.key === "ArrowRight" ? 1 : -1));
  }
});
dialog.addEventListener("click", e => { if (e.target === dialog) dialog.close(); });
dialog.addEventListener("close", () => document.body.classList.remove("portrait-open"));
