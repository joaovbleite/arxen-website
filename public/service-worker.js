// Service Worker for Arxen Construction website
const CACHE_NAME = 'arxen-cache-v1';

// Resources to cache on install
const PRECACHE_RESOURCES = [
  '/',
  '/index.html',
  '/assets/index.css',
  '/assets/index.js',
  'https://i.postimg.cc/SNx9NN2x/Chat-GPT-Image-May-13-2025-12-34-23-PM-removebg-preview.png'
];

// Install event - cache essential files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files');
        return cache.addAll(PRECACHE_RESOURCES);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keyList => {
        return Promise.all(keyList.map(key => {
          if (key !== CACHE_NAME) {
            console.log('Service Worker: Removing old cache', key);
            return caches.delete(key);
          }
        }));
      })
      .then(() => self.clients.claim())
  );
});

// Stale-while-revalidate strategy
// First return cached response, but then fetch and update cache for next time
self.addEventListener('fetch', event => {
  // Skip non-GET requests and browser extension/chrome requests
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension')) {
    return;
  }

  // For image resources - use cache first strategy with long expiry
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          // Return cached response if available
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Otherwise fetch from network and cache
          return fetch(event.request).then(networkResponse => {
            // Clone the response as it can only be consumed once
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          }).catch(() => {
            // If both cache and network fail, return a fallback image or error
            return new Response('Image not available', { status: 404 });
          });
        });
      })
    );
    return;
  }

  // For other resources - use stale-while-revalidate strategy
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        // Start network fetch in the background even if we have a cached copy
        const fetchPromise = fetch(event.request)
          .then(networkResponse => {
            // Clone the response as it can only be consumed once
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
          .catch(error => {
            console.error('Service Worker fetch failed:', error);
            return cachedResponse;
          });
        
        // Return cached response immediately if available, otherwise wait for network
        return cachedResponse || fetchPromise;
      });
    })
  );
});

// Handle messages from the main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
}); 