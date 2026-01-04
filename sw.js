const CACHE_NAME = 'rental-time-tracker-v5';

const ASSETS = [
    './',
    './index.html',
    './app.js',
    './style.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css'
];

// Install event - Cache the assets
self.addEventListener('install', (e) => {
    self.skipWaiting(); // Force the waiting service worker to become active
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS); // Cache all the assets in the list
        })
    );
});

// Activate event - Clean up old caches
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        // Delete old caches that are not the current one
                        return caches.delete(name);
                    }
                })
            );
        }).then(() => {
            // Take control immediately, without waiting for next page load
            return self.clients.claim();
        })
    );
});

// Fetch event - Serve from cache, else fetch from network
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((cachedResponse) => {
            if (cachedResponse) {
                // Return cached response if exists
                return cachedResponse;
            }

            // Otherwise, fetch from the network
            return fetch(e.request).then((networkResponse) => {
                // Cache the new network response for future use
                if (networkResponse && networkResponse.status === 200) {
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(e.request, networkResponse.clone()); // Cache the new response
                    });
                }
                return networkResponse; // Return the network response
            });
        })
    );
});
