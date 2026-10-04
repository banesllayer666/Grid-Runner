// Grid Runner service worker: makes the installed app (Android / desktop PWA) start and play offline.
// The game page is fetched network-first so every player gets updates as soon as they are online — that keeps
// cross-play versions in step. Art and icons are cache-first. Bump VERSION whenever these files change.
const VERSION='gr-v5-1';
const CORE=['./index_v5.html','./manifest.webmanifest','./favicon.svg','./logo-mark-transparent.svg','./logo-full.svg',
  './assets/cars.png','./assets/tracks/asphalt.png','./assets/tracks/asphalt-kerb.png','./assets/tracks/dirt.png','./assets/tracks/dirt-kerb.png',
  './assets/tracks/grass.png','./assets/tracks/grass-tufts.png','./assets/tracks/sand.png','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET')return;const url=new URL(req.url);
  const page=req.mode==='navigate'||url.pathname.endsWith('.html');
  if(page){ // network first, fall back to the cached game
    e.respondWith(fetch(req).then(r=>{const copy=r.clone();caches.open(VERSION).then(c=>c.put(req,copy));return r;}).catch(()=>caches.match(req).then(r=>r||caches.match('./index_v5.html'))));return;}
  // everything else (art, icons, Google Fonts): cache first, then network, storing what comes back
  e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{if(r&&(r.ok||r.type==='opaque')){const copy=r.clone();caches.open(VERSION).then(c=>c.put(req,copy));}return r;})));});
