# Remitos Zona Race

App web (PWA) para generar remitos de Zona Race desde el celular. Corre **100% en
el teléfono**: no hay servidor, no hay base de datos y no se guarda nada entre
remito y remito. Los dos PDF se arman en el navegador con jsPDF.

## Cómo se usa

1. Completás fecha, cliente, dirección de envío y a quién se le entrega.
2. Cargás los productos: se eligen del desplegable (el precio se autocompleta y
   se puede editar) o se agrega un **producto libre** escribiendo nombre y precio
   a mano.
3. Tocás **Generar remitos**. Salen dos PDF con el mismo contenido:
   - `...-cliente.pdf` — con espacio de firma al pie.
   - `...-interno.pdf` — igual, sin firma.

En Android se abre el menú de compartir con los dos archivos juntos (WhatsApp,
Drive, Archivos, etc.). Si el teléfono no soporta compartir archivos, los dos PDF
se descargan.

Los campos obligatorios son **fecha** y **cliente**, más al menos un producto. Si
dejás vacía la dirección o la persona que recibe, esos renglones directamente no
aparecen en el PDF.

## Cómo instalarla en el celular

La app necesita estar servida por HTTPS (o `localhost`) para instalarse y
funcionar sin conexión. La forma más simple es GitHub Pages:

1. En GitHub: **Settings → Pages → Source: Deploy from a branch**, y elegí la rama
   donde está este código (carpeta `/root`).
2. Abrí la URL que te da GitHub en **Chrome de Android**.
3. Menú ⋮ → **Instalar app** / **Agregar a pantalla de inicio**.

Después de instalarla podés abrirla en modo avión: el service worker (`sw.js`)
deja en caché todos los archivos, incluida la librería de PDF.

Para probarla en la compu, desde la carpeta del proyecto:

```
npx http-server -p 8123
# y abrís http://127.0.0.1:8123
```

## Editar el catálogo de productos

Todo el catálogo está en **`catalogo.js`**, en una lista fácil de tocar a mano:

```js
{ codigo: "R9", nombre: "Base R9 V3 Direct Drive Wheel Base", precioUnitario: 837807 },
```

El precio va sin `$`, sin puntos de miles y con punto decimal (`12345.50`). El
orden de la lista es el orden del desplegable. El `codigo` es de referencia
interna: la app y el remito muestran `nombre` y `precioUnitario`.

**Importante:** después de cambiar cualquier archivo de la app, subí el número de
`VERSION` en `sw.js` y el de `VERSION_APP` en `app.js` (los dos juntos). El
segundo es el que se ve al pie de la pantalla: sirve para confirmar de un vistazo
qué versión está corriendo un teléfono.

Los archivos de la app se piden primero a la red, así que un cambio de precios
llega con abrir la app; el número de versión al pie te dice si el teléfono ya lo
tomó. Si quedó pegada una versión vieja, en el navegador: borrar los datos del
sitio; si está instalada como app, sacarla de la pantalla de inicio y volver a
agregarla.

## Cambiar el logo

El logo que viene es un isotipo ZR de reemplazo. Para poner el propio:

- Reemplazá **`assets/logo.png`** por el PNG con fondo transparente (cuadrado,
  512×512 o similar). Se usa en el encabezado de la app y en los dos PDF; la app
  se adapta sola a la proporción de la imagen.
- Opcionalmente reemplazá `assets/icon-192.png` y `assets/icon-512.png`, que son
  los íconos de la pantalla de inicio.

En el PDF el logo va sobre una placa oscura, porque el isotipo plateado sobre
papel blanco no se leería.

## Qué no hace (a propósito)

- No guarda historial de remitos ni numeración: cada remito es un evento aislado.
  No usa `localStorage` ni `IndexedDB`.
- No tiene login ni usuarios, ni stock ni inventario.
- No pide nada a internet mientras se usa: jsPDF está vendorizada en `vendor/`.
- El PDF no lleva número de remito, ni dirección o datos del local, ni fecha
  automática: la fecha que se imprime es exactamente la que escribió el usuario.

## Archivos

```
index.html      pantalla del formulario (incluye los estilos)
app.js          lógica del formulario, cálculos y armado de los PDF
catalogo.js     lista de productos y precios  ← lo que se edita seguido
manifest.json   datos de la PWA (nombre, íconos, colores)
sw.js           service worker: caché para que ande sin conexión
assets/         logo e íconos
vendor/         jsPDF 2.5.2 (MIT), incluida para funcionar offline
```
