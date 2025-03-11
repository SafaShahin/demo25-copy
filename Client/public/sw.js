const CACHE_NAME = "Client-cache-v8";
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
    }).then(() => self.skipWaiting()) // Forces activation after install
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
    }).then(() => self.clients.claim()) // Ensures all clients use the new service worker immediately
  );
});

// Push Notification Listener 
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
sself.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return; // Ignore non-GET requests

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

  // Don't cache Google Fonts (prevents unnecessary caching issues)
  if (url.includes("fonts.googleapis.com") || url.includes("gstatic.com")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache the response clone
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => caches.match(event.request).then(cachedResponse => {
        return cachedResponse || (event.request.destination === "document"
          ? caches.match("/index.html") // Serve index.html for offline navigation
          : new Response("Offline: Resource not available", {
              status: 503,
              headers: { "Content-Type": "text/plain" }
            })
        );
      }))
  );
});
