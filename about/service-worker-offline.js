
const urlsToCache = [ 
    "https://www.spanishinflow.com/about/offline.html",
    "https://www.spanishinflow.com/about/css/span.css",
    "https://www.spanishinflow.com/about/manifest-offline.json",
    "https://www.spanishinflow.com/about/fonts/alegrayasanssc.woff2",
    "https://www.spanishinflow.com/about/fonts/reemkufi.woff2"
];

self.addEventListener("install", event => {
    self.skipWaiting();
    console.log('OFF installed offline sw')
    event.waitUntil(
        caches.open("pwa-assets")
        .then(cache => {
            console.log('cache open')
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", (e) => {
    e.respondWith(
        (async () => {
          const r = await caches.match(e.request);
          if (r) {
              console.log(`[Service Worker] YES resource: ${e.request.url}`);
            return r;
          }
          console.log(`[Service Worker] NO resource: ${e.request.url}`);
          const response = await fetch(e.request);
          return response;
        })()
      );
});

