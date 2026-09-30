"use client";

import { useEffect, useMemo, useState } from "react";
import { money } from "@/lib/shop";
import { api, itemsOf, type OrderRow } from "./data";

// Base del dashboard: números clave de los últimos 30 días a partir de los pedidos.
export default function Summary() {
  const [orders, setOrders] = useState<OrderRow[] | null>(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    api.orders().then(setOrders).catch((e) => setErr(String(e?.message ?? e)));
  }, []);

  const s = useMemo(() => {
    if (!orders) return null;
    const since = Date.now() - 30 * 864e5;
    const recent = orders.filter((o) => new Date(o.createdAt).getTime() >= since);
    const vendidos = recent.filter((o) => o.estado === "VENDIDO");
    const activos = recent.filter((o) => o.estado !== "CANCELADO");
    const facturado = vendidos.reduce((n, o) => n + (o.total ?? 0), 0);
    const prod = new Map<string, number>();
    const loc = new Map<string, number>();
    const pago = new Map<string, number>();
    for (const o of activos) {
      for (const it of itemsOf(o)) prod.set(it.nombre, (prod.get(it.nombre) ?? 0) + it.cantidad);
      const l = (o.localidad || "Sin dato").trim();
      loc.set(l, (loc.get(l) ?? 0) + 1);
      if (o.pago) pago.set(o.pago, (pago.get(o.pago) ?? 0) + 1);
    }
    const top = (m: Map<string, number>) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
    const days = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(Date.now() - (13 - i) * 864e5);
      const key = d.toISOString().slice(0, 10);
      return { key, label: `${d.getDate()}/${d.getMonth() + 1}`, n: orders.filter((o) => o.createdAt.slice(0, 10) === key).length };
    });
    return {
      pedidos: recent.length,
      vendidos: vendidos.length,
      conversion: recent.length ? Math.round((vendidos.length / recent.length) * 100) : 0,
      facturado,
      ticket: vendidos.length ? facturado / vendidos.length : 0,
      topProd: top(prod),
      topLoc: top(loc),
      topPago: top(pago),
      days,
    };
  }, [orders]);

  if (err) return <p className="admin-error">No se pudieron cargar los pedidos: {err}</p>;
  if (!s) return <p className="muted">Cargando…</p>;
  const maxDay = Math.max(1, ...s.days.map((d) => d.n));

  return (
    <section className="admin-section">
      <h2>Últimos 30 días</h2>
      <div className="kpis">
        <div className="kpi"><span>Pedidos recibidos</span><b>{s.pedidos}</b></div>
        <div className="kpi"><span>Vendidos</span><b>{s.vendidos}</b><small>{s.conversion}% de los pedidos</small></div>
        <div className="kpi"><span>Facturado (vendidos)</span><b>{money(s.facturado)}</b></div>
        <div className="kpi"><span>Ticket promedio</span><b>{money(s.ticket)}</b></div>
      </div>

      <div className="admin-block">
        <h3>Pedidos por día (últimas 2 semanas)</h3>
        <div className="bars" role="img" aria-label="Pedidos por día">
          {s.days.map((d) => (
            <div key={d.key} className="bar" title={`${d.label}: ${d.n}`}>
              <i style={{ height: `${(d.n / maxDay) * 100}%` }} />
              <small>{d.label}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-cols">
        <Rank title="Productos más pedidos" rows={s.topProd} unit="u." />
        <Rank title="Localidades" rows={s.topLoc} unit="pedidos" />
        <Rank title="Formas de pago" rows={s.topPago} unit="pedidos" />
      </div>
      <p className="fine">Visitas, origen del tráfico y productos más vistos: en Google Analytics.</p>
    </section>
  );
}

function Rank({ title, rows, unit }: { title: string; rows: [string, number][]; unit: string }) {
  const max = Math.max(1, ...rows.map((r) => r[1]));
  return (
    <div className="admin-block">
      <h3>{title}</h3>
      {rows.length ? (
        <ul className="rank">
          {rows.map(([k, v]) => (
            <li key={k}>
              <span>{k}</span>
              <b>{v} {unit}</b>
              <i style={{ width: `${(v / max) * 100}%` }} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted">Todavía no hay datos.</p>
      )}
    </div>
  );
}
