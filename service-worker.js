// Basic service worker that caches core assets

const CACHE_NAME = 'arxen-website-cache-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/service-worker.js',
  '/static.html', // Add the static fallback page
  // CSS and JS assets will be cached by patterns below
  // Images will be cached on first use
];

// Cache core static assets
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate and clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated; claiming clients...');
      return self.clients.claim(); // Take control of all clients
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
  
  // For HTML and navigation (SPA routes), use network first with fast fallback
  if (event.request.mode === 'navigate' || 
      event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirstWithFallbackStrategy(event.request));
    return;
  }
  
  // For anything else, use network first
  event.respondWith(networkFirstStrategy(event.request));
});

// Network first with fast fallback strategy for navigation requests
async function networkFirstWithFallbackStrategy(request) {
  try {
    // Start a timeout in case network is slow
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve(null); // Resolves to null after timeout
      }, 3000); // 3 second timeout
    });
    
    // Race between network fetch and timeout
    const networkResponseOrTimeout = await Promise.race([
      fetch(request),
      timeoutPromise
    ]);
    
    // If we got a network response (not timeout null)
    if (networkResponseOrTimeout) {
      const networkResponse = networkResponseOrTimeout;
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    // If we hit timeout, try cache
    console.log('Service Worker: Network timeout, using cache for:', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If no cache, try the cached homepage as fallback
    console.log('Service Worker: No cache for request, using fallback for:', request.url);
    return caches.match('/index.html') || 
           caches.match('/') || 
           caches.match('/static.html') ||
           new Response('Site is temporarily unavailable. Please try again later.', {
             headers: { 'Content-Type': 'text/html' }
           });
  } catch (error) {
    console.error('Service Worker: Error serving request:', error);
    const cachedResponse = await caches.match(request);
    return cachedResponse || 
           caches.match('/index.html') || 
           caches.match('/') ||
           caches.match('/static.html');
  }
}

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