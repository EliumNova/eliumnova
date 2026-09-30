"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { site } from "@/lib/site";
import { both, money, needsSena, shop, type Category } from "@/lib/shop";
import { gaItem, track } from "@/lib/track";
import { WhatsAppIcon } from "../Icons";
import ShopProvider, { useShop } from "./ShopProvider";
import ProductArt from "./ProductArt";
import MonedaToggle from "./MonedaToggle";
import { cartDiscounts, combo, findCoupon, type Coupon } from "@/lib/promos";
import { hasBackend, publicApi } from "@/lib/backend";

export default function CheckoutPage() {
  return (
    <ShopProvider>
      <Checkout />
    </ShopProvider>
  );
}

const entregas = [
  { id: "retiro", nombre: "Retiro en el taller", detalle: `${site.address.street}, ${site.address.locality}. Sin costo.` },
  { id: "moto", nombre: "Envío en moto a CABA o GBA", detalle: "Por aplicación. El costo se coordina por WhatsApp y lo paga el cliente." },
  { id: "correo", nombre: "Correo o encomienda al interior", detalle: "Según peso y destino. Se coordina por WhatsApp." },
] as const;

function orderCode() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `EN-${dd}${mm}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function Checkout() {
  const { cart, products, price, listPrice, onSale, campaign, now, dolar, clear, fmt, alt, moneda } = useShop();
  const b = (n: number) => both(n, dolar.value);
  const [nombre, setNombre] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [entrega, setEntrega] = useState<(typeof entregas)[number]["id"]>("retiro");
  const [direccion, setDireccion] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [cp, setCp] = useState("");
  const [pago, setPago] = useState(shop.payments[0].id);
  const [nota, setNota] = useState("");
  const [acepto, setAcepto] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [codeMsg, setCodeMsg] = useState("");
  const [done, setDone] = useState<{ code: string; msg: string } | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  const lines = useMemo(
    () =>
      cart
        .map((l) => {
          const p = products.find((x) => x.id === l.id);
          return p ? { p, qty: l.qty, unit: price(p), onSale: onSale(p) } : null;
        })
        .filter((l): l is NonNullable<typeof l> => !!l),
    [cart, products, price, onSale],
  );
  const pay = shop.payments.find((x) => x.id === pago)!;
  const disc = cartDiscounts(lines, coupon);
  const subtotal = disc.subtotal;
  const afterDisc = disc.total;
  const recargo = Math.round((afterDisc * pay.recargo) / 100);
  const total = afterDisc + recargo;
  const campaignSaving = lines.reduce((n, l) => n + (l.onSale ? ((listPrice(l.p) ?? 0) - (l.unit ?? 0)) * l.qty : 0), 0);

  async function applyCode() {
    let c: Coupon | null = null;
    if (hasBackend) {
      setCodeMsg("Verificando…");
      try {
        const { data } = await publicApi().queries.validateCoupon({ codigo: codeInput });
        if (data?.valido && data.codigo && data.pct)
          c = {
            codigo: data.codigo,
            pct: data.pct,
            descripcion: data.descripcion ?? `${data.pct}% de descuento`,
            categorias: (data.categorias ?? []).filter((x): x is Category => !!x) as Category[],
          };
      } catch {}
    } else {
      c = now !== null ? findCoupon(codeInput, now) : null;
    }
    if (!c) {
      setCoupon(null);
      setCodeMsg("Ese código no existe o ya no está vigente.");
      return;
    }
    setCoupon(c);
    const probe = cartDiscounts(lines, c);
    setCodeMsg(probe.couponDisc > 0 ? `Aplicado: ${c.descripcion}.` : "El código no aplica a productos que ya tienen descuento.");
    track("select_promotion", { promotion_id: c.codigo, promotion_name: c.descripcion });
  }
  const factor = total && subtotal ? total / subtotal : 1;
  const reserva = Math.round(
    lines.reduce((n, l) => n + (l.unit ?? 0) * l.qty * (needsSena(l.p) ? shop.senaPct / 100 : 1), 0) * factor,
  );
  const hasConsult = lines.some((l) => l.unit === null);
  const hasEquipos = lines.some((l) => needsSena(l.p));
  const ent = entregas.find((e) => e.id === entrega)!;

  useEffect(() => {
    if (ready && lines.length)
      track("begin_checkout", { currency: "ARS", value: subtotal, items: lines.map((l) => gaItem(l.p, l.unit, l.qty)) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  function send(e: FormEvent) {
    e.preventDefault();
    const code = orderCode();
    const fecha = new Date().toLocaleDateString("es-AR");
    const msg = [
      `Hola EliumNova! Quiero confirmar este pedido (${code}):`,
      "",
      ...lines.map(
        (l) => `• ${l.qty}x ${l.p.nombre}${l.p.detalle ? ` (${l.p.detalle})` : ""} — ${l.unit === null ? "a consultar" : b(l.unit * l.qty)}`,
      ),
      "",
      `*Subtotal:* ${b(subtotal)}${hasConsult ? " + productos a consultar" : ""}`,
      ...(campaignSaving > 0 && campaign ? [`*${campaign.nombre}:* ya aplicado (ahorro ${b(campaignSaving)})`] : []),
      ...(disc.comboDisc ? [`*Combo (${combo.texto}):* −${b(disc.comboDisc)}`] : []),
      ...(disc.couponDisc && coupon ? [`*Código ${coupon.codigo} (${coupon.pct}%):* −${b(disc.couponDisc)}`] : []),
      ...(recargo ? [`*Recargo ${pay.nombre} (${pay.recargo}%):* ${b(recargo)}`] : []),
      `*Total:* ${b(total)}`,
      ...(hasEquipos ? [`*Para reservar:* ${b(reserva)}`] : []),
      `*Pago:* ${pay.nombre}`,
      `*Moneda elegida en la web:* ${moneda === "USD" ? "dólares" : "pesos"}`,
      `*Entrega:* ${ent.nombre}`,
      ...(entrega !== "retiro" ? [`*Dirección:* ${direccion.trim()}, ${localidad.trim()}${cp.trim() ? ` (CP ${cp.trim()})` : ""}`] : [`*Localidad:* ${localidad.trim()}`]),
      `*Nombre:* ${nombre.trim()}`,
      `*Teléfono:* ${tel.trim()}`,
      ...(email.trim() ? [`*Email:* ${email.trim()}`] : []),
      ...(nota.trim() ? [`*Nota:* ${nota.trim()}`] : []),
      "",
      `Precios vistos en la web el ${fecha}, dólar de referencia ${money(dolar.value)}.`,
    ].join("\n");
    window.open(`https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
    setDone({ code, msg });

    const items = lines.map((l) => gaItem(l.p, l.unit, l.qty));
    track("generate_lead", { currency: "ARS", value: total });
    track("pedido_whatsapp", { transaction_id: code, currency: "ARS", value: total, coupon: coupon?.codigo, localidad: localidad.trim(), entrega: ent.nombre, pago: pay.nombre, items });
    if (hasBackend) {
      Promise.resolve()
        .then(() => publicApi().mutations.placeOrder({
          pedido: JSON.stringify({
            codigo: code,
            nombre: nombre.trim(),
            telefono: tel.trim(),
            email: email.trim(),
            localidad: localidad.trim(),
            entrega: ent.nombre,
            direccion: entrega !== "retiro" ? `${direccion.trim()}${cp.trim() ? ` (CP ${cp.trim()})` : ""}` : "",
            pago: pay.nombre,
            items: lines.map((l) => ({ id: l.p.id, nombre: l.p.nombre, categoria: l.p.categoria, marca: l.p.marca, cantidad: l.qty, precio: l.unit, enOferta: l.onSale })),
            subtotal,
            descuento: disc.comboDisc + disc.couponDisc + campaignSaving,
            total,
            reserva: hasEquipos ? reserva : total,
            codigoDescuento: coupon?.codigo ?? "",
            dolar: dolar.value,
            origen: document.referrer || "directo",
            nota: nota.trim(),
          }),
        }))
        .catch(() => {});
    }
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
            telefono: tel.trim(),
            email: email.trim(),
            localidad: localidad.trim(),
            entrega: ent.nombre,
            pago: pay.nombre,
            descuento: disc.comboDisc + disc.couponDisc + campaignSaving,
            codigo_descuento: coupon?.codigo ?? "",
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

  if (!ready) return <div className="wrap checkout-empty" />;

  if (done) {
    return (
      <div className="wrap checkout-done">
        <p className="kicker">Pedido {done.code}</p>
        <h1>¡Listo! Tu pedido se abrió en WhatsApp.</h1>
        <p className="lead-doc">
          Enviá el mensaje para completarlo. Te respondemos en horario de atención con la disponibilidad, el total final y los datos de
          pago. Todavía no pagaste nada.
        </p>
        <div className="row">
          <a className="btn btn-main" href={`https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(done.msg)}`} target="_blank" rel="noopener">
            <WhatsAppIcon /> Abrir WhatsApp de nuevo
          </a>
          <Link className="btn btn-line" href="/tienda" onClick={() => clear()}>
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  if (!lines.length) {
    return (
      <div className="wrap checkout-done">
        <h1>Tu carrito está vacío</h1>
        <p className="lead-doc">Elegí lo que necesitás en la tienda y volvé acá para confirmar el pedido.</p>
        <div className="row">
          <Link className="btn btn-main" href="/tienda">
            Ir a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="wrap checkout" onSubmit={send}>
      <div className="co-main">
        <Link className="co-back" href="/tienda">
          ← Volver a la tienda
        </Link>
        <h1>Confirmá tu pedido</h1>

        <fieldset className="co-block">
          <legend>Contacto</legend>
          <div className="co-grid">
            <label className="field co-full">
              <span>Nombre y apellido</span>
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} required autoComplete="name" />
            </label>
            <label className="field">
              <span>WhatsApp o teléfono</span>
              <input value={tel} onChange={(e) => setTel(e.target.value)} required type="tel" autoComplete="tel" placeholder="11 1234-5678" />
            </label>
            <label className="field">
              <span>Email (opcional)</span>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" />
            </label>
          </div>
        </fieldset>

        <fieldset className="co-block">
          <legend>Entrega</legend>
          <div className="choices">
            {entregas.map((x) => (
              <label key={x.id} className={`choice${entrega === x.id ? " on" : ""}`}>
                <input type="radio" name="entrega" value={x.id} checked={entrega === x.id} onChange={() => setEntrega(x.id)} />
                <span>
                  <b>{x.nombre}</b>
                  <small>{x.detalle}</small>
                </span>
              </label>
            ))}
          </div>
          <div className="co-grid">
            {entrega !== "retiro" && (
              <label className="field co-full">
                <span>Dirección</span>
                <input value={direccion} onChange={(e) => setDireccion(e.target.value)} required autoComplete="street-address" />
              </label>
            )}
            <label className="field">
              <span>Localidad o barrio</span>
              <input value={localidad} onChange={(e) => setLocalidad(e.target.value)} required autoComplete="address-level2" placeholder="Ej. San Justo" />
            </label>
            {entrega === "correo" && (
              <label className="field">
                <span>Código postal</span>
                <input value={cp} onChange={(e) => setCp(e.target.value)} required autoComplete="postal-code" />
              </label>
            )}
          </div>
        </fieldset>

        <fieldset className="co-block">
          <legend>Pago</legend>
          <div className="choices">
            {shop.payments.map((x) => (
              <label key={x.id} className={`choice${pago === x.id ? " on" : ""}`}>
                <input type="radio" name="pago" value={x.id} checked={pago === x.id} onChange={() => setPago(x.id)} />
                <span>
                  <b>
                    {x.nombre}
                    {x.recargo ? ` (+${x.recargo}%)` : ""}
                  </b>
                  <small>{x.detalle}</small>
                </span>
              </label>
            ))}
          </div>
          <p className="fine">{shop.sinTarjeta}</p>
        </fieldset>

        <fieldset className="co-block">
          <legend>Nota (opcional)</legend>
          <label className="field">
            <span className="sr">Nota</span>
            <textarea value={nota} onChange={(e) => setNota(e.target.value)} rows={3} placeholder="Color, modelo exacto, horario para retirar…" />
          </label>
        </fieldset>
      </div>

      <aside className="co-summary" aria-label="Resumen del pedido">
        <div className="summary-head">
          <h2>Resumen</h2>
          <MonedaToggle compact />
        </div>
        <ul className="lines">
          {lines.map((l) => (
            <li key={l.p.id}>
              <div className="line-thumb">
                <ProductArt p={l.p} />
                <span className="line-qty">{l.qty}</span>
              </div>
              <div className="line-info">
                <b>{l.p.nombre}</b>
                {l.p.detalle && <small>{l.p.detalle}</small>}
              </div>
              <span className="line-price">{l.unit === null ? "Consultar" : fmt(l.unit * l.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="coupon">
          <label className="field">
            <span className="sr">Código de descuento</span>
            <input
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  applyCode();
                }
              }}
              placeholder="Código de descuento"
              autoCapitalize="characters"
            />
          </label>
          <button type="button" className="btn btn-line" onClick={applyCode}>
            Aplicar
          </button>
        </div>
        {codeMsg && <p className="fine code-msg">{codeMsg}</p>}
        <dl className="totals">
          <div>
            <dt>Subtotal</dt>
            <dd>{fmt(subtotal)}</dd>
          </div>
          {campaignSaving > 0 && campaign && (
            <div className="disc">
              <dt>{campaign.nombre} (ya aplicado)</dt>
              <dd>−{fmt(campaignSaving)}</dd>
            </div>
          )}
          {disc.comboDisc > 0 && (
            <div className="disc">
              <dt>Combo: {combo.texto}</dt>
              <dd>−{fmt(disc.comboDisc)}</dd>
            </div>
          )}
          {disc.couponDisc > 0 && coupon && (
            <div className="disc">
              <dt>Código {coupon.codigo}</dt>
              <dd>−{fmt(disc.couponDisc)}</dd>
            </div>
          )}
          {recargo > 0 && (
            <div>
              <dt>Recargo {pay.nombre}</dt>
              <dd>{fmt(recargo)}</dd>
            </div>
          )}
          <div>
            <dt>Envío</dt>
            <dd className="small">{entrega === "retiro" ? "Sin costo" : "A coordinar"}</dd>
          </div>
          <div className="grand">
            <dt>Total</dt>
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
        <p className="fine">
          Equivalencia calculada con el dólar de referencia de {money(dolar.value)}. Podés pagar en pesos o en USDT; en el mensaje van los dos montos.
        </p>
        {hasEquipos && <p className="fine">Los equipos se reservan con 50% de seña y el resto se paga al retirar; los accesorios, completos al confirmar.</p>}

        <label className="check">
          <input type="checkbox" checked={acepto} onChange={(e) => setAcepto(e.target.checked)} required />
          <span>
            Leí y acepto los <Link href="/terminos#tienda" target="_blank">términos y condiciones</Link> y la{" "}
            <Link href="/privacidad" target="_blank">política de privacidad</Link>.
          </span>
        </label>

        <button type="submit" className="btn btn-main btn-block">
          <WhatsAppIcon /> Confirmar pedido por WhatsApp
        </button>
        <p className="fine">
          Todavía no pagás nada: te confirmamos disponibilidad y total por WhatsApp. Tenés 10 días para arrepentirte de la compra (
          <Link href="/arrepentimiento">botón de arrepentimiento</Link>).
        </p>
      </aside>
    </form>
  );
}
