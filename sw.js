const CACHE_NAME = 'senac-mural-cache-v3';
const urlsToCache = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com',
];

// Install a service worker
self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        // AddAll will fail if any of the URLs fail to fetch
        return cache.addAll(urlsToCache).catch(error => {
          console.error('Failed to cache during install:', error);
        });
      })
  );
});

// Network-first caching strategy
self.addEventListener('fetch', event => {
  // We only want to handle GET requests.
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response because it's a stream and can only be consumed once.
        const responseToCache = response.clone();

        // Open the cache and store the new response.
        caches.open(CACHE_NAME).then(cache => {
          // Check for valid response before caching.
          if (response.status === 200 && response.type !== 'opaque' && !event.request.url.includes('generativelanguage')) {
            cache.put(event.request, responseToCache);
          }
        });

        // Return the original response to the browser.
        return response;
      })
      .catch(error => {
        // If the network request fails, try to serve from the cache.
        console.log('Fetch failed; returning from cache for', event.request.url);
        return caches.match(event.request);
      })
  );
});


// Update a service worker and clean up old caches
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