const CACHE_NAME = 'flowledger-cache-v1';
const ASSETS_TO_CACHE = [
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-icon.png',
  '/icon-light-32x32.png',
  '/icon-dark-32x32.png',
  '/icon.svg',
  '/placeholder.jpg',
];

// Install Event - Pre-cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching static assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Serve cached assets when offline, otherwise fetch from network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests, Chrome extensions, APIs, Supabase calls, and navigations (redirects cause errors)
  if (
    request.method !== 'GET' ||
    !url.protocol.startsWith('http') ||
    url.pathname.startsWith('/api') ||
    url.hostname.includes('supabase.co') ||
    request.mode === 'navigate'
  ) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached response, but update cache in the background (Stale-While-Revalidate)
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          })
          .catch(() => {
            /* Ignore network update failures when offline */
          });
        return cachedResponse;
      }

      // Network First strategy for dynamic page routes to avoid stale HTML
      return fetch(request)
        .then((networkResponse) => {
          // Cache successful requests for static assets
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|woff2|json)$/) || ASSETS_TO_CACHE.includes(url.pathname))
          ) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          // If both network and cache fail (offline), fallback to cache for roots
          if (request.mode === 'navigate') {
            return caches.match('/');
          }
        });
    })
  );
});
