(()=>{'use strict';
const WORDS=[
['A','Analog Phone','An older telephone that carries voice using analog signals.','Teléfono analógico','Un teléfono antiguo que transmite la voz mediante señales analógicas.','☎️','a-analog-phone.pdf'],
['B','Battery','A device that stores energy for electronics.','Batería','Un dispositivo que almacena energía para aparatos electrónicos.','🔋','b-battery.pdf'],
['C','Computer','An electronic machine that processes information.','Computadora','Una máquina electrónica que procesa información.','💻','c-computer.pdf'],
['D','Drone','A flying device that can be controlled remotely.','Dron','Un dispositivo volador que puede controlarse a distancia.','🛩️','d-drone.pdf'],
['E','Email','A digital message sent over the internet.','Correo electrónico','Un mensaje digital enviado por internet.','✉️','e-email.pdf'],
['F','Flash Drive','A small device used to store digital files.','Memoria USB','Un dispositivo pequeño para guardar archivos digitales.','💾','f-flash-drive.pdf'],
['G','Game Controller','A device used to control a video game.','Control de videojuego','Un dispositivo para controlar un videojuego.','🎮','g-game-controller.pdf'],
['H','Headphones','A device worn over or in the ears for listening.','Audífonos','Un dispositivo que se usa en los oídos para escuchar.','🎧','h-headphones.pdf'],
['I','Internet','A worldwide network connecting computers and devices.','Internet','Una red mundial que conecta computadoras y dispositivos.','🌐','i-internet.pdf'],
['J','Joystick','A control stick used in games or machines.','Palanca de mando','Una palanca usada para juegos o máquinas.','🕹️','j-joystick.pdf'],
['K','Keyboard','A set of keys used to type on a computer.','Teclado','Un conjunto de teclas para escribir en una computadora.','⌨️','k-keyboard.pdf'],
['L','Laptop','A portable computer you can carry.','Computadora portátil','Una computadora que puedes llevar contigo.','💻','l-laptop.pdf'],
['M','Mouse','A device used to point and click on a computer.','Ratón','Un dispositivo para apuntar y hacer clic.','🖱️','m-mouse.pdf'],
['N','Network','A group of connected devices that share information.','Red','Un grupo de dispositivos conectados que comparten información.','🔗','n-network.pdf'],
['O','Online','Connected to or using the internet.','En línea','Conectado a internet o usándolo.','🌍','o-online.pdf'],
['P','Programming','Giving a computer instructions to follow.','Programación','Dar instrucciones a una computadora.','👩‍💻','p-programming.pdf'],
['Q','QR Code','A square code a device can scan to open information.','Código QR','Un código que un dispositivo puede escanear.','▦','q-qr-code.pdf'],
['R','Robot','A machine that can perform programmed tasks.','Robot','Una máquina que realiza tareas programadas.','🤖','r-robot.pdf'],
['S','Smartphone','A mobile phone that can run apps and connect online.','Teléfono inteligente','Un teléfono móvil con aplicaciones e internet.','📱','s-smartphone.pdf'],
['T','Tablet','A flat touchscreen computer.','Tableta','Una computadora plana con pantalla táctil.','📲','t-tablet.pdf'],
['U','USB','A common connection used by many electronic devices.','USB','Una conexión común usada por dispositivos electrónicos.','🔌','u-usb.pdf'],
['V','Virtual Reality','Technology that creates an immersive digital environment.','Realidad virtual','Tecnología que crea un entorno digital inmersivo.','🥽','v-virtual-reality.pdf'],
['W','Wi-Fi','Wireless technology that connects devices to a network.','Wi-Fi','Tecnología inalámbrica que conecta dispositivos a una red.','📶','w-wifi.pdf'],
['X','X-Ray','Technology that helps create images inside the body.','Rayos X','Tecnología que crea imágenes del interior del cuerpo.','🩻','x-x-ray.pdf'],
['Y','YouTube','An online video platform.','YouTube','Una plataforma de videos en línea.','▶️','y-youtube.pdf'],
['Z','Zoom','A video communication app for online meetings.','Zoom','Una aplicación de videocomunicación.','🎥','z-zoom.pdf']
];
const I18N={
 en:{
  'intro.presented':'A+ TECHUCATION PRESENTS','intro.tagline':'A brighter tomorrow starts with A–Z.','intro.enter':'Enter the Adventure →','intro.skip':'Skip Intro','intro.lightsOn':'💡 Bus Lights On','intro.lightsOff':'💡 Bus Lights Off','sound.on':'🔊 Sound On','sound.off':'🔇 Sound Off',
  'nav.home':'Home','nav.book':'Book','nav.play':'Play','nav.color':'Color','nav.watch':'Watch','nav.spelling':'Spelling Bee','nav.about':'About','nav.getBook':'Get the Book →',
  'world.eyebrow':'INTERACTIVE WORLD','world.title':'Choose your path.','world.explore':'Explore','world.learn':'Learn','world.create':'Create','world.imagine':'Imagine','world.belong':'Belong',
  'learn.eyebrow':'A–Z ADVENTURE','learn.title':'Every letter opens a technology world.','learn.hear':'🔊 Hear','learn.surprise':'🎲 Surprise',
  'book.eyebrow':'THE BOOK','book.title':'Look inside the real book.','book.body':'Three actual supplied pages, shown from the original source artwork for sharper reading.',
  'play.eyebrow':'PLAY','play.title':'Learn through games.',
  'stem.eyebrow':'STEM ACTIVITY LAB','stem.title':'Build. Experiment. Create.','stem.body':'Start with two full printable activities, then explore four quick challenges.',
  'spell.eyebrow':'SPELLING BEE','spell.title':'Listen. Spell. Learn.','spell.body':'26 technology words. No account required.','spell.placeholder':'Type the word','spell.check':'Check','spell.next':'Next',
  'color.eyebrow':'COLORING WORLD','color.title':'Color your way through A–Z technology.','color.body':'Choose a page, print it, color it and learn the technology word with a grown-up.','color.adventures':'26 printable adventures','color.description':'Big A–Z letters, kid-friendly technology drawings and conversation prompts.','color.openBook':'Open the Full Coloring Book →','color.seePack':'See the complete 26-page pack →',
  'watch.eyebrow':'WATCH & LISTEN','watch.title':'Technology comes alive.','watch.body':'Play the ABC Tech theme, follow the words on screen, or listen to A–Z vocabulary.','watch.lyricEyebrow':'ABC TECH LYRIC VIDEO','watch.lyricTitle':"Sing, watch and learn with ABC's of Technology.",'watch.lyricBody':'Play the official lyric video, then explore the A–Z words, coloring pages and activities.','watch.youtube':'Open on YouTube ↗','watch.watchHere':'Watch Here →',
  'about.eyebrow':'THE CREATORS','about.title':'A brighter tomorrow.','about.body':'Created to make technology vocabulary fun, approachable and memorable for young learners and families.',
  'shop.eyebrow':'FOR GROWN-UPS','shop.title':'Bring the adventure home.','shop.body':"Choose a book format or continue to ABC Tech Products. Purchases open on the seller's site."
 },
 es:{
  'intro.presented':'A+ TECHUCATION PRESENTA','intro.tagline':'Un futuro más brillante comienza de la A a la Z.','intro.enter':'Entrar a la aventura →','intro.skip':'Saltar introducción','intro.lightsOn':'💡 Luces del autobús encendidas','intro.lightsOff':'💡 Luces del autobús apagadas','sound.on':'🔊 Sonido activado','sound.off':'🔇 Sonido desactivado',
  'nav.home':'Inicio','nav.book':'Libro','nav.play':'Jugar','nav.color':'Colorear','nav.watch':'Ver','nav.spelling':'Concurso de ortografía','nav.about':'Acerca de','nav.getBook':'Obtener el libro →',
  'world.eyebrow':'MUNDO INTERACTIVO','world.title':'Elige tu camino.','world.explore':'Explorar','world.learn':'Aprender','world.create':'Crear','world.imagine':'Imaginar','world.belong':'Pertenecer',
  'learn.eyebrow':'AVENTURA A–Z','learn.title':'Cada letra abre un mundo de tecnología.','learn.hear':'🔊 Escuchar','learn.surprise':'🎲 Sorpresa',
  'book.eyebrow':'EL LIBRO','book.title':'Mira dentro del libro real.','book.body':'Tres páginas reales proporcionadas, mostradas desde el arte original para una lectura más clara.',
  'play.eyebrow':'JUGAR','play.title':'Aprende jugando.',
  'stem.eyebrow':'LABORATORIO STEM','stem.title':'Construye. Experimenta. Crea.','stem.body':'Comienza con dos actividades imprimibles completas y luego explora cuatro desafíos rápidos.',
  'spell.eyebrow':'CONCURSO DE ORTOGRAFÍA','spell.title':'Escucha. Deletrea. Aprende.','spell.body':'26 palabras de tecnología. No se requiere cuenta.','spell.placeholder':'Escribe la palabra','spell.check':'Comprobar','spell.next':'Siguiente',
  'color.eyebrow':'MUNDO PARA COLOREAR','color.title':'Colorea tu camino por la tecnología de la A a la Z.','color.body':'Elige una página, imprímela, coloréala y aprende la palabra tecnológica con un adulto.','color.adventures':'26 aventuras imprimibles','color.description':'Letras grandes de la A a la Z, dibujos tecnológicos para niños y preguntas para conversar.','color.openBook':'Abrir el libro completo para colorear →','color.seePack':'Ver el paquete completo de 26 páginas →',
  'watch.eyebrow':'VER Y ESCUCHAR','watch.title':'La tecnología cobra vida.','watch.body':'Reproduce el tema de ABC Tech, sigue las palabras en pantalla o escucha el vocabulario de la A a la Z.','watch.lyricEyebrow':'VIDEO CON LETRA DE ABC TECH','watch.lyricTitle':"Canta, mira y aprende con ABC's of Technology.",'watch.lyricBody':'Reproduce el video oficial con letra y luego explora las palabras de la A a la Z, las páginas para colorear y las actividades.','watch.youtube':'Abrir en YouTube ↗','watch.watchHere':'Ver aquí →',
  'about.eyebrow':'LOS CREADORES','about.title':'Un futuro más brillante.','about.body':'Creado para hacer que el vocabulario tecnológico sea divertido, accesible y memorable para niños y familias.',
  'shop.eyebrow':'PARA ADULTOS','shop.title':'Lleva la aventura a casa.','shop.body':'Elige un formato del libro o continúa a ABC Tech Products. Las compras se abren en el sitio del vendedor.'
 }
};
let lang='en',current=0,spellIndex=0,score=0;

function t(key){return I18N[lang]?.[key]||I18N.en[key]||key}
function applyLanguage(next){
  lang=next==='es'?'es':'en';
  document.documentElement.lang=lang;
  try{localStorage.setItem('abc-lang',lang)}catch{}
  document.querySelectorAll('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(I18N[lang]?.[key])el.textContent=I18N[lang][key]});
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{const key=el.dataset.i18nPlaceholder;if(I18N[lang]?.[key])el.setAttribute('placeholder',I18N[lang][key])});
  ['enBtn','siteLangEn'].forEach(id=>document.getElementById(id)?.classList.toggle('active',lang==='en'));
  ['esBtn','siteLangEs'].forEach(id=>document.getElementById(id)?.classList.toggle('active',lang==='es'));
  renderWord();renderColor();renderSpell();
  const activeWorld=document.querySelector('.world-tab.active')?.dataset.world||'explore';renderWorld(activeWorld);
  updateSoundUI();
}

let soundEnabled=true,themePlaying=false,audioCtx=null,themeTimer=null,themeStep=0,lyricTimer=null,lyricIndex=0;
const THEME_NOTES=[261.63,329.63,392.00,523.25,392.00,329.63,293.66,349.23,440.00,523.25,440.00,349.23];
const LYRIC_LINES=[
  ['A brighter tomorrow starts with A–Z.','Come ride the ABC Tech Bus and explore.'],
  ['Learn it, play it, build it, create it.','Technology can open a brand-new door.'],
  ['From analog phones to robots and Wi-Fi,','Every letter helps us learn a little more.'],
  ['Explore. Learn. Create. Imagine. Belong.','A+ Techucation — brighter futures start here.']
];
function ensureAudio(){
  if(!audioCtx){const AC=window.AudioContext||window.webkitAudioContext;if(AC)audioCtx=new AC();}
  if(audioCtx?.state==='suspended')audioCtx.resume();
}
function playTone(freq,dur=.22,vol=.035){
  if(!soundEnabled)return;ensureAudio();if(!audioCtx)return;
  const o=audioCtx.createOscillator(),g=audioCtx.createGain();
  o.type='triangle';o.frequency.value=freq;g.gain.setValueAtTime(0,audioCtx.currentTime);
  g.gain.linearRampToValueAtTime(vol,audioCtx.currentTime+.02);
  g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+dur);
  o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+dur+.03);
}
function themeTick(){if(!themePlaying)return;playTone(THEME_NOTES[themeStep%THEME_NOTES.length]);themeStep++;themeTimer=setTimeout(themeTick,310);}
function startTheme(){if(themePlaying)return;themePlaying=true;themeStep=0;themeTick();updateSoundUI();}
function stopTheme(){themePlaying=false;clearTimeout(themeTimer);themeTimer=null;updateSoundUI();}
function toggleTheme(){themePlaying?stopTheme():startTheme();}
function updateSoundUI(){
  const label=soundEnabled?t('sound.on'):t('sound.off');
  ['soundDock','introSound','lyricSound'].forEach(id=>{const el=document.getElementById(id);if(el){el.textContent=label;el.setAttribute('aria-pressed',String(soundEnabled));}});
  const dock=document.getElementById('soundDock');if(dock)dock.setAttribute('aria-label',soundEnabled?(lang==='es'?'Desactivar el sonido de ABC Tech':'Turn ABC Tech background sound off'):(lang==='es'?'Activar el sonido de ABC Tech':'Turn ABC Tech background sound on'));
}
function toggleSound(){
  soundEnabled=!soundEnabled;
  if(!soundEnabled){stopTheme();window.speechSynthesis?.cancel?.();}
  else startTheme();
  updateSoundUI();
}
function closeIntro(withSound=true){
  const intro=document.getElementById('siteIntro');if(!intro)return;
  intro.classList.add('leaving');document.body.classList.remove('intro-open');
  if(withSound&&soundEnabled)startTheme();
  setTimeout(()=>{
    intro.hidden=true;intro.classList.remove('leaving');
    document.getElementById('siteControlBar')?.classList.add('ready');
    document.querySelector('#siteControlBar a[href="#home"]')?.focus({preventScroll:true});
  },650);
}
function playLyricVideo(){
  const btn=document.getElementById('playLyric');
  if(btn?.dataset.playing==='1'){
    btn.dataset.playing='0';btn.textContent='▶ Play Lyric Video';clearInterval(lyricTimer);lyricTimer=null;return;
  }
  if(soundEnabled)startTheme();
  lyricIndex=0;if(btn){btn.dataset.playing='1';btn.textContent='⏸ Pause Lyric Video';}
  const paint=()=>{const [a,b]=LYRIC_LINES[lyricIndex%LYRIC_LINES.length];const l=document.getElementById('lyricLine'),s=document.getElementById('lyricSub');if(l)l.textContent=a;if(s)s.textContent=b;lyricIndex++;};
  paint();clearInterval(lyricTimer);lyricTimer=setInterval(paint,3400);
}


