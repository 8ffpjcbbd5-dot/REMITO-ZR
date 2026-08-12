/*
 * Catálogo de productos de Zona Race.
 *
 * Para editarlo: agregá, sacá o modificá objetos de la lista de abajo.
 * Cada producto es { nombre: "...", precioUnitario: 12345 }
 * El precio va sin símbolo, sin puntos de miles y con punto decimal (ej: 12345.50).
 * El orden de esta lista es el orden en que aparecen en el desplegable.
 */
// Catálogo Zona Race — corregido con códigos reales
// NOTA: esta es la lista de datos. Puede que la estructura exacta de variables/export
// no coincida 1 a 1 con el catalogo.js actual del repo — pasale este archivo a Claude Code
// y pedile que reemplace los datos manteniendo la estructura que ya usa la app,
// y que suba la VERSION en sw.js.

const catalogo = [
  { codigo: "R3", nombre: "R3 Racing Simulator Bundles (R3 Base+ES Lite Wheel+SR-P Lite Pedals+Table Clamp)", precio: 664018 },
  { codigo: "R5", nombre: "R5 Racing Simulator Bundles (R5 Base+ES Wheel+SR-P Lite Pedal+Table Clamp)", precio: 945259 },
  { codigo: "R5-TRUCK", nombre: "R5 Trucking Bundle (R5 Base+TSW Truck Wheel+SR-P Lite Pedal+Clamp for the Truck Wheel)", precio: 1261309 },
  { codigo: "CS-V2P", nombre: "Volante redondo CS V2P Steering Wheel", precio: 550137 },
  { codigo: "TRUCK", nombre: "Volante Camión Truck Steering Wheel", precio: 554374 },
  { codigo: "RS-V2", nombre: "Volante redondo RS V2 Steering Wheel Leather Version", precio: 924763 },
  { codigo: "CS-PRO", nombre: "Volante redondo CS Pro Steering Wheel (con pantalla)", precio: 825651 },
  { codigo: "REVUELTO", nombre: "Volante Replica x Lamborghini Revuelto Sim-racing Steering Wheel", precio: 931421 },
  { codigo: "KS", nombre: "Volante Formula/GT KS Steering Wheel", precio: 563489 },
  { codigo: "KS-PRO", nombre: "Volante Formula/GT KS Pro Steering Wheel (con pantalla)", precio: 814373 },
  { codigo: "GS-V2P", nombre: "Volante Formula/GT GS V2P Steering Wheel", precio: 883004 },
  { codigo: "FSR2", nombre: "Volante Formula FSR2 Formula Wheel (con pantalla)", precio: 1535010 },
  { codigo: "VGS", nombre: "Volante Formula/GT VGS Steering Wheel", precio: 1576274 },
  { codigo: "SCV12", nombre: "Volante Replica ESSENZA SCV12 Steering Wheel", precio: 2814234 },
  { codigo: "MISSION-R", nombre: "Volante Replica Porsche MISSION R Simracing Steering Wheel", precio: 2925291 },
  { codigo: "R9", nombre: "Base R9 V3 Direct Drive Wheel Base", precio: 837807 },
  { codigo: "R12", nombre: "Base R12 V2 Direct Drive Wheel Base", precio: 1098929 },
  { codigo: "R21", nombre: "Base R21 Ultra Direct Drive Wheel Base", precio: 1809490 },
  { codigo: "R25", nombre: "Base R25 Ultra True Torque DD Wheel Base", precio: 2291594 },
  { codigo: "CRP2", nombre: "Pedalera CRP2 (throttle+braker)", precio: 853046 },
  { codigo: "CRP2-BOOSTER", nombre: "Active Pedal Bundle (Pedalera CRP2 + Pedal Activo mBooster)", precio: 2428019 },
  { codigo: "SRP", nombre: "Pedalera SRP Double Pedals with Base", precio: 337618 },
  { codigo: "SRP-LITE", nombre: "Clutch Pedal SR-P Lite", precio: 105307 },
  { codigo: "SRP2", nombre: "Pedalera SRP2 Racing Pedals", precio: 368574 },
  { codigo: "CRP2-CLUTCH", nombre: "Clutch Pedal CRP2", precio: 225012 },
  { codigo: "SRP2-CLUTCH", nombre: "Clutch Pedal SRP2", precio: 112359 },
  { codigo: "CRP2-PLATE", nombre: "CRP2 Full Length Throttle Replacement Plate", precio: 63547 },
  { codigo: "HGP", nombre: "Caja de cambios H HGP Shifter", precio: 339221 },
  { codigo: "SGP", nombre: "Caja de cambios Secuencial SGP Shifter", precio: 290178 },
  { codigo: "HBP", nombre: "Palanca de freno HBP Handbrake", precio: 226954 },
  { codigo: "CM2", nombre: "Pantalla CM2 Racing Dash", precio: 449672 },
  { codigo: "SRP-LITE-KIT", nombre: "Acesorios SR-P Lite Performance kit", precio: 51290 },
  { codigo: "SRP-KIT", nombre: "Acesorios SR-P Accessory Kit", precio: 33711 },
  { codigo: "CLAMP", nombre: "Soporte para mesa R5/R9R12 Clamp", precio: 87453 },
  { codigo: "HUB", nombre: "HUB Universal BUNDLE", precio: 99255 },
  { codigo: "THROTTLE", nombre: "Throttle Panel", precio: 443923 },
  { codigo: "AB6", nombre: "AB6 Flight Simulator", precio: 984879 },
  { codigo: "FLIGHT-ADAPTER", nombre: "Flight Base Mount Adapter", precio: 39642 },
  { codigo: "TRUCK-CLAMP", nombre: "Soporte para mesa Truck Wheel", precio: 120063 },
];
