// Configuración de la tienda. Casi todo lo que vas a querer cambiar está acá.

export const shop = {
  // Link de la planilla de Google publicada como CSV
  // (Archivo → Compartir → Publicar en la web → hoja "productos" → CSV).
  // Mientras esté vacío, la tienda usa el catálogo de lib/products.ts.
  sheetCsvUrl: "",

  // Registro automático de pedidos en la planilla (URL de la app web de Apps Script,
  // ver docs/apps-script-pedidos.gs). Vacío = no se registran.
  ordersWebhookUrl: "",

  // Cotización en vivo del dólar blue (se usa el valor de venta).
  dolarApiUrl: "https://dolarapi.com/v1/dolares/blue",
  // Si la API no responde, se usa este valor.
  dolarFallback: 1560,

  // Regla de margen: costo menor a 50 USD → ×2; desde 50 USD → ×1,5.
  margin: { thresholdUsd: 50, cheap: 2, expensive: 1.5 },

  // Seña para reservar equipos (celulares y Mac).
  senaPct: 50,
  senaCategories: ["celulares", "mac"] as string[],
};

export type Category = "celulares" | "accesorios" | "audio" | "mac";

export const categories: { id: Category; label: string }[] = [
  { id: "celulares", label: "Celulares" },
  { id: "accesorios", label: "Accesorios" },
  { id: "audio", label: "Audio" },
  { id: "mac", label: "Mac" },
];

export type Product = {
  id: string;
  nombre: string;
  categoria: Category;
  marca: string;
  estado: string; // Nuevo, Sellado, Reacondicionado
  costo: number; // costo del proveedor
  moneda: "USD" | "ARS";
  precio?: number; // precio fijo en pesos (pisa la regla). Vacío = se calcula.
  consultar?: boolean; // muestra "Consultar precio" en vez de un número
  detalle?: string; // specs cortas: "4 GB · 128 GB"
  compat?: string; // modelos compatibles (accesorios)
  plazo: string; // cuánto tarda en estar disponible
  garantia: string;
  nota?: string; // tu opinión de técnico o aclaración importante
  foto?: string; // URL de la foto
  destacado?: boolean;
};

/** Redondea hacia arriba a un precio terminado en 900 ($6.900, $59.900, $449.900). */
export function roundPrice(value: number) {
  const step = value < 100_000 ? 1_000 : 10_000;
  return Math.ceil((value + 100) / step) * step - 100;
}

/** Precio de venta en pesos, o null si hay que consultar. */
export function priceOf(p: Product, dolar: number): number | null {
  if (p.consultar) return null;
  if (p.precio && p.precio > 0) return p.precio;
  const costUsd = p.moneda === "USD" ? p.costo : p.costo / dolar;
  const mult = costUsd < shop.margin.thresholdUsd ? shop.margin.cheap : shop.margin.expensive;
  const costArs = p.moneda === "USD" ? p.costo * dolar : p.costo;
  return roundPrice(costArs * mult);
}

export const money = (n: number) =>
  "$" + Math.round(n).toLocaleString("es-AR", { maximumFractionDigits: 0 });

export const needsSena = (p: Product) => shop.senaCategories.includes(p.categoria);
