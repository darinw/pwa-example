window.addEventListener('load', function() {
  try {
    var swPath = '/pwa/sw.js';

    navigator.serviceWorker
      .register(swPath, { scope: './' })
      .then(function(r) {
        console.log('registered service worker');
      })
      .catch(function(e) {
        console.error('uh oh...', e);
      });
  } catch (e) {
    // this is IE...
  }
});
