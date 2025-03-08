const CACHE_NAME = "Client-cache-v7";
const STATIC_ASSETS = [
  "/",  
  "/index.html",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/css/bootstrap.min.css",  
  "/css/styles.css", 
  "/js/bootstrap.bundle.min.js", 
  "/app.mjs",  
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

  // Tell all clients to refresh after update
  self.clients.matchAll().then(clients => {
    clients.forEach(client => client.navigate(client.url));
  });
});

// Push Notification Listener (missing payload issue)
self.addEventListener("push", event => {
  const message = event.data ? event.data.text() : "Don’t forget to read today’s Quran pages!";
  const options = {
    body: message,
    icon: '/favicon.ico',
    vibrate: [100, 50, 100],
  };
  event.waitUntil(
    self.registration.showNotification('Ramadan Quran Reminder', options)
  );
});


// Fetch event for offline support (only intercepts HTML page failures)
self.addEventListener("fetch", event => {
  const url = event.request.url;

  // Allow manifest to be served from cache
  if (url.includes("manifest.webmanifest")) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        return cachedResponse || fetch(event.request);
      })
    );
    return; // Stop further handling for manifest
  }
  
  
  if (url.includes("fonts.googleapis.com") || url.includes("gstatic.com")) {
    return; // Don't cache these files
  }
  
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request).catch(() => {
          // Return cached index.html for page requests when offline
          if (event.request.destination === "document") {
            return caches.match("/index.html");
          }
          
          return new Response("Offline: Resource not available", {
            status: 503,
            headers: { "Content-Type": "text/plain" }
          });
        });
    })
  );
});