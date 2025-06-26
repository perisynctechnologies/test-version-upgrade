module.exports = {
  globDirectory: 'build/',
  globPatterns: [
    '**/*.{html,js,css,woff2,json,png,svg,jpg,jpeg,gif,ico,webp}'
  ],
  swSrc: 'src/serviceWorker.js',
  swDest: 'build/service-worker.js',
  maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB
  
  // Fixed regex patterns (removed double backslashes)
  dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
  
  // Added mode and watch options for better development
  mode: 'production',
  watch: process.env.NODE_ENV === 'development',
  
  // Enhanced exclude patterns
  exclude: [
    /\.map$/,              // Source maps
    /_redirects/,          // Amplify redirects
    /_headers/,            // Amplify headers
    /manifest\.json$/,     // Web app manifest
    /service-worker\.js$/, // Service worker itself
    /precache-manifest\.[0-9a-f]+\.js$/, // Workbox manifests
    /build-meta\.json$/,   // Your version metadata
    /\.DS_Store$/,         // Mac metadata files
    /\.gitkeep$/,          // Git keep files
    /\.env$/               // Environment files
  ],
  
  // Add runtime caching rules to supplement service worker
//   runtimeCaching: [
//     {
//       urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
//       handler: 'CacheFirst',
//       options: {
//         cacheName: 'images-cache-v1',
//         expiration: {
//           maxEntries: 200,
//           maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
//         }
//       }
//     },
//     {
//       urlPattern: /\.(?:woff|woff2|ttf|eot)$/,
//       handler: 'CacheFirst',
//       options: {
//         cacheName: 'fonts-cache-v1',
//         expiration: {
//           maxEntries: 30,
//           maxAgeSeconds: 365 * 24 * 60 * 60 // 1 year
//         }
//       }
//     }
//   ]
};