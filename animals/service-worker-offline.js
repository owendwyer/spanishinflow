self.addEventListener("install", event => {
    console.log('OFF installed offline sw')
});

self.addEventListener("fetch", (e) => {
    console.log('OFF fetch in offline sw')
    return;
});