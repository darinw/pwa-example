'use strict';
var version = 'V1.0.0';
self.addEventListener('install', function(event) {
  // if(event.target.registration.scope.indexOf('tournamentdepot.com') !== -1) {
  event.waitUntil(
    caches.open(version).then(function(cache) {
      return cache.addAll(['/pwa/', '/pwa/index.html', '/pwa/index.js', '/pwa/index.css', '/pwa/manifest.json', '/pwa/sw.js']);
    })
  );
  // } else {

  // }
});

// this is code to cache and retrieve rest calls. in my case, i will return the cached version instantly then update it if somehting changes..
// it makes the app appear much faster.
self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request));
});

self.onfetch = function(event) {
  var requestURL = new URL(event.request.url);

  // you can target specific urls
  if (requestURL.href.indexOf('rest') !== -1) {
    console.info(requestURL.href);
    event.respondWith(restCallResponse(event.request));
  } else if (requestURL.hostname === 'tournamentdepot.com') {
    console.log('Handling fetch event for', event.request.url);
    event.respondWith(
      caches.match(event.request).then(function(response) {
        if (response) {
          console.log('Found response in cache:', response);
          return response;
        }
        console.log('No response found in cache. About to fetch from network...');
        return fetch(event.request)
          .then(function(response) {
            console.log('Response from network is:', response);
            return response;
          })
          .catch(function(error) {
            console.error('Fetching failed:', error);
            throw error;
          });
      })
    );
  } else {
    // if you get here it will act normal.
  }
};

function restCallResponse(request) {
  if (request.headers.get('x-use-cache-only')) {
    return caches.match(request);
  } else {
    return fetch(request).then(function(response) {
      return caches.open(version).then(function(cache) {
        // clean up the image cache
        Promise.all([response.clone().json(), caches.open(version)]).then(function(results) {
          var data = results[0];
          var cache = results[1];

          console.log(data);
          console.log(cache);
        });

        cache.put(request, response.clone());

        return response;
      });
    });
  }
}
