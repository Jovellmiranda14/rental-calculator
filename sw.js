const CACHE_NAME = 'rental-time-tracker-v5' + Date.now();

// List of assets to cache for offline use
const ASSETS = [
    './',
    './index.html',
    './app.js',
    './style.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css' // Cache Bootstrap
];

// Install event - Cache assets
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);  // Cache all assets on install
        })
    );
});

// Activate event - Delete old caches
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name); // Delete old caches that aren't the current one
                    }
                })
            );
        }).then(() => {
            return self.clients.claim(); // Take control of all open clients immediately
        })
    );
});

// Fetch event - Serve from cache if available, otherwise fetch from the network
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((cachedResponse) => {
            // If the request is in cache, return it
            if (cachedResponse) {
                return cachedResponse;
            }

            // If not in cache, fetch from the network
            return fetch(e.request).then((networkResponse) => {
                // Cache the network response directly
                if (networkResponse && networkResponse.status === 200) {
                    // Open the cache and store the response
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(e.request, networkResponse); // Store the response in cache
                    });
                }

                return networkResponse; // Return the network response
            });
        })
    );
});
