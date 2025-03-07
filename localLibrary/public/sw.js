const CACHE_NAME = "localLibrary-cache-v6";
const STATIC_ASSETS = [
  "/",  
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/css/bootstrap.min.css",   
  "/js/bootstrap.bundle.min.js", 
  "/app.mjs",
  "/idb.js",  
  "/sw.js"
];

// Install and cache assets
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate service worker and remove old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cache => cache !== CACHE_NAME)
                  .map(cache => caches.delete(cache))
      );
    }).then(() => self.clients.claim())
  );
});

// Push Notification Listener
self.addEventListener("push", event => {
  const options = {
    body: 'Don’t forget to read today’s Quran pages! 📖✨',
    icon: '/favicon.ico',
    vibrate: [100, 50, 100],
  };
  event.waitUntil(
    self.registration.showNotification('Ramadan Quran Reminder', options)
  );
});

// Fetch event for offline support
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request).catch(() => {
        return new Response("You are offline. Some features may not work.", {
          status: 503,
          headers: { "Content-Type": "text/plain" }
        });
      });
    })
  );
});
