"use client";

import { useEffect, useState } from "react";
import { money } from "@/lib/shop";
import { userApi } from "@/lib/backend";
import { api, fmtDate, itemsOf, type OrderRow } from "./data";

const estados = ["PENDIENTE", "CONFIRMADO", "VENDIDO", "CANCELADO"] as const;
type Estado = (typeof estados)[number];

export default function Orders() {
  const [orders, setOrders] = useState<OrderRow[] | null>(null);
  const [filtro, setFiltro] = useState<Estado | "TODOS">("TODOS");
  const [open, setOpen] = useState<string | null>(null);
  const [err, setErr] = useState("");

  const load = () => api.orders().then((o) => setOrders(o.sort((a, b) => b.createdAt.localeCompare(a.createdAt)))).catch((e) => setErr(String(e?.message ?? e)));
  useEffect(() => {
    load();
  }, []);

  async function setEstado(o: OrderRow, estado: Estado) {
    setOrders((list) => list?.map((x) => (x.id === o.id ? { ...x, estado } : x)) ?? null);
    const { errors } = await userApi().models.Order.update({ id: o.id, estado });
    if (errors?.length) setErr(errors[0].message);
  }

  if (err) return <p className="admin-error">{err}</p>;
  if (!orders) return <p className="muted">Cargando…</p>;
  const list = orders.filter((o) => filtro === "TODOS" || o.estado === filtro);

  return (
    <section className="admin-section">
      <div className="admin-head">
        <h2>Pedidos</h2>
        <select value={filtro} onChange={(e) => setFiltro(e.target.value as Estado | "TODOS")}>
          <option value="TODOS">Todos</option>
          {estados.map((e) => <option key={e} value={e}>{e.toLowerCase()}</option>)}
        </select>
        <button className="btn btn-line btn-sm" onClick={load}>Actualizar</button>
      </div>
      {!list.length && <p className="muted">No hay pedidos.</p>}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th>Fecha</th><th>Código</th><th>Cliente</th><th>Localidad</th><th>Pago / entrega</th><th className="num">Total</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {list.map((o) => (
              <FragmentRow key={o.id} o={o} open={open === o.id} toggle={() => setOpen(open === o.id ? null : o.id)} setEstado={(e) => setEstado(o, e)} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function FragmentRow({ o, open, toggle, setEstado }: { o: OrderRow; open: boolean; toggle: () => void; setEstado: (e: Estado) => void }) {
  const items = itemsOf(o);
  const wa = o.telefono ? `https://wa.me/${o.telefono.replace(/\D/g, "").replace(/^0/, "").replace(/^(?!54)/, "549")}` : null;
  return (
    <>
      <tr className={`row-${(o.estado ?? "PENDIENTE").toLowerCase()}`}>
        <td>{fmtDate(o.createdAt)}</td>
        <td><button className="link" onClick={toggle}>{o.codigo}</button>{o.verificado === false && <span className="warn" title="El código de descuento no se pudo verificar"> ⚠</span>}</td>
        <td>{o.nombre}{wa && <> · <a href={wa} target="_blank" rel="noopener">WhatsApp</a></>}</td>
        <td>{o.localidad}</td>
        <td>{o.pago}<br /><small className="muted">{o.entrega}</small></td>
        <td className="num">{money(o.total ?? 0)}</td>
        <td>
          <select value={o.estado ?? "PENDIENTE"} onChange={(e) => setEstado(e.target.value as Estado)}>
            {estados.map((e) => <option key={e} value={e}>{e.toLowerCase()}</option>)}
          </select>
        </td>
      </tr>
      {open && (
        <tr className="row-detail">
          <td colSpan={7}>
            <ul>
              {items.map((it, i) => (
                <li key={i}>{it.cantidad}× {it.nombre} — {it.precio === null ? "a consultar" : money((it.precio ?? 0) * it.cantidad)}{it.enOferta ? " (oferta)" : ""}</li>
              ))}
            </ul>
            <p className="muted">
              Subtotal {money(o.subtotal ?? 0)} · Descuentos {money(o.descuento ?? 0)}{o.codigoDescuento ? ` (código ${o.codigoDescuento})` : ""} · Reserva {money(o.reserva ?? 0)} · Dólar {money(o.dolar ?? 0)}
              {o.direccion ? ` · Dirección: ${o.direccion}` : ""}{o.email ? ` · ${o.email}` : ""}{o.nota ? ` · Nota: ${o.nota}` : ""}
            </p>
          </td>
        </tr>
      )}
    </>
  );
}
