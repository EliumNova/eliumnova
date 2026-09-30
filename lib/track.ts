// Envía eventos a Google Analytics si está configurado. Si no, no hace nada.
type Params = Record<string, unknown>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: string, params: Params = {}) {
  try {
    window.gtag?.("event", event, params);
  } catch {}
}

import type { Product } from "./shop";

export const gaItem = (p: Product, price: number | null, qty = 1) => ({
  item_id: p.id,
  item_name: p.nombre,
  item_brand: p.marca,
  item_category: p.categoria,
  item_variant: p.detalle,
  price: price ?? undefined,
  quantity: qty,
});
