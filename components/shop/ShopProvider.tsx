"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { inMoneda, priceOf, shop, type Moneda, type Product } from "@/lib/shop";
import { parseCsv, rowsToProducts } from "@/lib/sheet";
import { hasBackend, parseJson, publicApi } from "@/lib/backend";
import { activeCampaign, campaignApplies, discounted, upcomingCampaign, type Campaign } from "@/lib/promos";

type CartLine = { id: string; qty: number };
type Dolar = { value: number; live: boolean; updated?: string };

type Ctx = {
  moneda: Moneda;
  setMoneda: (m: Moneda) => void;
  fmt: (ars: number) => string; // precio en la moneda elegida
  alt: (ars: number) => string; // precio en la otra moneda
  products: Product[];
  source: "servidor" | "planilla" | "respaldo" | "cargando";
  loading: boolean;
  dolar: Dolar;
  price: (p: Product) => number | null; // precio final (con campaña si corresponde)
  listPrice: (p: Product) => number | null; // precio sin campaña
  onSale: (p: Product) => boolean;
  campaign: Campaign | null;
  upcoming: Campaign | null;
  now: number | null;
  cart: CartLine[];
  add: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
};

// Producto tal como lo entrega el servidor: sin costos, con precio final.
type PublicProduct = Omit<Product, "costo" | "moneda"> & { precio?: number; consultar?: boolean };
const fromPublic = (p: PublicProduct): Product => ({ ...p, costo: 0, moneda: "ARS", precio: p.precio, consultar: !p.precio || p.consultar });

const ShopContext = createContext<Ctx | null>(null);
const CART_KEY = "eliumnova-carrito";
const MONEDA_KEY = "eliumnova-moneda";

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop fuera de ShopProvider");
  return ctx;
}

export default function ShopProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [source, setSource] = useState<Ctx["source"]>("cargando");
  const [dolar, setDolar] = useState<Dolar>({ value: shop.dolarFallback, live: false });
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Carrito guardado en este navegador (si el navegador lo permite).
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      if (Array.isArray(saved)) setCart(saved.filter((l) => l && typeof l.id === "string" && l.qty > 0));
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {}
  }, [cart]);

  // Catálogo: del servidor si hay backend; si no, catálogo local + planilla.
  useEffect(() => {
    let alive = true;
    const loadLocal = () =>
      import("@/lib/products").then((m) => {
        if (alive) setProducts((cur) => (cur.length ? cur : m.fallbackProducts));
        if (alive) setSource((s) => (s === "cargando" ? "respaldo" : s));
      });
    if (!hasBackend) {
      loadLocal();
      return () => { alive = false; };
    }
    Promise.resolve()
      .then(() => publicApi().queries.getCatalog())
      .then(({ data }) => {
        if (!alive || !data) throw new Error("sin datos");
        const list = parseJson<PublicProduct[]>(data.productos).map(fromPublic);
        setProducts(list);
        setDolar({ value: data.dolar, live: !!data.dolarEnVivo, updated: data.actualizado ?? undefined });
        setSource("servidor");
      })
      .catch(() => loadLocal());
    return () => { alive = false; };
  }, []);

  // Dólar blue del día (solo sin servidor; con servidor lo calcula el backend).
  useEffect(() => {
    if (hasBackend) return;
    let alive = true;
    fetch(shop.dolarApiUrl, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        const v = Number(d?.venta);
        if (alive && v > 0) setDolar({ value: v, live: true, updated: d?.fechaActualizacion });
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  // Planilla de Google, si está configurada (solo sin servidor).
  useEffect(() => {
    if (hasBackend || !shop.sheetCsvUrl) return;
    let alive = true;
    fetch(shop.sheetCsvUrl, { cache: "no-store" })
      .then((r) => (r.ok ? r.text() : Promise.reject()))
      .then((t) => {
        const list = rowsToProducts(parseCsv(t));
        if (alive && list.length) { setProducts(list); setSource("planilla"); }
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  // "Ahora" se toma recién en el navegador, así las campañas usan la fecha real del visitante.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);
  const campaign = useMemo(() => activeCampaign(now), [now]);
  const upcoming = useMemo(() => upcomingCampaign(now), [now]);

  const listPrice = useCallback((p: Product) => priceOf(p, dolar.value), [dolar.value]);
  const onSale = useCallback((p: Product) => campaignApplies(campaign, p) && priceOf(p, dolar.value) !== null, [campaign, dolar.value]);
  const price = useCallback(
    (p: Product) => {
      const base = priceOf(p, dolar.value);
      return base !== null && campaign && campaignApplies(campaign, p) ? discounted(base, campaign.pct) : base;
    },
    [dolar.value, campaign],
  );

  const add = useCallback((id: string) => {
    setCart((c) => (c.some((l) => l.id === id) ? c.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l)) : [...c, { id, qty: 1 }]));
  }, []);
  const setQty = useCallback((id: string, qty: number) => {
    setCart((c) => (qty <= 0 ? c.filter((l) => l.id !== id) : c.map((l) => (l.id === id ? { ...l, qty } : l))));
  }, []);
  const clear = useCallback(() => setCart([]), []);

  // Si un producto sale de la planilla, se quita del carrito.
  const validCart = useMemo(() => cart.filter((l) => products.some((p) => p.id === l.id)), [cart, products]);
  const count = validCart.reduce((n, l) => n + l.qty, 0);

  // Moneda en la que el visitante quiere ver los precios (se recuerda en su navegador).
  const [moneda, setMonedaState] = useState<Moneda>("ARS");
  useEffect(() => {
    try {
      if (localStorage.getItem(MONEDA_KEY) === "USD") setMonedaState("USD");
    } catch {}
  }, []);
  const setMoneda = useCallback((m: Moneda) => {
    setMonedaState(m);
    try { localStorage.setItem(MONEDA_KEY, m); } catch {}
  }, []);
  /** Precio en pesos → texto en la moneda elegida. */
  const fmt = useCallback((ars: number) => inMoneda(ars, moneda, dolar.value), [moneda, dolar.value]);
  /** Precio en pesos → texto en la otra moneda. */
  const alt = useCallback((ars: number) => inMoneda(ars, moneda === "USD" ? "ARS" : "USD", dolar.value), [moneda, dolar.value]);

  const loading = source === "cargando";
  const value = { moneda, setMoneda, fmt, alt, products, source, loading, dolar, price, listPrice, onSale, campaign, upcoming, now, cart: validCart, add, setQty, clear, count, cartOpen, setCartOpen };
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
