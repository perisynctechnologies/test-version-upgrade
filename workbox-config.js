module.exports = {
  globDirectory: 'build/',
  globPatterns: [
    '**/*.{html,js,css,woff2,json,png,svg,jpg,jpeg,gif,ico,webp}'
  ],
  swSrc: 'src/serviceWorker.js',
  swDest: 'build/service-worker.js',
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