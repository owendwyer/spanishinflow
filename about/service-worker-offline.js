
const urlsToCache = [ 
    "https://www.spanishinflow.com/about/offline.html",
    "https://www.spanishinflow.com/about/css/span.css",
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
    console.log('OFF fetch in offline sw')
    console.log(`resource: ${e.request.url}`);

    e.respondWith(
        (async () => {
          const r = await caches.match(e.request);
          console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
          if (r) {
            return r;
          }
          console.log(`[Service Worker] no resource for: ${e.request.url}`);
          const response = await fetch(e.request);
          return response;
        })()
      );
});

