const IS_DEV = ['localhost', '127.0.0.1'].includes(self.location.hostname);
const CACHE_NAME = 'restaurant-menu-cache-v4';
const urlsToCache = [
  '/',
  '/uz',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  if (IS_DEV) return; // no pre-cache in dev
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('activate', event => {
  if (IS_DEV) {
    // In dev, clear all caches and avoid controlling fetch aggressively
    event.waitUntil(
      caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key)))).then(() => self.clients.claim())
    );
    return;
  }
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  return self.clients.claim();
});

// In dev, do not intercept fetch to avoid breaking HMR
if (IS_DEV) {
  // No fetch handler in dev
} else {
self.addEventListener('fetch', event => {
  const { request } = event;

  // Bypass non-GET
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Navigation requests: network-first, fallback to default locale
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        return caches.match('/uz') || caches.match('/');
      })
    );
    return;
  }

  // Static Next assets: cache-first
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        cache.put(request, response.clone());
        return response;
      })
    );
    return;
  }

  // Images: cache-first
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        });
      })
    );
    return;
  }

  // Pages and other GET requests: network-first with offline fallback
  event.respondWith(
    fetch(request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        // Fallback to default locale root for SPA-ish offline
        return caches.match('/uz') || caches.match('/');
      })
  );
});
}