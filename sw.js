/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  DÜNYAMIZ • SERVICE WORKER (PWA)                                ║
 * ║  Strategiya: Network First → Cache Fallback                     ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

const CACHE_VERSION = 'dunyamiz-v2.3.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/icon-512.png',
    '/music_list.json',
    '/photos_list.json'
];

// Cache-lənMƏYƏCƏK resurslar
const NEVER_CACHE = [
    /\/api\//,
    /api\.github\.com/,
    /res\.cloudinary\.com/,
    /api\.telegram\.org/,
    /fonts\.googleapis\.com/,
    /fonts\.gstatic\.com/,
    /cdnjs\.cloudflare\.com/
];

/* ═══════════════════════════════════════════════════════════════════
   INSTALL
   ═══════════════════════════════════════════════════════════════════ */

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => cache.addAll(PRECACHE_URLS))
            .catch(err => console.warn('SW install cache failed:', err))
    );
});

/* ═══════════════════════════════════════════════════════════════════
   ACTIVATE — köhnə keşləri təmizlə
   ═══════════════════════════════════════════════════════════════════ */

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => Promise.all(
                cacheNames.map(name => {
                    if (name !== STATIC_CACHE && name !== RUNTIME_CACHE) {
                        console.log('[SW] Köhnə keş silinir:', name);
                        return caches.delete(name);
                    }
                })
            ))
            .then(() => self.clients.claim())
    );
});

/* ═══════════════════════════════════════════════════════════════════
   FETCH — Network First, Cache Fallback strategiyası
   ═══════════════════════════════════════════════════════════════════ */

self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Yalnız GET sorğularını handle et
    if (request.method !== 'GET') return;

    // Cache-lənməyəcək resurslar üçün birbaşa network
    if (NEVER_CACHE.some(pattern => pattern.test(request.url))) {
        return; // default browser davranışı
    }

    // Navigasiya sorğuları üçün: Network First, sonra offline.html, sonra index.html
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then(response => {
                    const clone = response.clone();
                    caches.open(RUNTIME_CACHE).then(c => c.put(request, clone));
                    return response;
                })
                .catch(() => caches.match(request).then(r => r || caches.match('/index.html')))
        );
        return;
    }

    // Digər sorğular: Network First
    event.respondWith(
        fetch(request)
            .then(response => {
                // Yalnız uğurlu cavabları cache-lə
                if (response && response.status === 200) {
                    const clone = response.clone();
                    caches.open(RUNTIME_CACHE).then(c => c.put(request, clone));
                }
                return response;
            })
            .catch(() => caches.match(request))
    );
});

/* ═══════════════════════════════════════════════════════════════════
   MESSAGE — App ilə əlaqə
   ═══════════════════════════════════════════════════════════════════ */

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.keys().then(names => names.forEach(name => caches.delete(name)));
    }
});
