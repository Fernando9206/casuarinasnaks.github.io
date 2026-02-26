/* ═══════════════════════════════════════
   Service Worker — Casuarina Snacks Menu
   PWA offline support + caching
═══════════════════════════════════════ */
const CACHE_NAME = 'casuarina-v1';
const STATIC_ASSETS = [
    './',
    './index.html',
    './casuarina.jpeg',
    './firebase-config.js',
    'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap'
];

// Install: cache static assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(STATIC_ASSETS).catch(() => {
                // Silently fail on cache errors (e.g., opaque cross-origin requests)
            });
        }).then(() => self.skipWaiting())
    );
});

// Activate: clean old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

// Fetch: network-first for Firebase/API, cache-first for static
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Network-only for Firebase, Cloudinary, Google Fonts API
    if (
        url.hostname.includes('firestore.googleapis.com') ||
        url.hostname.includes('firebase') ||
        url.hostname.includes('cloudinary.com') ||
        url.hostname.includes('googleapis.com')
    ) {
        return; // let browser handle it
    }

    // Cache-first for static assets, with network fallback
    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;
            return fetch(event.request).then(response => {
                if (!response || response.status !== 200 || response.type === 'opaque') {
                    return response;
                }
                const clone = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                return response;
            }).catch(() => {
                // Offline fallback for HTML pages
                if (event.request.destination === 'document') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});
