importScripts('serviceworker-cache-polyfill.js');

var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/',
  '/styles/main.css',
  '/script/main.js'
];

self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', function (event) {

  var cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) !== -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

var iteration = 0;

function stealMashape(event) {
  if (event.request.url.indexOf('mashape.com') !== -1 && ++iteration % 3 === 0) {
    var parts = ['Test']; // an array consisting of a single DOMString
    var blob = new Blob(parts, {type: 'text/plain'}); // the blob
    var resp = new Response(blob, {
      status: 200,
      statusText: 'OK'
    });
    event.respondWith(resp);
    return true;
  }
}

self.addEventListener('fetch', function (event) {
  if (stealMashape(event)) {
    return;
  }
  if (event.request.method !== 'GET') {
    return event.respondWith(fetch(event.request));
  }
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function (response) {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            var responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(function (cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});
