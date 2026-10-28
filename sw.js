'use strict';
const CACHE='marmot-pours-v1.1.0';
const FILES=['./','./index.html','./styles.css','./app.js','./excel.js','./structures.js','./manifest.webmanifest','./assets/icon-192.png','./assets/icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET'||new URL(req.url).pathname.includes('/api/'))return;
  event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(resp=>{
    if(resp.ok&&new URL(req.url).origin===self.location.origin){const copy=resp.clone();caches.open(CACHE).then(cache=>cache.put(req,copy));}
    return resp;
  })));
});
