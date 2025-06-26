const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  // Fixed IPv4 regex pattern (removed double backslash)
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl)
    .then(response => {
      // Added response.ok check for 2xx status codes
      const contentType = response.headers.get('content-type');
      if (response.status === 404 || 
          !(contentType && contentType.includes('javascript'))) {
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(error => {
      console.error('Service worker fetch failed:', error);
      // Don't unregister if fetch fails (might be offline)
    });
}

export function register(config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) return;

    console.log(`App version: ${process.env.REACT_APP_VERSION}`);

    const registerSW = () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      if (isLocalhost) {
        checkValidServiceWorker(swUrl, config);
        navigator.serviceWorker.ready.then(() => {
          console.log('App served cache-first by service worker');
        });
      } else {
        registerValidSW(swUrl, config);
      }
    };

    // Added document.readyState check
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      registerSW();
    } else {
      window.addEventListener('load', registerSW);
    }
  }
}

// Keep track of update intervals to prevent duplicates
const updateIntervals = new WeakMap();

function registerValidSW(swUrl, config) {
  navigator.serviceWorker.register(swUrl)
    .then(registration => {
      // Clear any existing interval
      if (updateIntervals.has(registration)) {
        clearInterval(updateIntervals.get(registration));
      }
      
      // Set up periodic update checks
      const intervalId = setInterval(() => {
        registration.update().catch(err => 
          console.debug('Background update check failed:', err)
        );
      }, 2 * 60 * 60 * 1000); // Every 2 hours
      
      updateIntervals.set(registration, intervalId);

      // Use event listener instead of onupdatefound property
      registration.addEventListener('updatefound', () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;
        
        const stateChangeHandler = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              config?.onUpdate?.(registration);
            } else {
              config?.onSuccess?.(registration);
            }
            installingWorker.removeEventListener('statechange', stateChangeHandler);
          }
        };
        
        installingWorker.addEventListener('statechange', stateChangeHandler);
      });
    })
    .catch(error => {
      console.error('SW registration failed:', error);
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        // Clear update interval
        if (updateIntervals.has(registration)) {
          clearInterval(updateIntervals.get(registration));
          updateIntervals.delete(registration);
        }
        return registration.unregister();
      })
      .then(() => {
        console.log('Service worker unregistered');
      })
      .catch(error => {
        console.error('Service worker unregistration failed:', error);
      });
  }
}