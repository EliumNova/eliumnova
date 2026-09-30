"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { fallbackProducts } from "@/lib/products";
import { priceOf, shop, type Product } from "@/lib/shop";
import { parseCsv, rowsToProducts } from "@/lib/sheet";

type CartLine = { id: string; qty: number };
type Dolar = { value: number; live: boolean; updated?: string };

type Ctx = {
  products: Product[];
  source: "planilla" | "respaldo";
  dolar: Dolar;
  price: (p: Product) => number | null;
  cart: CartLine[];
  add: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
};

const ShopContext = createContext<Ctx | null>(null);
const CART_KEY = "eliumnova-carrito";

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop fuera de ShopProvider");
  return ctx;
}

export default function ShopProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [source, setSource] = useState<Ctx["source"]>("respaldo");
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

  // Dólar blue del día.
  useEffect(() => {
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

  // Planilla de Google, si está configurada.
  useEffect(() => {
    if (!shop.sheetCsvUrl) return;
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

  const price = useCallback((p: Product) => priceOf(p, dolar.value), [dolar.value]);

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

  const value = { products, source, dolar, price, cart: validCart, add, setQty, clear, count, cartOpen, setCartOpen };
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
