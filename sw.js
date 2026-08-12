/*
 * Service worker de Remitos Zona Race.
 * Guarda en caché los archivos de la app para que funcione sin internet.
 * No cachea ni guarda ningún remito: los PDF se arman en el momento y no se
 * escriben en ningún lado.
 *
 * Si cambiás algún archivo de la app (por ejemplo catalogo.js), subí el número
 * de VERSION para que los teléfonos ya instalados se actualicen.
 */
var VERSION = "zr-remitos-v3";

var ARCHIVOS = [
  "./",
  "./index.html",
  "./app.js",
  "./catalogo.js",
  "./manifest.json",
  "./vendor/jspdf.umd.min.js",
  "./assets/logo.png",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(VERSION).then(function (cache) {
      return cache.addAll(ARCHIVOS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (claves) {
      return Promise.all(
        claves.map(function (k) {
          return k === VERSION ? null : caches.delete(k);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

// Cache primero: la app abre igual de rápido con o sin señal.
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;

  // ignoreSearch: los reintentos de carga piden "archivo.js?reintento=123";
  // sin esto no encontrarían la copia en caché y fallarían sin conexión.
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(function (hit) {
      if (hit) return hit;
      return fetch(e.request).then(function (res) {
        // Guardamos copia de lo que sea de la propia app.
        if (res && res.ok && res.type === "basic") {
          var copia = res.clone();
          caches.open(VERSION).then(function (cache) {
            cache.put(e.request, copia);
          });
        }
        return res;
      }).catch(function () {
        // Sin conexión y sin caché: si es una navegación, devolvemos la app.
        if (e.request.mode === "navigate") return caches.match("./index.html");
        return Response.error();
      });
    })
  );
});
