"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { money, needsSena, shop } from "@/lib/shop";
import { useShop } from "./ShopProvider";
import ProductArt from "./ProductArt";
import { gaItem, track } from "@/lib/track";

export default function CartDrawer() {
  const { cart, products, price, setQty, cartOpen, setCartOpen } = useShop();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!cartOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [cartOpen, setCartOpen]);

  if (!cartOpen) return null;

  const lines = cart
    .map((l) => {
      const p = products.find((x) => x.id === l.id)!;
      return { p, qty: l.qty, unit: p ? price(p) : null };
    })
    .filter((l) => l.p);
  const total = lines.reduce((n, l) => n + (l.unit ?? 0) * l.qty, 0);
  const reserva = lines.reduce((n, l) => n + (l.unit ?? 0) * l.qty * (needsSena(l.p) ? shop.senaPct / 100 : 1), 0);
  const hasConsult = lines.some((l) => l.unit === null);
  const hasEquipos = lines.some((l) => needsSena(l.p));

  return (
    <div className="overlay overlay-side" onClick={() => setCartOpen(false)}>
      <aside className="sheet drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <h2 id="cart-title">Tu carrito</h2>
          <button ref={closeRef} className="x" onClick={() => setCartOpen(false)} aria-label="Cerrar carrito">
            ×
          </button>
        </div>

        {lines.length === 0 ? (
          <p className="muted">Todavía no agregaste nada.</p>
        ) : (
          <div className="cart">
            <ul className="lines">
              {lines.map((l) => (
                <li key={l.p.id}>
                  <div className="line-thumb">
                    <ProductArt p={l.p} />
                  </div>
                  <div className="line-info">
                    <b>{l.p.nombre}</b>
                    {l.p.detalle && <small>{l.p.detalle}</small>}
                    <small>{l.unit === null ? "Consultar precio" : money(l.unit)}</small>
                  </div>
                  <div className="qty">
                    <button
                      type="button"
                      onClick={() => {
                        setQty(l.p.id, l.qty - 1);
                        track("remove_from_cart", { currency: "ARS", value: l.unit ?? undefined, items: [gaItem(l.p, l.unit)] });
                      }}
                      aria-label={`Quitar uno de ${l.p.nombre}`}
                    >
                      −
                    </button>
                    <span aria-live="polite">{l.qty}</span>
                    <button type="button" onClick={() => setQty(l.p.id, l.qty + 1)} aria-label={`Agregar uno de ${l.p.nombre}`}>
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <dl className="totals">
              <div>
                <dt>Subtotal</dt>
                <dd>
                  {money(total)}
                  {hasConsult && <small> + a consultar</small>}
                </dd>
              </div>
              {hasEquipos && (
                <div>
                  <dt>Para reservar</dt>
                  <dd>{money(reserva)}</dd>
                </div>
              )}
            </dl>
            <p className="fine">Envío y forma de pago se eligen en el paso siguiente.</p>

            <Link className="btn btn-main btn-block" href="/pedido" onClick={() => setCartOpen(false)}>
              Continuar con el pedido
            </Link>
            <button type="button" className="btn btn-line btn-block" onClick={() => setCartOpen(false)}>
              Seguir mirando
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
