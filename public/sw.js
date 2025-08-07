const CACHE_NAME = 'restaurant-menu-cache-v2';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icon-192x192.jpg',
  '/icon-512x512.jpg'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.destination === 'image') {
    // Cache-first strategy for images
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          const respClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, respClone));
          return response;
        });
      })
    );
  } else {
    // Network-first for all other requests
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request).then(res => res || caches.match('/')))
    );
  }
});