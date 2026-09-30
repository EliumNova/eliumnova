"use client";

import { useEffect, useMemo, useState } from "react";
import { categories, money, type Category, type Product } from "@/lib/shop";
import ShopProvider, { useShop } from "./ShopProvider";
import ProductArt from "./ProductArt";
import MonedaToggle from "./MonedaToggle";
import ProductDetail from "./ProductDetail";
import CartDrawer from "./CartDrawer";
import StoreInfo from "./StoreInfo";
import { gaItem, track } from "@/lib/track";

type Sort = "destacados" | "menor" | "mayor";

export default function Shop() {
  return (
    <ShopProvider>
      <Catalog />
    </ShopProvider>
  );
}

const today = () =>
  new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });

function Catalog() {
  const { products, price, listPrice, onSale, campaign, dolar, add, count, setCartOpen, loading, fmt, alt, moneda } = useShop();
  const [cat, setCat] = useState<Category | "todo">("todo");
  const [brand, setBrand] = useState("todas");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("destacados");
  const [open, setOpen] = useState<Product | null>(null);
  const [fecha, setFecha] = useState("");

  useEffect(() => setFecha(today()), []);

  // Abrir un producto desde un link compartido (?p=id).
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("p");
    if (id) {
      const p = products.find((x) => x.id === id);
      if (p) setOpen(p);
    }
  }, [products]);

  function show(p: Product | null) {
    setOpen(p);
    if (p) track("view_item", { currency: "ARS", value: price(p) ?? undefined, items: [gaItem(p, price(p))] });
    const url = new URL(window.location.href);
    if (p) url.searchParams.set("p", p.id);
    else url.searchParams.delete("p");
    window.history.replaceState(null, "", url);
  }

  const brands = useMemo(() => {
    const inCat = products.filter((p) => cat === "todo" || p.categoria === cat);
    return Array.from(new Set(inCat.map((p) => p.marca))).sort();
  }, [products, cat]);

  useEffect(() => {
    if (brand !== "todas" && !brands.includes(brand)) setBrand("todas");
  }, [brands, brand]);

  // Métricas: qué categorías miran y qué buscan.
  useEffect(() => {
    if (cat !== "todo") track("view_item_list", { item_list_id: cat, item_list_name: cat });
  }, [cat]);
  useEffect(() => {
    const term = q.trim();
    if (term.length < 3) return;
    const t = setTimeout(() => track("search", { search_term: term }), 1200);
    return () => clearTimeout(t);
  }, [q]);

  function addToCart(p: Product) {
    add(p.id);
    track("add_to_cart", { currency: "ARS", value: price(p) ?? undefined, items: [gaItem(p, price(p))] });
    setCartOpen(true);
  }

  const list = useMemo(() => {
    const term = q.trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
    const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
    const out = products.filter(
      (p) =>
        (cat === "todo" || p.categoria === cat) &&
        (brand === "todas" || p.marca === brand) &&
        (!term || norm(`${p.nombre} ${p.marca} ${p.detalle ?? ""} ${p.compat ?? ""}`).includes(term)),
    );
    const val = (p: Product) => price(p) ?? Number.MAX_SAFE_INTEGER;
    if (sort === "menor") out.sort((a, b) => val(a) - val(b));
    else if (sort === "mayor") out.sort((a, b) => (price(b) ?? 0) - (price(a) ?? 0));
    else out.sort((a, b) => Number(!!b.destacado) - Number(!!a.destacado));
    return out;
  }, [products, cat, brand, q, sort, price]);

  return (
    <>
      <section className="shop-hero">
        <div className="wrap">
          <p className="kicker">Tienda EliumNova</p>
          <h1>Tecnología que pasa por el taller antes de llegar a tus manos.</h1>
          <p className="lead">
            Celulares, Apple y accesorios. Cada equipo se revisa antes de entregarlo, con garantía y atención directa por WhatsApp.
          </p>
          <ul className="trust">
            <li>Revisado por un técnico</li>
            <li>Garantía escrita</li>
            <li>Retiro en Rafael Castillo o envío</li>
          </ul>
        </div>
      </section>

      <section className="shop-body" aria-label="Catálogo">
        <div className="wrap">
          <div className="filters">
            <div className="chips" role="tablist" aria-label="Categorías">
              <button role="tab" aria-selected={cat === "todo"} className={cat === "todo" ? "on" : ""} onClick={() => setCat("todo")}>
                Todo
              </button>
              {categories.map((c) => (
                <button key={c.id} role="tab" aria-selected={cat === c.id} className={cat === c.id ? "on" : ""} onClick={() => setCat(c.id)}>
                  {c.label}
                </button>
              ))}
            </div>
            <div className="filter-row">
              <label className="search">
                <span className="sr">Buscar</span>
                <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscá tu modelo: A16, iPhone 13, cargador…" />
              </label>
              <label>
                <span className="sr">Marca</span>
                <select value={brand} onChange={(e) => setBrand(e.target.value)}>
                  <option value="todas">Todas las marcas</option>
                  {brands.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="sr">Ordenar</span>
                <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                  <option value="destacados">Destacados</option>
                  <option value="menor">Menor precio</option>
                  <option value="mayor">Mayor precio</option>
                </select>
              </label>
              <MonedaToggle />
            </div>
          </div>

          {loading ? (
            <p className="empty">Cargando catálogo…</p>
          ) : list.length ? (
            <div className="products">
              {list.map((p) => {
                const pr = price(p);
                return (
                  <article className="card" key={p.id}>
                    <button className="card-open" onClick={() => show(p)} aria-label={`Ver ${p.nombre}`}>
                      <ProductArt p={p} />
                      <span className={`badge ${p.estado === "Reacondicionado" ? "badge-alt" : ""}`}>{p.estado}</span>
                      {onSale(p) && campaign && <span className="badge badge-sale">-{campaign.pct}%</span>}
                    </button>
                    <div className="card-body">
                      <h3>
                        <button onClick={() => show(p)}>{p.nombre}</button>
                      </h3>
                      {p.detalle && <p className="muted">{p.detalle}</p>}
                      <p className="price">
                        {onSale(p) && listPrice(p) !== null && <s className="was">{fmt(listPrice(p)!)}</s>}
                        {pr === null ? "Consultar precio" : fmt(pr)}
                        {pr !== null && <small className="alt">{alt(pr)}</small>}
                      </p>
                      <button className="btn btn-main btn-sm" onClick={() => addToCart(p)}>
                        Agregar
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="empty">
              No encontramos nada con esa búsqueda. Escribinos por WhatsApp y te lo conseguimos.
            </p>
          )}

          <p className="fine">
            Precios en {moneda === "USD" ? "dólares (equivalente al precio en pesos)" : "pesos"}{fecha ? `, vigentes al ${fecha}` : ""}, calculados con el dólar de referencia de {money(dolar.value)}. Pueden
            cambiar de un día para el otro; el precio final te lo confirmamos por WhatsApp antes de cobrar. Los equipos se reservan con 50% de
            seña.
          </p>
        </div>
      </section>

      <StoreInfo />

      {count > 0 && (
        <button className="cart-fab" onClick={() => setCartOpen(true)} aria-label={`Ver carrito, ${count} productos`}>
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="10" cy="20" r="1.4" fill="currentColor" />
            <circle cx="17" cy="20" r="1.4" fill="currentColor" />
          </svg>
          <span>{count}</span>
        </button>
      )}

      {open && <ProductDetail p={open} onClose={() => show(null)} />}
      <CartDrawer />
    </>
  );
}
