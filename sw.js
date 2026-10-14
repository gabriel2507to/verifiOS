const CACHE_NAME = 'verifios-v1';
const ASSETS = [
  'index2.html',
  'manifest.json',
  'img/logo-app.png',
  'img/logo-app-512.png'
];

// 1. Instalación: Guarda los archivos en caché
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// 2. Activación: Limpia las cachés viejas si cambias de versión
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Borrando caché antigua:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Interceptar peticiones (Estrategia: Network First / Red primero)
self.addEventListener('fetch', (e) => {
 
  if (e.request.method !== 'GET') {
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        return caches.match(e.request);
      })
  );
});
