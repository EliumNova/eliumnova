// Descuentos de la tienda. Todo se edita acá.
// Las fechas son inclusivas y en hora de Argentina. Los precios con descuento
// se redondean HACIA ABAJO a un número terminado en 900, así el descuento
// real nunca es menor al anunciado.
import type { Category, Product } from "./shop";

export type Campaign = {
  id: string;
  nombre: string;
  bajada: string; // texto corto del cartel
  desde: string; // "2026-11-02"
  hasta: string; // "2026-11-08"
  pct: number; // % de descuento
  categorias?: Category[]; // vacío = toda la tienda
  anticipoDias: number; // cuántos días antes se muestra el aviso "se viene"
};

export type Coupon = {
  codigo: string; // en mayúsculas
  pct: number;
  desde?: string;
  hasta?: string;
  categorias?: Category[];
  descripcion: string;
};

export const campaigns: Campaign[] = [
  {
    id: "cybermonday-2026",
    nombre: "CyberMonday",
    bajada: "10% off en toda la tienda",
    desde: "2026-11-02",
    hasta: "2026-11-08",
    pct: 10,
    anticipoDias: 14,
  },
];

// Códigos que el cliente carga en la pantalla de pedido.
// No se suman a una campaña: aplican solo a productos que no estén ya en oferta.
export const coupons: Coupon[] = [
  { codigo: "BIENVENIDA", pct: 5, descripcion: "5% en tu primera compra" },
  { codigo: "ELIUMNOVA", pct: 5, descripcion: "5% para seguidores de las redes" },
];

// Combo: comprando un producto de "si", los de "aplica" tienen descuento
// (solo los que no estén ya en oferta).
export const combo = {
  activo: true,
  si: ["celulares"] as Category[],
  aplica: ["accesorios"] as Category[],
  pct: 10,
  texto: "10% en accesorios llevando un celular",
};

const day = (s: string) => new Date(`${s}T00:00:00-03:00`).getTime();
const endOfDay = (s: string) => new Date(`${s}T23:59:59-03:00`).getTime();

export function activeCampaign(now: number | null): Campaign | null {
  if (now === null) return null;
  return campaigns.find((c) => now >= day(c.desde) && now <= endOfDay(c.hasta)) ?? null;
}

export function upcomingCampaign(now: number | null): Campaign | null {
  if (now === null) return null;
  return campaigns.find((c) => now < day(c.desde) && now >= day(c.desde) - c.anticipoDias * 864e5) ?? null;
}

export function campaignApplies(c: Campaign | null, p: Product) {
  return !!c && (!c.categorias?.length || c.categorias.includes(p.categoria));
}

/** Redondea hacia abajo a un número terminado en 900. */
export function roundDown(value: number) {
  const step = value < 100_000 ? 1_000 : 10_000;
  return Math.max(step - 100, Math.floor((value + 100) / step) * step - 100);
}

export const discounted = (price: number, pct: number) => roundDown(price * (1 - pct / 100));

export function findCoupon(code: string, now: number): Coupon | null {
  const c = coupons.find((x) => x.codigo === code.trim().toUpperCase());
  if (!c) return null;
  if (c.desde && now < day(c.desde)) return null;
  if (c.hasta && now > endOfDay(c.hasta)) return null;
  return c;
}

export const fmtDay = (s: string) => {
  const [, m, d] = s.split("-").map(Number);
  return `${d}/${m}`;
};

type Line = { p: Product; qty: number; unit: number | null; onSale: boolean };

/** Descuentos del carrito: combo y código. Ninguno se suma a otro ni a la campaña. */
export function cartDiscounts(lines: Line[], coupon: Coupon | null) {
  const subtotal = lines.reduce((n, l) => n + (l.unit ?? 0) * l.qty, 0);
  const trigger = combo.activo && lines.some((l) => combo.si.includes(l.p.categoria));
  let comboDisc = 0;
  let couponDisc = 0;
  for (const l of lines) {
    if (l.unit === null || l.onSale) continue;
    const amount = l.unit * l.qty;
    if (trigger && combo.aplica.includes(l.p.categoria)) comboDisc += (amount * combo.pct) / 100;
    else if (coupon && (!coupon.categorias?.length || coupon.categorias.includes(l.p.categoria))) couponDisc += (amount * coupon.pct) / 100;
  }
  comboDisc = Math.round(comboDisc);
  couponDisc = Math.round(couponDisc);
  return { subtotal, comboDisc, couponDisc, comboOn: trigger && comboDisc > 0, total: subtotal - comboDisc - couponDisc };
}
