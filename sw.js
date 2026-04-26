const CACHE_NAME = 'dunyamiz-v2.2.1';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/icon-512.png',
  '/music_list.json',
  '/photos_list.json'
];

// Install event - caching assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activate event - cleaning up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Köhnə keş silinir:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  // Strategiya: Network First (Şəbəkədən yoxla, olmasa keşdən götür)
  // Bu, istifadəçinin həmişə ən son versiyanı görməsini təmin edir
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Uğurlu cavabı keşə əlavə et
        const resClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, resClone);
        });
        return response;
      })
      .catch(() => {
        // Şəbəkə yoxdursa, keşdən qaytar
        return caches.match(event.request);
      })
  );
});

