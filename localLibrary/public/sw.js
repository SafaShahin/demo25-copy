const CACHE_NAME = "localLibrary-cache-v4"; // Increment to clear old cache
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

// Install service worker and cache assets
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
});

// Activate service worker and delete old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Push Notification Listener 
self.addEventListener('push', function(event) {
    const options = {
      body: 'Don’t forget to read today’s Quran pages! 📖✨',
      icon: '/favicon.ico',
      vibrate: [100, 50, 100],
    };
    event.waitUntil(
      self.registration.showNotification('Ramadan Quran Reminder', options)
    );
});

// Fetch event for caching and API handling
self.addEventListener("fetch", (event) => {
    if (event.request.url.includes("/api/tree")) {
        event.respondWith(
            fetch(event.request)
            .then(response => response)
            .catch(() => new Response(JSON.stringify({ error: "Offline mode: Data not available" }), {
                headers: { "Content-Type": "application/json" }
            }))
        );
        return;
    }

    // Serve cached assets
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
