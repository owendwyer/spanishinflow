
const urlsToCache = [ 
    "https://www.spanishinflow.com/offline.html",
    "https://www.spanishinflow.com/css/span.css",
    "https://www.spanishinflow.com/manifest-offline.json",
    "https://www.spanishinflow.com/res/mySprite.png",
    "https://www.spanishinflow.com/res/siteLogo.png",
    "https://www.spanishinflow.com/js/all.min.5.3.js",
    "https://www.spanishinflow.com/js/createjs-2015.11.26.min.js"
];

for(let i=0;i<22;i++){
    let audUrl='https://www.spanishinflow.com/content_2/audio/es/use/s_'+i+'.ogg';
    let audAltUrl='https://www.spanishinflow.com/content_2/audio/es/use/s_'+i+'.mp3';
    let imUrl='https://www.spanishinflow.com/content_2/images/use/s_'+i+'.png';
    urlsToCache.push(audAltUrl);
    urlsToCache.push(audUrl);
    urlsToCache.push(imUrl);
}

self.addEventListener("install", event => {
    self.skipWaiting();
    console.log('OFF installed offline sw')
});

self.addEventListener("message", (event) =>{
    console.log('Message received',event.data);
    if(event.data.type==='APP_INSTALLED'){
        caches.open("pwa-assets").then(cache => {
            console.log('cache open')
            return cache.addAll(urlsToCache);
        })
    }
    // isInstalled=true;
  }
);

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

