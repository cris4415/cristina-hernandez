const staticCache = "cristina_Scache@v1",
  dinamycCache = "cristina_Dcache@v1",
  inmutableCache = "cristina_Scache@v1";

const archivos = [
  "index.html",
  "app.js",
  "style.css",
  "images/fondo.jpg",
  "images/icons/icon-512x512.png",
  "images/icons/icon-384x384.png",
  "images/icons/icon-256x256.png",
  "images/icons/icon-192x192.png",
  "bootstrap/css/bootstrap-grid.css",
  "bootstrap/css/bootstrap-grid.css.map",
  "bootstrap/css/bootstrap-grid.min.css",
  "bootstrap/css/bootstrap-grid.min.css.map",
  "bootstrap/css/bootstrap-grid.rtl.css",
  "bootstrap/js/bootstrap.js",
  "bootstrap/css/bootstrap-grid.rtl.css.map",
  "bootstrap/css/bootstrap-grid.rtl.min.css",
  "bootstrap/css/bootstrap-grid.rtl.min.css.map",
  "bootstrap/css/bootstrap-reboot.css",
  "bootstrap/css/bootstrap-reboot.min.css",
  "bootstrap/css/bootstrap-reboot.min.css.map",
  "bootstrap/css/bootstrap-reboot.rtl.css",
  "bootstrap/css/bootstrap.css",
];
const archivos2 = [
  "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js",
  "https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js",
];

self.addEventListener("install", (event) => {
  console.log("install SW");

  const CacheStatic = caches
    .open(staticCache)
    .then((cache) => cache.addAll(archivos));

  const CacheInmutable = caches
    .open(inmutableCache)
    .then((cache) => cache.addAll(archivos2));

  event.waitUntil(Promise.all([CacheStatic, CacheInmutable]));
});

//1. Cache Only
//Sirve para mostrar la pagina entera solo con el cache
/* 
self.addEventListener("fetch", (event) => {

  event.respondWith(caches.match(event.request));

});
 */

// 2. Network Only
//Sirve para mostrar la aplicacion desde la red, puede ser intranet o internet

/* self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
}); */

// 3. Cache First
// Toma en cuenta el cache y las respuestas de la red, pero primero el cache

self.addEventListener("fetch", (event) => {
  /* const response = caches
   .match(event.request)
   .then((res) => {
     console.log("Existe el request " + event.request);
     console.log(res);
   })
   .catch((res) => {
     console.log("No existe el request " + event.request);
     console.log(res);
   });  */

  event.respondWith(
    caches.match(event.request).then((respuestaCache) => {
      return respuestaCache || fetch(event.request);
    })
  );
});

// 4. Network First
//Toma primero las peticiones que se hacen a traves de internet, despues toma el cache

/* self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).then((respuestaRed) => {
      return respuestaRed || caches.match(event.request);
    })
  );
}); */


//actualizar cache
self.addEventListener("activate", (event) => {
  const cacheList = [staticCache, dinamycCache, inmutableCache];

  console.log("Activado");
  event.waitUntil(
    caches.keys().then((cachesNames) =>
      cachesNames.map((cacheName) => {
        if (cacheList.indexOf(cacheName) === -1) {
          return caches.delete(cacheName);
        }
      })
    )
  );
});

//First cache with backup

/* self.addEventListener("fetch", (event) => {
  const resultado = caches.match(event.request).then((respuestaCache) => {
    return (
      respuestaCache ||
      fetch(event.request).then((respuestaRed) => {
        caches.open(cacheDinamyc).then((cache) => {
          cache.put(event.request, respuestaRed.clone());
          return respuestaRed;
        });
      })
    );
  });
  event.respondWith(resultado);
}); */

self.addEventListener("message", (msgClient) => {
  if (msgClient.data.action == "skipWaiting") {
    self.skipWaiting();
  }
});
