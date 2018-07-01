var cacheName = 'v1';

// Default files to always cache
let cacheFiles = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './lib/idb.js',
    'https://fonts.googleapis.com/css?family=Roboto'
];

self.addEventListener('install', (e) => {
    console.log('[ServiceWorker] Installed');

    // e.waitUntil Delays the event until the Promise is resolved
    e.waitUntil(

    	// Open the cache
	    caches.open(cacheName).then((cache) => {

	    	// Add all the default files to the cache
			console.log('[ServiceWorker] Caching cacheFiles');
			return cache.addAll(cacheFiles).then((ce) => {
                console.log(ce);
            }).catch((err) => {
                console.log(err);
            });
	    })
	); // end e.waitUntil
});

self.addEventListener('activate', (e) => {
    console.log('[ServiceWorker] Activated');

    e.waitUntil(

    	// Get all the cache keys (cacheName)
		caches.keys().then((cacheNames) => {
			return Promise.all(cacheNames.map((thisCacheName) => {

				// If a cached item is saved under a previous cacheName
				if (thisCacheName !== cacheName) {

					// Delete that cached file
					console.log('[ServiceWorker] Removing Cached Files from Cache - ', thisCacheName);
					return caches.delete(thisCacheName);
				}
			}));
		})
	); // end e.waitUntil

});


self.addEventListener('fetch', (fe) => {
	console.log(fe.request);
    console.log('[Service Worker] ', fe.request.url);

    // e.respondWidth Responds to the fetch event
	fe.respondWith(

		// Check in cache for the request being made
		caches.match(fe.request)


			.then(function(response) {

                console.log(response);

				// If the request is in the cache
				if ( response ) {
					console.log("[ServiceWorker] Found in Cache", fe.request.url, response);
					// Return the cached version
					return response;
				}

				// If the request is NOT in the cache, fetch and cache

                const requestClone = fe.request.clone();
                console.log(requestClone);
				return fetch(requestClone)
					.then(function(response) {

						if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

						var responseClone = response.clone();

						//  Open the cache
						caches.open(cacheName).then(function(cache) {
                            console.log(cache);

							// Put the fetched response in the cache
							cache.put(fe.request, responseClone);
							console.log('[ServiceWorker] New Data Cached', fe.request.url);

							// Return the response
							return response;
			
				        }); // end caches.open

					})
					.catch(function(err) {
						console.log('[ServiceWorker] Error Fetching & Caching New Data', err);
					});
			}).catch(err => {
                console.log('err');
            }) // end caches.match(e.request)
	); // end e.respondWith
})