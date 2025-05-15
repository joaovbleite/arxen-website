// This script registers the service worker

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
        
        // Handle updates
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) {
            return;
          }
          
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New service worker available
                console.log('New service worker available. Showing update notification.');
                
                // Show update prompt to user
                if (window.confirm('New version of this site is available. Reload to update?')) {
                  // Send message to skip waiting and activate the new service worker
                  registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }
              } else {
                // Service worker installed for the first time
                console.log('Content is now available offline!');
              }
            }
          };
        };
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
  
  // Detect when a new service worker has taken over
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });
} 