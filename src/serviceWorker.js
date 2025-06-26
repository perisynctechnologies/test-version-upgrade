import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { clientsClaim } from 'workbox-core';

// Define cache name
const CACHE_VERSION = 'v4'; // Update this with each deployment
const CACHE_NAME = 'app-cache-v1';
const PRECACHE_NAME = 'precache-v1';

self.addEventListener('install', event => {
  self.skipWaiting(); // Activate immediately
  console.log(`Installing service worker version: ${CACHE_VERSION}`);
});


// Precache only essential assets with improved filtering
precacheAndRoute(
  self.__WB_MANIFEST.filter(file => 
    !/\.map$|_redirects|\.txt|sw\.js$/.test(file.url)
);


// Claim clients immediately
clientsClaim();

self.addEventListener('activate', event => {
  // Notify clients about new version
  event.waitUntil(
    self.clients.matchAll({includeUncontrolled: true}).then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'NEW_VERSION_AVAILABLE',
          version: CACHE_VERSION
        });
      });
    })
  );

// Cleanup old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME && name !== PRECACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});

// API caching strategy with network timeout
registerRoute(
  ({url}) => url.pathname.startsWith('/api/'),
  new StaleWhileRevalidate({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({ 
        maxEntries: 50, 
        maxAgeSeconds: 5 * 60 // 5 minutes
      })
    ],
    fetchOptions: {
      timeout: 5000 // 5-second timeout
    }
  })
);

// Image caching strategy
registerRoute(
  ({request}) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new ExpirationPlugin({ 
        maxEntries: 100, 
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
      })
    ]
  })
);

// Fallback for offline support
registerRoute(
  ({request}) => request.mode === 'navigate',
  async ({event}) => {
    try {
      return await fetch(event.request);
    } catch (error) {
      return caches.match('/index.html') || 
             new Response('Offline page content');
    }
  }
);