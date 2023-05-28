self.addEventListener("install", event => {
    self.skipWaiting();
    console.log('ON installed online sw - no fetch')
});
