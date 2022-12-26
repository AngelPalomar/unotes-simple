/* eslint-disable no-restricted-globals */
//Estrategias de cache  
//APP SHEL
const CACHE_DYNAMIC = 'dinamyc-unotes-uteq-pwa'
const CACHE_STATIC = 'static-unotes-uteq-pwa'
const CACHE_INMUTABLE = 'inmutable-unotes-uteq-pwa'

function limpiarCache(cacheName, numeroItem) {
    //Agregar función debajo del put en dynamic  -> limpiarCache(CACHE_DYNAMIC,5)
    caches.open(cacheName)
        .then(cache => {
            return cache.keys()
                .then(keys => {
                    if (keys.length > numeroItem) {
                        cache.delete(keys[0])
                            .then(limpiarCache(cacheName, numeroItem))
                    }
                })
        })
}

self.addEventListener('install', event => {
    const cacheStatico = caches.open(CACHE_STATIC)
        .then(cache => {

            return cache.addAll([
                '/',
                'index.html',
                'config.js',
                'favicon.ico',
                'static/js/main.f0f1d1fb.js',
                'static/css/main.e6c13ad2.css'
            ])
        })
    const cacheInmutable = caches.open(CACHE_INMUTABLE)
        .then(cache => {

            return cache.addAll([
                'https://fonts.googleapis.com/css2?family=Nunito&display=swap',
                'https://fonts.gstatic.com/s/nunito/v25/XRXI3I6Li01BKofiOc5wtlZ2di8HDLshdTQ3jw.woff2'
            ])

        })
    event.waitUntil(Promise.all([cacheStatico, cacheInmutable]))
})

//Cache dinámico 

self.addEventListener('fetch', event => {

    const respuesta = caches.match(event.request)
        .then(res => {
            if (res) return res
            //No existe- ir a la web
            console.log('No existe', event.request.url)

            return fetch(event.request).then(newResp => {
                caches.open(CACHE_DYNAMIC)
                    .then(cache => {
                        cache.put(event.request, newResp)
                        limpiarCache(CACHE_DYNAMIC, 5)
                    })


                return newResp.clone()
            })
        })
    event.respondWith(respuesta)
})
