// Basic service worker that caches core assets

const CACHE_NAME = 'arxen-website-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/service-worker.js',
  // CSS and JS assets will be cached by patterns below
  // Images will be cached on first use
];

// Cache core static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event with improved strategy
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Different strategies based on request type
  const url = new URL(event.request.url);
  
  // For API calls use network first
  if (url.pathname.includes('/api/')) {
    event.respondWith(networkFirstStrategy(event.request));
    return;
  }
  
  // For CSS, JS, and asset files use cache first
  if (
    event.request.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)
  ) {
    event.respondWith(cacheFirstStrategy(event.request));
    return;
  }
  
  // For HTML and navigation, use network first
  event.respondWith(networkFirstStrategy(event.request));
});

// Network first strategy - try network, fallback to cache
async function networkFirstStrategy(request) {
  try {
    // Try to get from network
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    
    // Put a copy in cache for later
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    return cachedResponse || caches.match('/index.html');
  }
}

// Cache first strategy - try cache, fallback to network
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // If not in cache, get from network
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    
    // Put a copy in cache for later
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    // Return a fallback or null if appropriate
    return null;
  }
}

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 