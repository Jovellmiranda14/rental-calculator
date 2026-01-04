// 1. ALWAYS change this version (v1 to v2, etc.) when you update your code
const CACHE_NAME = 'rental-time-tracker-v3';

const ASSETS = [
    './',
    './index.html',
    './app.js', // Added your script to the cache
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css'
];

// Install Service Worker
self.addEventListener('install', (e) => {
    // Forces the new Service Worker to become the active one immediately
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching new assets');
            return cache.addAll(ASSETS);
        })
    );
});

// NEW: Activate Event (This deletes the OLD cache)
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((existingCacheName) => {
                    // If the cache name isn't the current one, delete it
                    if (existingCacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', existingCacheName);
                        return caches.delete(existingCacheName);
                    }
                })
            );
        })
    );
});

// Fetch Assets from Cache
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((res) => {
            return res || fetch(e.request);
        })
    );
});