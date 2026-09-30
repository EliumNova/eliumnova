import type { Product } from "./shop";

// Catálogo de respaldo. Se usa mientras no esté conectada la planilla de Google
// (o si la planilla no responde). Costos al 30/9/2026.

const nuevo6 = "6 meses";
const usado3 = "3 meses";

export const fallbackProducts: Product[] = [
  // Celulares · Zona
  { id: "samsung-a06-64", nombre: "Samsung Galaxy A06", categoria: "celulares", marca: "Samsung", estado: "Nuevo", costo: 145, moneda: "USD", detalle: "4 GB · 64 GB", plazo: "24 a 48 h", garantia: nuevo6 },
  { id: "samsung-a16-128", nombre: "Samsung Galaxy A16", categoria: "celulares", marca: "Samsung", estado: "Nuevo", costo: 170, moneda: "USD", detalle: "4 GB · 128 GB", plazo: "24 a 48 h", garantia: nuevo6, destacado: true },
  { id: "samsung-a07-128", nombre: "Samsung Galaxy A07", categoria: "celulares", marca: "Samsung", estado: "Nuevo", costo: 180, moneda: "USD", detalle: "4 GB · 128 GB", plazo: "24 a 48 h", garantia: nuevo6 },
  { id: "samsung-a17-128", nombre: "Samsung Galaxy A17", categoria: "celulares", marca: "Samsung", estado: "Nuevo", costo: 185, moneda: "USD", detalle: "4 GB · 128 GB", plazo: "24 a 48 h", garantia: nuevo6 },
  { id: "samsung-a17-256", nombre: "Samsung Galaxy A17", categoria: "celulares", marca: "Samsung", estado: "Nuevo", costo: 265, moneda: "USD", detalle: "8 GB · 256 GB", plazo: "24 a 48 h", garantia: nuevo6 },
  { id: "samsung-a36-256", nombre: "Samsung Galaxy A36 5G", categoria: "celulares", marca: "Samsung", estado: "Nuevo", costo: 330, moneda: "USD", detalle: "8 GB · 256 GB", plazo: "24 a 48 h", garantia: nuevo6 },
  { id: "moto-g06-128", nombre: "Motorola Moto G06", categoria: "celulares", marca: "Motorola", estado: "Nuevo", costo: 165, moneda: "USD", detalle: "4 GB · 128 GB", plazo: "24 a 48 h", garantia: nuevo6 },
  { id: "moto-g15-256", nombre: "Motorola Moto G15", categoria: "celulares", marca: "Motorola", estado: "Nuevo", costo: 190, moneda: "USD", detalle: "4 GB · 256 GB", plazo: "24 a 48 h", garantia: nuevo6, destacado: true },
  { id: "moto-g35-256", nombre: "Motorola Moto G35 5G", categoria: "celulares", marca: "Motorola", estado: "Nuevo", costo: 205, moneda: "USD", detalle: "4 GB · 256 GB", plazo: "24 a 48 h", garantia: nuevo6 },
  { id: "moto-g56-256", nombre: "Motorola Moto G56 5G", categoria: "celulares", marca: "Motorola", estado: "Nuevo", costo: 275, moneda: "USD", detalle: "8 GB · 256 GB", plazo: "24 a 48 h", garantia: nuevo6 },
  // iPhone · Box y GoaTech (el de Box suma el envío desde Córdoba al costo)
  { id: "iphone-13-128-usado", nombre: "iPhone 13", categoria: "celulares", marca: "Apple", estado: "Reacondicionado", costo: 309, moneda: "USD", detalle: "128 GB · batería 82–100%", plazo: "3 a 5 días hábiles", garantia: usado3, nota: "Revisado en el taller antes de entregarlo. Te pasamos el % de batería exacto por WhatsApp.", destacado: true },
  { id: "iphone-13-pro-128-usado", nombre: "iPhone 13 Pro", categoria: "celulares", marca: "Apple", estado: "Reacondicionado", costo: 390, moneda: "USD", detalle: "128 GB · batería 100%", plazo: "24 a 48 h", garantia: usado3, nota: "Revisado en el taller antes de entregarlo." },

  // Audio · Onpres
  { id: "airpods-4", nombre: "AirPods 4", categoria: "audio", marca: "Apple", estado: "Sellado", costo: 130, moneda: "USD", detalle: "Originales, versión EE.UU.", plazo: "2 a 4 días hábiles", garantia: nuevo6, destacado: true },
  { id: "airpods-4-anc", nombre: "AirPods 4 con cancelación de ruido", categoria: "audio", marca: "Apple", estado: "Sellado", costo: 190, moneda: "USD", detalle: "Originales, versión EE.UU.", plazo: "2 a 4 días hábiles", garantia: nuevo6 },

  // Mac · Onpres
  { id: "mac-mini-m4", nombre: "Mac mini M4", categoria: "mac", marca: "Apple", estado: "Sellado", costo: 1030, moneda: "USD", detalle: "16 GB · 512 GB SSD", plazo: "2 a 4 días hábiles", garantia: nuevo6 },
  { id: "macbook-air-m5-13", nombre: "MacBook Air M5 13\"", categoria: "mac", marca: "Apple", estado: "Sellado", costo: 1400, moneda: "USD", detalle: "16 GB · 512 GB SSD", plazo: "2 a 4 días hábiles", garantia: nuevo6, nota: "Teclado en inglés (versión EE.UU.)." },

  // Accesorios · DistriLand y GoaTech (precios fijos ajustados al mercado)
  { id: "templado-9d", nombre: "Vidrio templado Full 9D", categoria: "accesorios", marca: "Genérico", estado: "Nuevo", costo: 1040, moneda: "ARS", precio: 6900, compat: "Samsung línea A, Motorola línea G, iPhone 11 a 13. Consultá tu modelo.", plazo: "Por encargue, 2 a 4 días", garantia: nuevo6, nota: "La colocación va de regalo en el taller.", destacado: true },
  { id: "funda-antishock", nombre: "Funda transparente antishock", categoria: "accesorios", marca: "Genérico", estado: "Nuevo", costo: 2280, moneda: "ARS", precio: 8900, compat: "Samsung línea A, Motorola línea G, iPhone 11 a 13. Consultá tu modelo.", plazo: "Por encargue, 2 a 4 días", garantia: nuevo6 },
  { id: "cable-c-lightning", nombre: "Cable USB-C a Lightning 1 m", categoria: "accesorios", marca: "Genérico", estado: "Nuevo", costo: 4670, moneda: "ARS", precio: 11900, compat: "iPhone con conector Lightning (hasta iPhone 14)", plazo: "2 a 4 días hábiles", garantia: nuevo6 },
  { id: "cable-c-c", nombre: "Cable USB-C a USB-C 1 m", categoria: "accesorios", marca: "Genérico", estado: "Nuevo", costo: 5700, moneda: "ARS", precio: 11900, compat: "iPhone 15 en adelante y Android con USB-C", plazo: "2 a 4 días hábiles", garantia: nuevo6 },
  { id: "cable-c-c-motorola", nombre: "Cable USB-C a USB-C Motorola", categoria: "accesorios", marca: "Motorola", estado: "Nuevo", costo: 7840, moneda: "ARS", compat: "Android con USB-C", plazo: "2 a 4 días hábiles", garantia: nuevo6, nota: "Original." },
  { id: "cargador-ngtech-lightning", nombre: "Cargador NGTech 2.1A con cable Lightning", categoria: "accesorios", marca: "NGTech", estado: "Nuevo", costo: 6220, moneda: "ARS", compat: "iPhone con conector Lightning", plazo: "2 a 4 días hábiles", garantia: nuevo6 },
  { id: "cargador-ngtech-c", nombre: "Cargador NGTech 2.1A con cable USB-C", categoria: "accesorios", marca: "NGTech", estado: "Nuevo", costo: 6610, moneda: "ARS", compat: "Android con USB-C", plazo: "2 a 4 días hábiles", garantia: nuevo6 },
  { id: "cargador-motorola-20w", nombre: "Cargador Motorola 20W", categoria: "accesorios", marca: "Motorola", estado: "Nuevo", costo: 13890, moneda: "ARS", compat: "Motorola y Android con USB-C", plazo: "2 a 4 días hábiles", garantia: nuevo6, nota: "Original (MC-206)." },
  { id: "cargador-motorola-33w", nombre: "Cargador Motorola 33W", categoria: "accesorios", marca: "Motorola", estado: "Nuevo", costo: 22510, moneda: "ARS", compat: "Motorola con TurboPower", plazo: "2 a 4 días hábiles", garantia: nuevo6, nota: "Original (MC-336)." },
  { id: "cargador-20w-apple", nombre: "Cargador 20W USB-C para iPhone", categoria: "accesorios", marca: "Apple", estado: "Nuevo", costo: 19, moneda: "USD", compat: "iPhone 8 en adelante", plazo: "24 a 48 h", garantia: nuevo6, nota: "Original." },
];
