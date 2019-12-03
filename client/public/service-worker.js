const FILES_TO_CACHE = [
  "./index.html",
  "./assets/images/icons/icon-72x72.png",
  "./assets/images/icons/icon-96x96.jpg",
  "./assets/images/icons/icon-128x128.jpg",
  "./assets/images/icons/icon-144x144.jpg",
  "./assets/images/icons/icon-152x152.jpg",
  "./assets/images/icons/icon-192x192.jpg",
  "./assets/images/icons/icon-384x384.jpg",
  "./assets/images/icons/icon-512x512.jpg"
];

const CACHE_NAME = "juan";
const DATA_CACHE_NAME = "chino";
self.addEventListener("install", function(evt) {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Your files were pre-cached successfully!");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});
self.addEventListener("activate", function(evt) {
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});
self.addEventListener("fetch", function(evt) {
  if (evt.request.url.includes("/api/")) {
    evt.respondWith(
      caches
        .open(DATA_CACHE_NAME)
        .then(cache => {
          return fetch(evt.request)
            .then(response => {
              if (response.status === 200) {
                cache.put(evt.request.url, response.clone());
              }
              return response;
            })
            .catch(err => {
              return cache.match(evt.request);
            });
        })
        .catch(err => {
          console.log(err);
        })
    );
    return;
  }
  evt.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(evt.request).then(response => {
        return response || fetch(evt.request);
      });
    })
  );
});
