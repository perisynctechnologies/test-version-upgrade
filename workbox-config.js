const path = require('path');

module.exports = {
  globDirectory: 'build/',
  globPatterns: [
    '**/*.{html,js,css,woff2,json,png,svg,jpg,jpeg,gif,ico,webp}'
  ],
  swSrc: path.resolve(__dirname, 'src', 'serviceWorker.js'),
  swDest: path.resolve(__dirname, 'build', 'service-worker.js'), // Fixed hyphen
  maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB
  dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
  
  // Use globIgnores instead of exclude
  globIgnores: [
    '**/*.map',
    '**/_redirects',
    '**/_headers',
    '**/manifest.json',
    '**/service-worker.js',
    '**/precache-manifest.*.js',
    '**/build-meta.json',
    '**/.DS_Store',
    '**/.gitkeep',
    '**/.env'
  ]
};