const looks=[
["Agency-Ready Headshot","#2c5cff","#101b48","https://images.unsplash.com/photo-1771919364536-cbf77acf749d?auto=format&fit=crop&w=1600&q=85"],
["Tailored Suit Editorial","#5a351f","#c7a684","https://images.unsplash.com/photo-1758613654216-ea195d4382f7?auto=format&fit=crop&w=1600&q=85"],
["Clean Beauty","#692b50","#e8b7ce","https://images.unsplash.com/photo-1779207383748-a9b036a9cfb0?auto=format&fit=crop&w=1600&q=85"],
["Street Style","#1f252a","#8b9298","https://images.unsplash.com/photo-1771012265579-eef6d075777f?auto=format&fit=crop&w=1600&q=85"],
["Evening Editorial","#391525","#bd274d","https://images.unsplash.com/photo-1767036841826-94cce831c2fb?auto=format&fit=crop&w=1600&q=85"],
["Denim Commercial","#214c72","#8db9db","https://images.unsplash.com/photo-1758613654186-6ce234bf94ab?auto=format&fit=crop&w=1600&q=85"],
["Monochrome Portrait","#111","#777","https://images.unsplash.com/photo-1758613653298-738e98658e31?auto=format&fit=crop&w=1600&q=85"],
["Movement Study","#8c351c","#f0a04b","https://images.unsplash.com/photo-1670108527641-953bb97d5341?auto=format&fit=crop&w=1600&q=85"],
["Creative Beauty","#2f135c","#9c72e8","https://images.unsplash.com/photo-1768818536330-62ae6edf84ba?auto=format&fit=crop&w=1600&q=85"],
["Lifestyle Campaign","#2f5836","#bed5a4","https://images.unsplash.com/photo-1579983880984-a202306861b7?auto=format&fit=crop&w=1600&q=85"],
["Full-Length Studio","#252525","#d6d2c9","https://images.unsplash.com/photo-1654028859265-0e8b12a67aae?auto=format&fit=crop&w=1600&q=85"],
["Business Fashion","#273b63","#aebbd6","https://images.unsplash.com/photo-1632991727906-8386e1388975?auto=format&fit=crop&w=1600&q=85"],
["Color Story","#b51e39","#f0b325","https://images.unsplash.com/photo-1758613654311-a9138846d52f?auto=format&fit=crop&w=1600&q=85"],
["Beauty Close-Up","#613b24","#e6c3a0","https://images.unsplash.com/photo-1650118653784-282e6d9643e4?auto=format&fit=crop&w=1600&q=85"],
["Editorial Texture","#203a32","#91b8a8","https://images.unsplash.com/photo-1768825136230-34fb80291f19?auto=format&fit=crop&w=1600&q=85"],
["Natural Light","#8d7258","#e3d4c2","https://images.unsplash.com/photo-1753719734290-564c215cc34e?auto=format&fit=crop&w=1600&q=85"],
["Signature Look","#111","#2c5cff","https://images.unsplash.com/photo-1767396857332-11399cff43b2?auto=format&fit=crop&w=1600&q=85"]
];
const intro=document.getElementById("intro"),logo=document.getElementById("logo3d"),label=document.getElementById("slideLabel"),progress=document.getElementById("slideProgress"),grid=document.getElementById("portfolioGrid"),site=document.getElementById("site"),photoA=document.getElementById("introPhotoA"),photoB=document.getElementById("introPhotoB");
setTimeout(()=>intro.classList.add("logo-ready"),140);
looks.forEach(x=>{const p=new Image();p.decoding="async";p.src=x[3]});
let i=0,activeA=true;
function showSlide(){
  const x=looks[i],target=activeA?photoA:photoB,other=activeA?photoB:photoA;
  target.src=x[3];
  target.onload=()=>{other.classList.remove("is-active");target.classList.add("is-active")};
  logo.style.setProperty("--intro-image",'url("'+x[3]+'")');
  label.textContent=String(i+1).padStart(2,"0")+" / 17 · "+x[0].toUpperCase();
  progress.style.width=((i+1)/17*100)+"%";
  activeA=!activeA;
  i=(i+1)%looks.length;
}
showSlide();const timer=setInterval(showSlide,1450);
document.getElementById("enterSite").addEventListener("click",()=>{clearInterval(timer);intro.classList.add("is-gone");site.classList.add("is-visible");site.setAttribute("aria-hidden","false");setTimeout(()=>document.querySelector(".hero").scrollIntoView(),450)});
looks.forEach((x,n)=>{const card=document.createElement("article");card.className="look-card";card.style.setProperty("--c1",x[1]);card.style.setProperty("--c2",x[2]);card.innerHTML='<span class="placeholder-tag">IMAGE PLACEHOLDER</span><div class="look-meta"><b>'+String(n+1).padStart(2,"0")+'</b><span>'+x[0].toUpperCase()+'</span></div>';grid.appendChild(card)});
const menu=document.getElementById("menuBtn"),nav=document.getElementById("nav");menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open))});nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menu.setAttribute("aria-expanded","false")}));
if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){intro.classList.add("logo-ready");clearInterval(timer)}
