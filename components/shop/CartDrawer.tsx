"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { site } from "@/lib/site";
import { money, needsSena, shop } from "@/lib/shop";
import { WhatsAppIcon } from "../Icons";
import { useShop } from "./ShopProvider";
import { gaItem, track } from "@/lib/track";

const entregas = [
  "Retiro en el taller (Rafael Castillo, sin costo)",
  "Envío en moto a CABA o GBA (lo paga el cliente)",
  "Envío por correo o encomienda al interior",
];

function orderCode() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const rnd = String(Math.floor(1000 + Math.random() * 9000));
  return `EN-${dd}${mm}-${rnd}`;
}

export default function CartDrawer() {
  const { cart, products, price, setQty, clear, cartOpen, setCartOpen, dolar } = useShop();
  const [nombre, setNombre] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [entrega, setEntrega] = useState(entregas[0]);
  const [sent, setSent] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!cartOpen) return;
    const ls = cart.map((l) => ({ p: products.find((x) => x.id === l.id), qty: l.qty })).filter((l) => l.p);
    if (ls.length)
      track("begin_checkout", {
        currency: "ARS",
        value: ls.reduce((n, l) => n + (price(l.p!) ?? 0) * l.qty, 0),
        items: ls.map((l) => gaItem(l.p!, price(l.p!), l.qty)),
      });
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartOpen, setCartOpen]);

  if (!cartOpen) return null;

  const lines = cart
    .map((l) => {
      const p = products.find((x) => x.id === l.id)!;
      return { p, qty: l.qty, unit: price(p) };
    })
    .filter((l) => l.p);
  const total = lines.reduce((n, l) => n + (l.unit ?? 0) * l.qty, 0);
  const reserva = lines.reduce((n, l) => n + (l.unit ?? 0) * l.qty * (needsSena(l.p) ? shop.senaPct / 100 : 1), 0);
  const hasConsult = lines.some((l) => l.unit === null);
  const hasEquipos = lines.some((l) => needsSena(l.p));

  function send(e: FormEvent) {
    e.preventDefault();
    const code = orderCode();
    const fecha = new Date().toLocaleDateString("es-AR");
    const msg = [
      `Hola EliumNova! Quiero hacer este pedido (${code}):`,
      "",
      ...lines.map(
        (l) =>
          `• ${l.qty}x ${l.p.nombre}${l.p.detalle ? ` (${l.p.detalle})` : ""} — ${l.unit === null ? "a consultar" : money(l.unit * l.qty)}`,
      ),
      "",
      `*Total:* ${money(total)}${hasConsult ? " + productos a consultar" : ""}`,
      ...(hasEquipos ? [`*Para reservar:* ${money(reserva)}`] : []),
      `*Entrega:* ${entrega}`,
      `*Localidad:* ${localidad.trim()}`,
      ...(nombre.trim() ? [`*Nombre:* ${nombre.trim()}`] : []),
      "",
      `Precios vistos en la web el ${fecha}.`,
    ].join("\n");
    window.open(`https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
    setSent(code);

    // Métricas y registro del pedido en la planilla.
    const items = lines.map((l) => gaItem(l.p, l.unit, l.qty));
    track("generate_lead", { currency: "ARS", value: total });
    track("pedido_whatsapp", { transaction_id: code, currency: "ARS", value: total, localidad: localidad.trim(), entrega, items });
    if (shop.ordersWebhookUrl) {
      try {
        fetch(shop.ordersWebhookUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            codigo: code,
            fecha: new Date().toISOString(),
            nombre: nombre.trim(),
            localidad: localidad.trim(),
            entrega,
            total,
            reserva: hasEquipos ? reserva : total,
            dolar: dolar.value,
            origen: document.referrer || "directo",
            items: lines.map((l) => ({ id: l.p.id, nombre: l.p.nombre, categoria: l.p.categoria, marca: l.p.marca, cantidad: l.qty, precio: l.unit })),
          }),
        }).catch(() => {});
      } catch {}
    }
  }

  return (
    <div className="overlay overlay-side" onClick={() => setCartOpen(false)}>
      <aside className="sheet drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <h2 id="cart-title">Tu pedido</h2>
          <button ref={closeRef} className="x" onClick={() => setCartOpen(false)} aria-label="Cerrar carrito">
            ×
          </button>
        </div>

        {sent ? (
          <div className="sent">
            <p className="kicker">Pedido {sent}</p>
            <h3>¡Listo! Se abrió WhatsApp con tu pedido.</h3>
            <p className="muted">
              Si no se abrió, escribinos al {site.whatsapp.display} y pasanos el código {sent}. Te confirmamos disponibilidad y el total
              antes de cobrar.
            </p>
            <div className="row">
              <button className="btn btn-main" onClick={() => { clear(); setSent(null); setCartOpen(false); }}>
                Vaciar carrito y seguir mirando
              </button>
              <button className="btn btn-line" onClick={() => setSent(null)}>
                Volver al pedido
              </button>
            </div>
          </div>
        ) : lines.length === 0 ? (
          <p className="muted">Todavía no agregaste nada.</p>
        ) : (
          <form onSubmit={send} className="cart">
            <ul className="lines">
              {lines.map((l) => (
                <li key={l.p.id}>
                  <div>
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
                <dt>Total</dt>
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
            {hasEquipos && <p className="fine">Los equipos se reservan con 50% de seña; los accesorios se pagan al confirmar.</p>}

            <label className="field">
              <span>Tu nombre</span>
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Juan" autoComplete="given-name" />
            </label>
            <label className="field">
              <span>Localidad o barrio</span>
              <input value={localidad} onChange={(e) => setLocalidad(e.target.value)} placeholder="Ej. San Justo, Palermo, Morón" required autoComplete="address-level2" />
            </label>
            <label className="field">
              <span>Entrega</span>
              <select value={entrega} onChange={(e) => setEntrega(e.target.value)}>
                {entregas.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>

            <button type="submit" className="btn btn-main btn-block">
              <WhatsAppIcon /> Enviar pedido por WhatsApp
            </button>
            <p className="fine">
              Todavía no pagás nada: te confirmamos disponibilidad y el total por WhatsApp. <Link href="/como-comprar">Cómo comprar</Link> ·{" "}
              <Link href="/arrepentimiento">Botón de arrepentimiento</Link>
            </p>
          </form>
        )}
      </aside>
    </div>
  );
}