const menuBtn=document.getElementById('menuBtn'),mainNav=document.getElementById('mainNav');
if(menuBtn&&mainNav){menuBtn.addEventListener('click',()=>{const o=mainNav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(o))});mainNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mainNav.classList.remove('open');menuBtn.setAttribute('aria-expanded','false')}));}

function speak(text){if(!('speechSynthesis'in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=lang==='es'?'es-US':'en-US';u.rate=.84;speechSynthesis.speak(u)}
function wordName(w){return lang==='es'?w[3]:w[1]}function wordDef(w){return lang==='es'?w[4]:w[2]}

const az=document.getElementById('azGrid');
function renderAZ(){
 if(!az)return; az.innerHTML='';
 WORDS.forEach((w,i)=>{const b=document.createElement('button');b.type='button';b.textContent=w[0];b.classList.toggle('active',i===current);b.setAttribute('aria-label',w[0]+' — '+wordName(w));b.onclick=()=>{current=i;renderWord();document.querySelector('.word-console')?.scrollIntoView({behavior:'smooth',block:'center'})};az.appendChild(b)});
}
function renderWord(){
 const w=WORDS[current];document.getElementById('letterChip').textContent=w[0];document.getElementById('techWord').textContent=wordName(w);document.getElementById('techDef').textContent=wordDef(w);renderAZ();renderQuiz();
}
document.getElementById('speakWord')?.addEventListener('click',()=>speak(wordName(WORDS[current])));
document.getElementById('randomWord')?.addEventListener('click',()=>{current=Math.floor(Math.random()*26);renderWord()});
document.getElementById('surpriseGame')?.addEventListener('click',()=>{current=Math.floor(Math.random()*26);renderWord();document.getElementById('learn')?.scrollIntoView({behavior:'smooth'})});
document.getElementById('hearGame')?.addEventListener('click',()=>speak(wordName(WORDS[current])));

function renderQuiz(){
 const box=document.getElementById('quizOptions'),fb=document.getElementById('quizFeedback');if(!box)return;box.innerHTML='';if(fb)fb.textContent='';
 const answer=WORDS[current][0];let opts=[answer];while(opts.length<3){const x=WORDS[Math.floor(Math.random()*26)][0];if(!opts.includes(x))opts.push(x)}opts.sort(()=>Math.random()-.5).forEach(x=>{const b=document.createElement('button');b.type='button';b.textContent=x;b.onclick=()=>{if(fb){const ok=x===answer;fb.textContent=ok?(lang==='es'?'¡Correcto!':'Correct!'):(lang==='es'?'Inténtalo otra vez.':'Try again.');fb.style.color=ok?'#075f32':'#8a2331'}};box.appendChild(b)});
}

const colorGrid=document.getElementById('colorGrid');
function renderColor(){
 if(!colorGrid)return;colorGrid.innerHTML='';
 WORDS.forEach((w,i)=>{const a=document.createElement('a');a.className='color-card'+(i<6?' featured-color':'');a.dataset.letter=w[0];a.href='/downloads/coloring-pages/'+w[6];a.target='_blank';a.rel='noopener';a.innerHTML='<div class="color-preview"><span class="color-letter">'+w[0]+w[0].toLowerCase()+'</span><span class="color-icon">'+w[5]+'</span></div><b>'+w[0]+' — '+wordName(w)+'</b><small>'+(lang==='es'?'Abrir PDF ↗':'Open PDF ↗')+'</small>';colorGrid.appendChild(a)});
}

const pages=[...document.querySelectorAll('#bookFrame img')];let page=0;
function showPage(){pages.forEach((p,i)=>p.classList.toggle('active',i===page));const pc=document.getElementById('pageCount');if(pc)pc.textContent=(page+1)+' / '+pages.length}
document.getElementById('prevPage')?.addEventListener('click',()=>{page=(page-1+pages.length)%pages.length;showPage()});
document.getElementById('nextPage')?.addEventListener('click',()=>{page=(page+1)%pages.length;showPage()});

function renderSpell(){const w=WORDS[spellIndex];document.getElementById('spellRound').textContent=(spellIndex+1)+' / 26';document.getElementById('spellScore').textContent=(lang==='es'?'Puntos: ':'Score: ')+score;document.getElementById('spellInput').value='';document.getElementById('spellFeedback').textContent='';document.getElementById('spellFeedback').dataset.scored=''}
document.getElementById('spellSpeak')?.addEventListener('click',()=>speak(wordName(WORDS[spellIndex])));
document.getElementById('checkSpell')?.addEventListener('click',()=>{const input=document.getElementById('spellInput'),fb=document.getElementById('spellFeedback'),target=wordName(WORDS[spellIndex]);const ok=input.value.trim().toLowerCase()===target.toLowerCase();fb.textContent=ok?(lang==='es'?'¡Correcto!':'Correct!'):(lang==='es'?'Escucha otra vez.':'Listen again and try once more.');fb.style.color=ok?'#09753d':'#a52636';if(ok&&fb.dataset.scored!=='1'){score++;fb.dataset.scored='1';document.getElementById('spellScore').textContent=(lang==='es'?'Puntos: ':'Score: ')+score}});
document.getElementById('nextSpell')?.addEventListener('click',()=>{spellIndex=(spellIndex+1)%26;renderSpell()});

const worlds={
 explore:{en:['Explore the A–Z World','Choose any letter and jump into a technology word, sound, quiz and printable activity.',[['Explore A–Z','#learn'],['Color A–Z','#color']]],es:['Explora el mundo A–Z','Elige cualquier letra y entra en una palabra tecnológica, sonido, cuestionario y actividad imprimible.',[['Explorar A–Z','#learn'],['Colorear A–Z','#color']]]},
 learn:{en:['Learn with the ABC Tech Bus','Hear technology words, read simple definitions and build early digital vocabulary.',[['Hear Tech Words','#learn'],['Preview the Book','#book']]],es:['Aprende con el ABC Tech Bus','Escucha palabras tecnológicas, lee definiciones sencillas y desarrolla vocabulario digital.',[['Escuchar palabras','#learn'],['Ver el libro','#book']]]},
 create:{en:['Create with STEM','Build, test, sort and experiment with simple grown-up-guided STEM activities.',[['Try STEM','#stem'],['Play Games','#play']]],es:['Crea con STEM','Construye, prueba, clasifica y experimenta con actividades STEM guiadas por un adulto.',[['Probar STEM','#stem'],['Jugar','#play']]]},
 imagine:{en:['Imagine, Color & Watch','Turn technology words into creative ideas with coloring, audio, rhythm and video learning.',[['Coloring Pages','#color'],['Watch & Listen','#watch']]],es:['Imagina, colorea y mira','Convierte palabras tecnológicas en ideas creativas con color, audio, ritmo y video.',[['Páginas para colorear','#color'],['Ver y escuchar','#watch']]]},
 belong:{en:['Belong in a Brighter Tomorrow','A family-friendly learning world where children can explore free activities while grown-ups choose optional books and products.',[['For Grown-Ups','#shop'],['ABC Tech Products','https://abctechproducts.atechspot.com/']]],es:['Pertenece a un futuro más brillante','Un mundo de aprendizaje familiar donde los niños exploran actividades gratis y los adultos eligen libros y productos opcionales.',[['Para adultos','#shop'],['ABC Tech Products','https://abctechproducts.atechspot.com/']]]}
};
function renderWorld(k){
 document.querySelectorAll('.world-tab').forEach(b=>b.classList.toggle('active',b.dataset.world===k));
 const p=worlds[k]?.[lang]||worlds[k]?.en,panel=document.getElementById('worldPanel');if(!panel||!p)return;
 const [title,text,links]=p;
 panel.innerHTML='<div><p class="eyebrow">'+(lang==='es'?'MUNDO DE AVENTURA ABC':'ABC ADVENTURE WORLD')+'</p><h3>'+title+'</h3><p>'+text+'</p></div><div class="world-links">'+links.map(([tx,h])=>'<a class="btn '+(h.startsWith('http')?'green':'cyan')+'" href="'+h+'" '+(h.startsWith('http')?'target="_blank" rel="noopener"':'')+'>'+tx+' →</a>').join('')+'</div>';
}
document.querySelectorAll('.world-tab').forEach(b=>b.addEventListener('click',()=>renderWorld(b.dataset.world)));
document.querySelectorAll('.world-jump').forEach(b=>b.addEventListener('click',()=>{
  const key=b.dataset.worldJump;
  if(key && worlds[key]){
    renderWorld(key);
    document.getElementById('world')?.scrollIntoView({behavior:'smooth',block:'start'});
  }
}));

document.getElementById('enBtn')?.addEventListener('click',()=>applyLanguage('en'));
document.getElementById('esBtn')?.addEventListener('click',()=>applyLanguage('es'));
document.getElementById('siteLangEn')?.addEventListener('click',()=>applyLanguage('en'));
document.getElementById('siteLangEs')?.addEventListener('click',()=>applyLanguage('es'));


document.body.classList.add('intro-open');
document.getElementById('enterSite')?.addEventListener('click',()=>closeIntro(true));
document.getElementById('skipIntro')?.addEventListener('click',()=>closeIntro(false));
document.getElementById('introSound')?.addEventListener('click',toggleSound);
document.getElementById('soundDock')?.addEventListener('click',toggleSound);
document.getElementById('lyricSound')?.addEventListener('click',toggleSound);
document.getElementById('playTheme')?.addEventListener('click',toggleTheme);
document.getElementById('jumpLyric')?.addEventListener('click',()=>document.getElementById('lyricStage')?.scrollIntoView({behavior:'smooth',block:'center'}));
document.getElementById('introLights')?.addEventListener('click',e=>{const intro=document.getElementById('siteIntro');const off=intro?.classList.toggle('lights-off');e.currentTarget.setAttribute('aria-pressed',String(!off));e.currentTarget.textContent=t(off?'intro.lightsOff':'intro.lightsOn');});
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
  const id=a.getAttribute('href').slice(1);
  const target=id&&document.getElementById(id);
  if(target){
    e.preventDefault();
    history.replaceState(null,'','#'+id);
    target.scrollIntoView({behavior:'smooth',block:'start'});
  }
}));
document.querySelectorAll('[data-color-letter]').forEach(a=>a.addEventListener('click',()=>{
  const letter=a.dataset.colorLetter;
  setTimeout(()=>document.querySelector('.color-card[data-letter="'+letter+'"]')?.classList.add('color-pulse'),450);
  setTimeout(()=>document.querySelector('.color-card[data-letter="'+letter+'"]')?.classList.remove('color-pulse'),1800);
}));
const navLinks=[...document.querySelectorAll('#siteControlBar a[href^="#"]')];
const navTargets=navLinks.map(a=>document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
if('IntersectionObserver'in window){
  const navObserver=new IntersectionObserver(entries=>{
    const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(!visible)return;
    navLinks.forEach(a=>a.classList.toggle('active-section',a.getAttribute('href')==='#'+visible.target.id));
  },{rootMargin:'-18% 0px -65% 0px',threshold:[0,.15,.35,.6]});
  navTargets.forEach(el=>navObserver.observe(el));
}
let savedLang='en';try{savedLang=localStorage.getItem('abc-lang')||'en'}catch{}
applyLanguage(savedLang);
document.getElementById('siteControlBar')?.classList.add('ready');
showPage();
})();