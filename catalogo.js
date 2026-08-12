/*
 * Catálogo de productos de Zona Race.
 *
 * Para editarlo: agregá, sacá o modificá objetos de la lista de abajo.
 * Cada producto es { codigo: "...", nombre: "...", precioUnitario: 12345 }
 * El precio va sin símbolo, sin puntos de miles y con punto decimal (ej: 12345.50).
 * El orden de esta lista es el orden en que aparecen en el desplegable.
 *
 * "codigo" es de referencia interna: hoy no se muestra ni en la app ni en el
 * remito, que usan "nombre" y "precioUnitario".
 *
 * Si pegás una lista con otro formato, la app igual la entiende: acepta que se
 * llame CATALOGO, catalogo o PRODUCTOS, y que el precio venga como
 * "precioUnitario" o como "precio".
 *
 * Acordate de subir la VERSION en sw.js cada vez que toques este archivo, así
 * los celulares que ya tienen la app instalada se actualizan.
 */
const CATALOGO = [
  { codigo: "R3", nombre: "R3 Racing Simulator Bundles (R3 Base+ES Lite Wheel+SR-P Lite Pedals+Table Clamp)", precioUnitario: 664018 },
  { codigo: "R5", nombre: "R5 Racing Simulator Bundles (R5 Base+ES Wheel+SR-P Lite Pedal+Table Clamp)", precioUnitario: 945259 },
  { codigo: "R5-TRUCK", nombre: "R5 Trucking Bundle (R5 Base+TSW Truck Wheel+SR-P Lite Pedal+Clamp for the Truck Wheel)", precioUnitario: 1261309 },
  { codigo: "CS-V2P", nombre: "Volante redondo CS V2P Steering Wheel", precioUnitario: 550137 },
  { codigo: "TRUCK", nombre: "Volante Camión Truck Steering Wheel", precioUnitario: 554374 },
  { codigo: "RS-V2", nombre: "Volante redondo RS V2 Steering Wheel Leather Version", precioUnitario: 924763 },
  { codigo: "CS-PRO", nombre: "Volante redondo CS Pro Steering Wheel (con pantalla)", precioUnitario: 825651 },
  { codigo: "REVUELTO", nombre: "Volante Replica x Lamborghini Revuelto Sim-racing Steering Wheel", precioUnitario: 931421 },
  { codigo: "KS", nombre: "Volante Formula/GT KS Steering Wheel", precioUnitario: 563489 },
  { codigo: "KS-PRO", nombre: "Volante Formula/GT KS Pro Steering Wheel (con pantalla)", precioUnitario: 814373 },
  { codigo: "GS-V2P", nombre: "Volante Formula/GT GS V2P Steering Wheel", precioUnitario: 883004 },
  { codigo: "FSR2", nombre: "Volante Formula FSR2 Formula Wheel (con pantalla)", precioUnitario: 1535010 },
  { codigo: "VGS", nombre: "Volante Formula/GT VGS Steering Wheel", precioUnitario: 1576274 },
  { codigo: "SCV12", nombre: "Volante Replica ESSENZA SCV12 Steering Wheel", precioUnitario: 2814234 },
  { codigo: "MISSION-R", nombre: "Volante Replica Porsche MISSION R Simracing Steering Wheel", precioUnitario: 2925291 },
  { codigo: "R9", nombre: "Base R9 V3 Direct Drive Wheel Base", precioUnitario: 837807 },
  { codigo: "R12", nombre: "Base R12 V2 Direct Drive Wheel Base", precioUnitario: 1098929 },
  { codigo: "R21", nombre: "Base R21 Ultra Direct Drive Wheel Base", precioUnitario: 1809490 },
  { codigo: "R25", nombre: "Base R25 Ultra True Torque DD Wheel Base", precioUnitario: 2291594 },
  { codigo: "CRP2", nombre: "Pedalera CRP2 (throttle+braker)", precioUnitario: 853046 },
  { codigo: "CRP2-BOOSTER", nombre: "Active Pedal Bundle (Pedalera CRP2 + Pedal Activo mBooster)", precioUnitario: 2428019 },
  { codigo: "SRP", nombre: "Pedalera SRP Double Pedals with Base", precioUnitario: 337618 },
  { codigo: "SRP-LITE", nombre: "Clutch Pedal SR-P Lite", precioUnitario: 105307 },
  { codigo: "SRP2", nombre: "Pedalera SRP2 Racing Pedals", precioUnitario: 368574 },
  { codigo: "CRP2-CLUTCH", nombre: "Clutch Pedal CRP2", precioUnitario: 225012 },
  { codigo: "SRP2-CLUTCH", nombre: "Clutch Pedal SRP2", precioUnitario: 112359 },
  { codigo: "CRP2-PLATE", nombre: "CRP2 Full Length Throttle Replacement Plate", precioUnitario: 63547 },
  { codigo: "HGP", nombre: "Caja de cambios H HGP Shifter", precioUnitario: 339221 },
  { codigo: "SGP", nombre: "Caja de cambios Secuencial SGP Shifter", precioUnitario: 290178 },
  { codigo: "HBP", nombre: "Palanca de freno HBP Handbrake", precioUnitario: 226954 },
  { codigo: "CM2", nombre: "Pantalla CM2 Racing Dash", precioUnitario: 449672 },
  { codigo: "SRP-LITE-KIT", nombre: "Acesorios SR-P Lite Performance kit", precioUnitario: 51290 },
  { codigo: "SRP-KIT", nombre: "Acesorios SR-P Accessory Kit", precioUnitario: 33711 },
  { codigo: "CLAMP", nombre: "Soporte para mesa R5/R9R12 Clamp", precioUnitario: 87453 },
  { codigo: "HUB", nombre: "HUB Universal BUNDLE", precioUnitario: 99255 },
  { codigo: "THROTTLE", nombre: "Throttle Panel", precioUnitario: 443923 },
  { codigo: "AB6", nombre: "AB6 Flight Simulator", precioUnitario: 984879 },
  { codigo: "FLIGHT-ADAPTER", nombre: "Flight Base Mount Adapter", precioUnitario: 39642 },
  { codigo: "TRUCK-CLAMP", nombre: "Soporte para mesa Truck Wheel", precioUnitario: 120063 },
];
