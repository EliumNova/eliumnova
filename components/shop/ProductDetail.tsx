"use client";

import { useEffect, useRef } from "react";
import { money, needsSena, shop, type Product } from "@/lib/shop";
import { useShop } from "./ShopProvider";
import ProductArt from "./ProductArt";
import { gaItem, track } from "@/lib/track";

export default function ProductDetail({ p, onClose }: { p: Product; onClose: () => void }) {
  const { price, listPrice, onSale, campaign, add, setCartOpen } = useShop();
  const closeRef = useRef<HTMLButtonElement>(null);
  const pr = price(p);
  const closeFn = useRef(onClose);
  closeFn.current = onClose;

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeFn.current();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet detail" role="dialog" aria-modal="true" aria-labelledby="detail-title" onClick={(e) => e.stopPropagation()}>
        <button ref={closeRef} className="x" onClick={onClose} aria-label="Cerrar">
          ×
        </button>
        <ProductArt p={p} big />
        <div className="detail-body">
          <p className="kicker">
            {p.marca} · {p.estado}
          </p>
          <h2 id="detail-title">{p.nombre}</h2>
          {p.detalle && <p className="muted">{p.detalle}</p>}
          <p className="price price-big">
            {onSale(p) && listPrice(p) !== null && <s className="was">{money(listPrice(p)!)}</s>}
            {pr === null ? "Consultar precio" : money(pr)}
          </p>
          {onSale(p) && campaign && (
            <p className="sale-note">
              {campaign.nombre}: {campaign.pct}% off hasta el {campaign.hasta.slice(8)}/{Number(campaign.hasta.slice(5, 7))}.
            </p>
          )}
          {pr !== null && needsSena(p) && (
            <p className="muted">Lo reservás con {money(pr * (shop.senaPct / 100))} de seña y pagás el resto al retirar.</p>
          )}

          <dl className="specs">
            {p.compat && (
              <div>
                <dt>Compatible con</dt>
                <dd>{p.compat}</dd>
              </div>
            )}
            <div>
              <dt>Disponible en</dt>
              <dd>{p.plazo} desde que confirmás</dd>
            </div>
            <div>
              <dt>Garantía</dt>
              <dd>{p.garantia}</dd>
            </div>
            {p.nota && (
              <div>
                <dt>Nota</dt>
                <dd>{p.nota}</dd>
              </div>
            )}
          </dl>

          <button
            className="btn btn-main"
            onClick={() => {
              add(p.id);
              track("add_to_cart", { currency: "ARS", value: pr ?? undefined, items: [gaItem(p, pr)] });
              onClose();
              setCartOpen(true);
            }}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
