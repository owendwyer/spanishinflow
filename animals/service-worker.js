self.addEventListener("install", event => {
    self.skipWaiting();
    console.log('ON installed online sw')
});

self.addEventListener("fetch", (e) => {
    console.log('ON fetch in online sw')
    return;
});