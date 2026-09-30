"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { needsSena, shop } from "@/lib/shop";
import { useShop } from "./ShopProvider";
import ProductArt from "./ProductArt";
import MonedaToggle from "./MonedaToggle";
import { gaItem, track } from "@/lib/track";
import { cartDiscounts, combo } from "@/lib/promos";

export default function CartDrawer() {
  const { cart, products, price, onSale, setQty, cartOpen, setCartOpen, fmt, alt } = useShop();
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
      return { p, qty: l.qty, unit: p ? price(p) : null, onSale: p ? onSale(p) : false };
    })
    .filter((l) => l.p);
  const disc = cartDiscounts(lines, null);
  const total = disc.total;
  const factor = disc.subtotal ? total / disc.subtotal : 1;
  const reserva = Math.round(lines.reduce((n, l) => n + (l.unit ?? 0) * l.qty * (needsSena(l.p) ? shop.senaPct / 100 : 1), 0) * factor);
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
                    <small>{l.unit === null ? "Consultar precio" : fmt(l.unit)}</small>
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

            <MonedaToggle compact />
            <dl className="totals">
              {disc.comboOn && (
                <div className="disc">
                  <dt>Combo: {combo.texto}</dt>
                  <dd>−{fmt(disc.comboDisc)}</dd>
                </div>
              )}
              <div>
                <dt>{disc.comboOn ? "Total" : "Subtotal"}</dt>
                <dd>
                  {fmt(total)}
                  {hasConsult && <small> + a consultar</small>}
                  <small className="alt">{alt(total)}</small>
                </dd>
              </div>
              {hasEquipos && (
                <div>
                  <dt>Para reservar</dt>
                  <dd>
                    {fmt(reserva)}
                    <small className="alt">{alt(reserva)}</small>
                  </dd>
                </div>
              )}
            </dl>
            {!disc.comboOn && combo.activo && lines.some((l) => combo.si.includes(l.p.categoria)) === false && (
              <p className="fine">Combo: {combo.texto}.</p>
            )}
            <p className="fine">Envío, forma de pago y códigos de descuento, en el paso siguiente.</p>

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
