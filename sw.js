/*
 * Service worker de Remitos Zona Race.
 * Guarda en caché los archivos de la app para que funcione sin internet.
 * No cachea ni guarda ningún remito: los PDF se arman en el momento y no se
 * escriben en ningún lado.
 *
 * Estrategia:
 *   - Los archivos de la app (index.html, app.js, catalogo.js, manifest.json)
 *     se piden PRIMERO a la red y se cae al caché sólo si no hay señal. Así una
 *     actualización de precios llega al toque y nunca queda una versión vieja
 *     pegada en el teléfono.
 *   - El resto (librería de PDF, logo, íconos) va del caché primero, porque no
 *     cambia salvo que se suba la VERSION.
 *
 * Si cambiás algún archivo de la app, subí VERSION acá y VERSION_APP en app.js.
 */
var VERSION = "zr-remitos-v4";

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

var DE_LA_APP = /(^|\/)(index\.html|app\.js|catalogo\.js|manifest\.json)$/;

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

function guardar(request, respuesta) {
  if (respuesta && respuesta.ok && respuesta.type === "basic") {
    var copia = respuesta.clone();
    caches.open(VERSION).then(function (cache) { cache.put(request, copia); });
  }
  return respuesta;
}

// ignoreSearch: los reintentos de carga piden "archivo.js?reintento=123";
// sin esto no encontrarían la copia en caché y fallarían sin conexión.
function delCache(request) {
  return caches.match(request, { ignoreSearch: true });
}

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;

  var url;
  try { url = new URL(e.request.url); } catch (err) { return; }
  if (url.origin !== self.location.origin) return;

  var esApp = e.request.mode === "navigate" ||
    DE_LA_APP.test(url.pathname) ||
    url.pathname === self.registration.scope.replace(self.location.origin, "");

  if (esApp) {
    // Red primero: la versión publicada manda.
    e.respondWith(
      fetch(e.request).then(function (res) {
        return guardar(e.request, res);
      }).catch(function () {
        return delCache(e.request).then(function (hit) {
          return hit || caches.match("./index.html");
        });
      })
    );
    return;
  }

  // Resto: caché primero, y si no está se busca y se guarda.
  e.respondWith(
    delCache(e.request).then(function (hit) {
      return hit || fetch(e.request).then(function (res) {
        return guardar(e.request, res);
      }).catch(function () {
        return Response.error();
      });
    })
  );
});
