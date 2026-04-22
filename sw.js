const CACHE_NAME = 'dunyamiz-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/icon-512.png',
  '/music_list.json',
  '/photos_list.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
