/*
 * Remitos Zona Race — app 100% local.
 * No hay backend, no se guarda nada: cada remito es un evento aislado.
 */
(function () {
  "use strict";

  var jsPDF = window.jspdf.jsPDF;

  // ---------------------------------------------------------------- utilidades

  function $(id) { return document.getElementById(id); }

  var nf = new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Formato propio en vez de style:"currency" para evitar espacios raros
  // (U+202F) que jsPDF no dibuja bien con las fuentes estándar.
  function money(n) {
    return "$ " + nf.format(isFinite(n) ? n : 0);
  }

  function num(valor) {
    var n = parseFloat(String(valor).replace(",", "."));
    return isFinite(n) ? n : 0;
  }

  function limpio(str) {
    return String(str || "").trim();
  }

  function slug(str) {
    return limpio(str)
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Za-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "sin-datos";
  }

  var avisoTimer = null;
  function avisar(texto, esError) {
    var el = $("aviso");
    el.textContent = texto;
    el.className = "visible" + (esError ? " error" : "");
    clearTimeout(avisoTimer);
    avisoTimer = setTimeout(function () { el.className = ""; }, 3500);
  }

  // ------------------------------------------------------------------- logo

  // Se precarga a data URL al iniciar: así "Generar remitos" es 100% sincrónico
  // y Android no pierde el gesto del usuario al abrir el menú de compartir.
  var LOGO = null;

  function precargarLogo() {
    var img = $("logo");
    function convertir() {
      try {
        var c = document.createElement("canvas");
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        c.getContext("2d").drawImage(img, 0, 0);
        LOGO = { data: c.toDataURL("image/png"), w: c.width, h: c.height };
      } catch (e) {
        LOGO = null; // sin logo el remito se genera igual
      }
    }
    if (img.complete && img.naturalWidth) convertir();
    else img.addEventListener("load", convertir, { once: true });
  }

  // ------------------------------------------------------- líneas de producto

  var LIBRE = "libre";
  var uid = 0;

  function crearLinea() {
    uid++;
    var id = uid;
    var div = document.createElement("div");
    div.className = "linea";

    var opciones = ['<option value="">Elegí un producto…</option>'];
    for (var i = 0; i < CATALOGO.length; i++) {
      opciones.push('<option value="' + i + '">' + escapar(CATALOGO[i].nombre) + "</option>");
    }
    opciones.push('<option value="' + LIBRE + '">➜ Producto libre (a mano)</option>');

    div.innerHTML =
      '<div class="linea-top">' +
        '<span class="n"></span>' +
        '<span class="titulo">Sin elegir</span>' +
        '<button type="button" class="quitar" data-accion="quitar">Quitar</button>' +
      "</div>" +
      '<div class="campo">' +
        '<label for="prod' + id + '">Producto</label>' +
        '<select id="prod' + id + '" class="sel">' + opciones.join("") + "</select>" +
      "</div>" +
      '<div class="campo libre-wrap" hidden>' +
        '<label for="libre' + id + '">Nombre del producto</label>' +
        '<input id="libre' + id + '" class="libre" type="text" autocomplete="off" placeholder="Ej: Kit de bieletas a medida">' +
      "</div>" +
      '<div class="grid-3">' +
        "<div>" +
          '<label for="cant' + id + '">Cantidad</label>' +
          '<input id="cant' + id + '" class="cant" type="number" inputmode="decimal" step="any" min="0" value="1">' +
        "</div>" +
        "<div>" +
          '<label for="pu' + id + '">Precio unitario</label>' +
          '<input id="pu' + id + '" class="pu" type="number" inputmode="decimal" step="any" min="0" placeholder="0">' +
        "</div>" +
        '<div class="ancho">' +
          '<label for="sub' + id + '">Subtotal</label>' +
          '<input id="sub' + id + '" class="sub" type="text" readonly value="$ 0,00">' +
        "</div>" +
      "</div>";

    $("lineas").appendChild(div);
    renumerar();
    return div;
  }

  function escapar(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function renumerar() {
    var filas = $("lineas").querySelectorAll(".linea");
    for (var i = 0; i < filas.length; i++) {
      filas[i].querySelector(".n").textContent = i + 1;
      // La última línea no se puede quitar: siempre queda una.
      filas[i].querySelector(".quitar").disabled = filas.length === 1;
      filas[i].querySelector(".quitar").style.visibility = filas.length === 1 ? "hidden" : "visible";
    }
  }

  function leerLinea(div) {
    var sel = div.querySelector(".sel").value;
    var nombre;
    if (sel === LIBRE) nombre = limpio(div.querySelector(".libre").value);
    else if (sel !== "") nombre = CATALOGO[+sel].nombre;
    else nombre = "";

    var cantidad = num(div.querySelector(".cant").value);
    var precio = num(div.querySelector(".pu").value);
    return { nombre: nombre, cantidad: cantidad, precio: precio, subtotal: cantidad * precio };
  }

  function recalcular() {
    var filas = $("lineas").querySelectorAll(".linea");
    var total = 0;
    for (var i = 0; i < filas.length; i++) {
      var l = leerLinea(filas[i]);
      filas[i].querySelector(".sub").value = money(l.subtotal);
      filas[i].querySelector(".titulo").textContent = l.nombre || "Sin elegir";
      total += l.subtotal;
    }
    $("total").textContent = money(total);
    return total;
  }

  // Eventos delegados sobre el contenedor de líneas.
  $("lineas").addEventListener("input", function (e) {
    if (e.target.classList.contains("libre")) e.target.classList.remove("invalido");
    recalcular();
  });

  $("lineas").addEventListener("change", function (e) {
    if (e.target.classList.contains("sel")) {
      var div = e.target.closest(".linea");
      var v = e.target.value;
      var wrap = div.querySelector(".libre-wrap");
      wrap.hidden = v !== LIBRE;
      if (v === LIBRE) {
        div.querySelector(".pu").value = "";
        div.querySelector(".libre").focus();
      } else if (v !== "") {
        // El precio del catálogo se autocompleta, pero queda editable.
        div.querySelector(".pu").value = CATALOGO[+v].precioUnitario;
      }
      e.target.classList.remove("invalido");
      recalcular();
    }
  });

  $("lineas").addEventListener("click", function (e) {
    var btn = e.target.closest('[data-accion="quitar"]');
    if (!btn) return;
    var filas = $("lineas").querySelectorAll(".linea");
    if (filas.length === 1) return;
    btn.closest(".linea").remove();
    renumerar();
    recalcular();
  });

  $("btnAgregar").addEventListener("click", function () {
    var div = crearLinea();
    div.querySelector(".sel").focus();
    div.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  // ------------------------------------------------------------- lectura/validación

  function leerFormulario() {
    var datos = {
      fecha: limpio($("fecha").value),
      cliente: limpio($("cliente").value),
      direccion: limpio($("direccion").value),
      receptor: limpio($("receptor").value),
      items: [],
      total: 0,
    };
    var filas = $("lineas").querySelectorAll(".linea");
    for (var i = 0; i < filas.length; i++) {
      var l = leerLinea(filas[i]);
      if (!l.nombre && !l.precio) continue; // fila vacía: se ignora
      datos.items.push(l);
      datos.total += l.subtotal;
    }
    return datos;
  }

  function validar() {
    var faltante = null;

    ["fecha", "cliente"].forEach(function (campo) {
      var el = $(campo);
      var vacio = !limpio(el.value);
      el.classList.toggle("invalido", vacio);
      if (vacio && !faltante) faltante = { el: el, msg: campo === "fecha" ? "Cargá la fecha." : "Cargá el nombre del cliente." };
    });

    var filas = $("lineas").querySelectorAll(".linea");
    var validas = 0;
    for (var i = 0; i < filas.length; i++) {
      var div = filas[i];
      var l = leerLinea(div);
      var sel = div.querySelector(".sel");
      var libre = div.querySelector(".libre");
      var vacia = !l.nombre && !l.precio && !div.querySelector(".sel").value;

      sel.classList.remove("invalido");
      libre.classList.remove("invalido");
      if (vacia) continue;

      if (!l.nombre) {
        var campo = sel.value === LIBRE ? libre : sel;
        campo.classList.add("invalido");
        if (!faltante) faltante = { el: campo, msg: "Falta el nombre del producto " + (i + 1) + "." };
        continue;
      }
      if (l.cantidad <= 0) {
        var c = div.querySelector(".cant");
        c.classList.add("invalido");
        if (!faltante) faltante = { el: c, msg: "La cantidad del producto " + (i + 1) + " tiene que ser mayor a 0." };
        continue;
      }
      validas++;
    }

    if (!validas && !faltante) faltante = { el: filas[0].querySelector(".sel"), msg: "Agregá al menos un producto." };

    if (faltante) {
      avisar(faltante.msg, true);
      faltante.el.scrollIntoView({ behavior: "smooth", block: "center" });
      try { faltante.el.focus({ preventScroll: true }); } catch (e) {}
      return false;
    }
    return true;
  }

  // ----------------------------------------------------------------- PDF

  var M = 18;            // margen izquierdo
  var DER = 192;         // margen derecho (A4 = 210mm)
  var ANCHO = DER - M;   // 174mm
  var PIE = 285;         // límite inferior de la hoja

  var NARANJA = [248, 124, 20];
  var NEGRO = [26, 26, 26];
  var GRIS = [125, 125, 125];

  function encabezado(doc) {
    // Placa oscura con el logo: sobre papel blanco el isotipo plateado
    // necesita fondo oscuro para leerse.
    doc.setFillColor(20, 20, 20);
    doc.roundedRect(M, 13, 24, 24, 4, 4, "F");

    if (LOGO) {
      var caja = 19;
      var esc = Math.min(caja / LOGO.w, caja / LOGO.h);
      var w = LOGO.w * esc, h = LOGO.h * esc;
      doc.addImage(LOGO.data, "PNG", M + 12 - w / 2, 25 - h / 2, w, h);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);
    doc.setTextColor(NEGRO[0], NEGRO[1], NEGRO[2]);
    doc.text("ZONA RACE", M + 30, 27.5);

    doc.setFontSize(15);
    doc.setTextColor(GRIS[0], GRIS[1], GRIS[2]);
    doc.text("REMITO", DER, 27.5, { align: "right", charSpace: 1.2 });

    doc.setDrawColor(NARANJA[0], NARANJA[1], NARANJA[2]);
    doc.setLineWidth(0.9);
    doc.line(M, 42, DER, 42);

    return 42;
  }

  function bloqueDatos(doc, y, datos) {
    var campos = [];
    if (datos.fecha) campos.push(["Fecha", datos.fecha]);
    if (datos.cliente) campos.push(["Cliente", datos.cliente]);
    if (datos.direccion) campos.push(["Dirección de envío", datos.direccion]);
    if (datos.receptor) campos.push(["Se entrega a", datos.receptor]);
    if (!campos.length) return y;

    var colW = 76, x1 = M + 6, x2 = x1 + colW + 10;
    var padY = 7;

    // Primera pasada: medir para saber el alto del panel.
    var filas = [];
    for (var i = 0; i < campos.length; i += 2) {
      var par = campos.slice(i, i + 2).map(function (c) {
        return { label: c[0], lineas: doc.splitTextToSize(c[1], colW) };
      });
      var alto = 0;
      par.forEach(function (c) { alto = Math.max(alto, 4 + c.lineas.length * 5); });
      filas.push({ par: par, alto: alto });
    }
    var altoPanel = padY * 2 + filas.reduce(function (a, f) { return a + f.alto; }, 0) +
      (filas.length - 1) * 5;

    doc.setFillColor(246, 246, 246);
    doc.roundedRect(M, y + 8, ANCHO, altoPanel, 2, 2, "F");

    var cursor = y + 8 + padY;
    filas.forEach(function (fila) {
      fila.par.forEach(function (c, idx) {
        var x = idx === 0 ? x1 : x2;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(140, 140, 140);
        doc.text(c.label.toUpperCase(), x, cursor, { charSpace: 0.4 });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10.5);
        doc.setTextColor(NEGRO[0], NEGRO[1], NEGRO[2]);
        doc.text(c.lineas, x, cursor + 5.5);
      });
      cursor += fila.alto + 5;
    });

    return y + 8 + altoPanel;
  }

  // Geometría de la tabla
  var COL_PROD = M + 4;        // 22
  var COL_PROD_W = 84;
  var COL_CANT = 118;          // centrado
  var COL_PU = 158;            // alineado a la derecha
  var COL_SUB = DER - 4;       // 188, alineado a la derecha

  function cabeceraTabla(doc, y) {
    doc.setFillColor(29, 29, 29);
    doc.rect(M, y, ANCHO, 9, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text("PRODUCTO", COL_PROD, y + 6, { charSpace: 0.4 });
    doc.text("CANT.", COL_CANT, y + 6, { align: "center", charSpace: 0.4 });
    doc.text("P. UNITARIO", COL_PU, y + 6, { align: "right", charSpace: 0.4 });
    doc.text("SUBTOTAL", COL_SUB, y + 6, { align: "right", charSpace: 0.4 });
    return y + 9;
  }

  function cantidadTexto(n) {
    return Number.isInteger(n) ? String(n) : nf.format(n);
  }

  function tablaProductos(doc, y, items) {
    y = cabeceraTabla(doc, y);
    doc.setFontSize(10);

    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      doc.setFont("helvetica", "normal");
      var lineas = doc.splitTextToSize(it.nombre, COL_PROD_W);
      var alto = Math.max(10, lineas.length * 4.8 + 5);

      if (y + alto > 258) {          // corte de página
        doc.addPage();
        encabezado(doc);
        y = cabeceraTabla(doc, 52);
      }

      // El encabezado y la cabecera de tabla dejan la fuente en negrita.
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      if (i % 2 === 1) {
        doc.setFillColor(248, 248, 248);
        doc.rect(M, y, ANCHO, alto, "F");
      }

      var baseY = y + 6.5;
      doc.setTextColor(NEGRO[0], NEGRO[1], NEGRO[2]);
      doc.text(lineas, COL_PROD, baseY);
      doc.text(cantidadTexto(it.cantidad), COL_CANT, baseY, { align: "center" });
      doc.setTextColor(70, 70, 70);
      doc.text(money(it.precio), COL_PU, baseY, { align: "right" });
      doc.setFont("helvetica", "bold");
      doc.setTextColor(NEGRO[0], NEGRO[1], NEGRO[2]);
      doc.text(money(it.subtotal), COL_SUB, baseY, { align: "right" });

      y += alto;
      doc.setDrawColor(226, 226, 226);
      doc.setLineWidth(0.2);
      doc.line(M, y, DER, y);
    }
    return y;
  }

  function bloqueTotal(doc, y, total) {
    var alto = 15, ancho = 82, x = DER - ancho;
    doc.setFillColor(20, 20, 20);
    doc.roundedRect(x, y, ancho, alto, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(190, 190, 190);
    doc.text("TOTAL", x + 6, y + 9.5, { charSpace: 1 });

    doc.setFontSize(14);
    doc.setTextColor(NARANJA[0], NARANJA[1], NARANJA[2]);
    doc.text(money(total), DER - 6, y + 10, { align: "right" });

    return y + alto;
  }

  function bloqueFirma(doc, y) {
    var yF = Math.max(y + 34, 252);
    if (yF + 12 > PIE) {
      doc.addPage();
      encabezado(doc);
      yF = 90;
    }
    doc.setDrawColor(140, 140, 140);
    doc.setLineWidth(0.4);
    doc.line(112, yF, DER, yF);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(110, 110, 110);
    doc.text("Firma del cliente", (112 + DER) / 2, yF + 6, { align: "center" });
  }

  /**
   * Arma un remito completo. `conFirma` es la única diferencia entre la copia
   * del cliente y la interna: el contenido es idéntico.
   */
  function crearRemito(datos, conFirma) {
    var doc = new jsPDF({ unit: "mm", format: "a4" });
    var y = encabezado(doc);
    y = bloqueDatos(doc, y, datos);
    y = tablaProductos(doc, y + 10, datos.items);

    if (y + 22 > 262) {
      doc.addPage();
      encabezado(doc);
      y = 52;
    }
    y = bloqueTotal(doc, y + 7, datos.total);

    if (conFirma) bloqueFirma(doc, y);
    return doc;
  }

  // ------------------------------------------------------- descarga / compartir

  function descargar(blob, nombre) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
  }

  function generar() {
    if (!validar()) return;

    var datos = leerFormulario();
    var base = "Remito-" + slug(datos.cliente) + "-" + slug(datos.fecha);

    var archivos;
    try {
      archivos = [
        { nombre: base + "-cliente.pdf", blob: crearRemito(datos, true).output("blob") },
        { nombre: base + "-interno.pdf", blob: crearRemito(datos, false).output("blob") },
      ];
    } catch (e) {
      avisar("No se pudo generar el PDF: " + e.message, true);
      return;
    }

    // 1) Menú de compartir de Android con los dos PDF juntos.
    if (typeof File === "function" && navigator.canShare) {
      var files = archivos.map(function (a) {
        return new File([a.blob], a.nombre, { type: "application/pdf" });
      });
      if (navigator.canShare({ files: files })) {
        navigator.share({ files: files, title: "Remito Zona Race" })
          .catch(function (err) {
            if (err && (err.name === "AbortError" || err.name === "NotAllowedError")) return;
            bajarTodo(archivos);
          });
        return;
      }
    }
    // 2) Si el dispositivo no puede compartir archivos, se descargan.
    bajarTodo(archivos);
  }

  function bajarTodo(archivos) {
    descargar(archivos[0].blob, archivos[0].nombre);
    // Chrome Android encadena mejor la segunda descarga con un respiro.
    setTimeout(function () {
      descargar(archivos[1].blob, archivos[1].nombre);
      avisar("Listo: remito del cliente + remito interno.");
    }, 500);
  }

  $("btnGenerar").addEventListener("click", generar);

  // ------------------------------------------------------------------- arranque

  precargarLogo();
  crearLinea();
  recalcular();

  ["fecha", "cliente"].forEach(function (campo) {
    $(campo).addEventListener("input", function () { this.classList.remove("invalido"); });
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }
})();
