self.addEventListener("install", e => {
  e.waitUntil(caches.open("pharma-cache").then(cache => cache.add("/")));
});

self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
