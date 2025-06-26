const swUrl = `${process.env.PUBLIC_URL}/serviceWorker.js`; // Match actual filename

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  // Fixed IPv4 regex pattern (removed double backslash)
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);


function waitUntilUpdate(registration) {
  return new Promise(resolve => {
    if (registration.waiting) return resolve(registration);
    
    const trackInstalling = worker => {
      worker.addEventListener('statechange', () => {
        if (worker.state === 'installed') {
          resolve(registration);
        }
      });
    };
    
    registration.addEventListener('updatefound', () => {
      trackInstalling(registration.installing);
    });
  });
}

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
      const swUrl = `${process.env.PUBLIC_URL}/serviceWorker.js`;
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
      // Immediate update check on registration
      registration.update();
      
      // Check for updates every 5 minutes
      const intervalId = setInterval(() => {
        registration.update().catch(err => 
          console.debug('Background update check failed:', err)
        );
      }, 1 * 60 * 1000);
      
      updateIntervals.set(registration, intervalId);

      // Enhanced update detection
      const trackInstalling = (worker) => {
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            config?.onUpdate?.(registration);
          }
        });
      };

      // Listen for updates
      registration.addEventListener('updatefound', () => {
        trackInstalling(registration.installing);
      });
      
      // Check if there's already a waiting worker
      if (registration.waiting && navigator.serviceWorker.controller) {
        config?.onUpdate?.(registration);
      }
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