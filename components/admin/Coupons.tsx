"use client";

import { useEffect, useState, type FormEvent } from "react";
import { categories } from "@/lib/shop";
import { userApi } from "@/lib/backend";
import { api, type CouponRow } from "./data";

export default function Coupons() {
  const [rows, setRows] = useState<CouponRow[] | null>(null);
  const [f, setF] = useState({ codigo: "", pct: "5", descripcion: "", desde: "", hasta: "", categorias: [] as string[] });
  const [msg, setMsg] = useState("");
  const load = () => api.coupons().then((r) => setRows(r.sort((a, b) => a.codigo.localeCompare(b.codigo)))).catch((e) => setMsg(String(e?.message ?? e)));
  useEffect(() => {
    load();
  }, []);

  async function create(e: FormEvent) {
    e.preventDefault();
    const codigo = f.codigo.trim().toUpperCase().replace(/\s+/g, "");
    const pct = Number(f.pct.replace(",", "."));
    if (!codigo || !(pct > 0 && pct <= 50)) return setMsg("Revisá el código y el porcentaje (entre 1 y 50).");
    const { errors } = await userApi().models.Coupon.create({
      codigo, pct, descripcion: f.descripcion.trim() || `${pct}% de descuento`,
      desde: f.desde || null, hasta: f.hasta || null, categorias: f.categorias.length ? f.categorias : null, activo: true, usos: 0,
    });
    if (errors?.length) return setMsg(errors[0].message);
    setF({ codigo: "", pct: "5", descripcion: "", desde: "", hasta: "", categorias: [] });
    setMsg(`Código ${codigo} creado.`);
    load();
  }

  async function toggle(c: CouponRow) {
    await userApi().models.Coupon.update({ codigo: c.codigo, activo: c.activo === false });
    load();
  }
  async function remove(c: CouponRow) {
    if (!window.confirm(`¿Borrar el código ${c.codigo}?`)) return;
    await userApi().models.Coupon.delete({ codigo: c.codigo });
    load();
  }

  return (
    <section className="admin-section">
      <h2>Códigos de descuento</h2>
      <p className="fine">Se validan en el servidor: nadie puede verlos en el código de la página. No se suman a productos que ya están en oferta.</p>
      {msg && <p className="admin-msg">{msg}</p>}
      <form className="admin-block form-grid" onSubmit={create}>
        <label className="field"><span>Código</span><input value={f.codigo} onChange={(e) => setF({ ...f, codigo: e.target.value })} placeholder="BIENVENIDA" required /></label>
        <label className="field"><span>% de descuento</span><input value={f.pct} onChange={(e) => setF({ ...f, pct: e.target.value })} inputMode="decimal" required /></label>
        <label className="field co-full"><span>Descripción (la ve el cliente)</span><input value={f.descripcion} onChange={(e) => setF({ ...f, descripcion: e.target.value })} placeholder="5% en tu primera compra" /></label>
        <label className="field"><span>Desde (opcional)</span><input type="date" value={f.desde} onChange={(e) => setF({ ...f, desde: e.target.value })} /></label>
        <label className="field"><span>Hasta (opcional)</span><input type="date" value={f.hasta} onChange={(e) => setF({ ...f, hasta: e.target.value })} /></label>
        <div className="co-full checks">
          <span className="muted">Solo para (vacío = todo):</span>
          {categories.map((c) => (
            <label key={c.id}>
              <input type="checkbox" checked={f.categorias.includes(c.id)} onChange={(e) => setF({ ...f, categorias: e.target.checked ? [...f.categorias, c.id] : f.categorias.filter((x) => x !== c.id) })} /> {c.label}
            </label>
          ))}
        </div>
        <div className="co-full"><button className="btn btn-main btn-sm">Crear código</button></div>
      </form>

      {!rows ? <p className="muted">Cargando…</p> : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Código</th><th>%</th><th>Descripción</th><th>Vigencia</th><th>Usos</th><th>Activo</th><th></th></tr></thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.codigo} className={c.activo === false ? "off" : ""}>
                  <td><b>{c.codigo}</b></td>
                  <td>{c.pct}%</td>
                  <td>{c.descripcion}{c.categorias?.length ? <small className="muted"> · {c.categorias.join(", ")}</small> : null}</td>
                  <td>{c.desde || "—"} → {c.hasta || "—"}</td>
                  <td>{c.usos ?? 0}</td>
                  <td><input type="checkbox" checked={c.activo !== false} onChange={() => toggle(c)} aria-label="Activo" /></td>
                  <td><button className="link danger" onClick={() => remove(c)}>Borrar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
