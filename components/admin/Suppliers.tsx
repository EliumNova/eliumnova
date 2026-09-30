"use client";

import { useEffect, useState, type FormEvent } from "react";
import { userApi } from "@/lib/backend";
import { api, fmtDate, type SupplierRow } from "./data";

// Planillas de proveedores publicadas como CSV. El servidor las lee cada hora
// y actualiza el costo de los productos con el mismo proveedor y código.
export default function Suppliers() {
  const [rows, setRows] = useState<SupplierRow[] | null>(null);
  const [f, setF] = useState({ nombre: "", csvUrl: "", columnaCodigo: "", columnaCosto: "", moneda: "USD" });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const load = () => api.suppliers().then(setRows).catch((e) => setMsg(String(e?.message ?? e)));
  useEffect(() => {
    load();
  }, []);

  async function create(e: FormEvent) {
    e.preventDefault();
    const { errors } = await userApi().models.SupplierSource.create({ ...f, activo: true });
    if (errors?.length) return setMsg(errors[0].message);
    setF({ nombre: "", csvUrl: "", columnaCodigo: "", columnaCosto: "", moneda: "USD" });
    setMsg("Planilla agregada.");
    load();
  }
  async function syncNow() {
    setBusy(true);
    setMsg("Sincronizando…");
    const { data, errors } = await userApi().mutations.syncSuppliersNow();
    setBusy(false);
    setMsg(errors?.length ? errors[0].message : data?.resumen ?? "Listo.");
    load();
  }
  async function toggle(s: SupplierRow) {
    await userApi().models.SupplierSource.update({ id: s.id, activo: s.activo === false });
    load();
  }
  async function remove(s: SupplierRow) {
    if (!window.confirm(`¿Quitar la planilla de ${s.nombre}?`)) return;
    await userApi().models.SupplierSource.delete({ id: s.id });
    load();
  }

  return (
    <section className="admin-section">
      <div className="admin-head">
        <h2>Planillas de proveedores</h2>
        <button className="btn btn-main btn-sm" onClick={syncNow} disabled={busy}>Sincronizar ahora</button>
      </div>
      <p className="fine">
        Se actualizan solas cada hora. Para que un producto se actualice, en su ficha poné el mismo <b>proveedor</b> y el <b>código</b> con el que
        figura en la planilla (por ejemplo MXP63LL/A en Onpres). La planilla tiene que estar publicada como CSV o compartida con “cualquier persona con el link”.
      </p>
      {msg && <p className="admin-msg">{msg}</p>}
      <form className="admin-block form-grid" onSubmit={create}>
        <label className="field"><span>Proveedor</span><input required value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} placeholder="Onpres" /></label>
        <label className="field"><span>Moneda de la planilla</span><select value={f.moneda} onChange={(e) => setF({ ...f, moneda: e.target.value })}><option>USD</option><option>ARS</option></select></label>
        <label className="field co-full"><span>Link CSV de la planilla</span><input required value={f.csvUrl} onChange={(e) => setF({ ...f, csvUrl: e.target.value })} placeholder="https://docs.google.com/spreadsheets/d/.../export?format=csv&gid=..." /></label>
        <label className="field"><span>Columna del código</span><input required value={f.columnaCodigo} onChange={(e) => setF({ ...f, columnaCodigo: e.target.value })} placeholder="CÓDIGO" /></label>
        <label className="field"><span>Columna del precio</span><input required value={f.columnaCosto} onChange={(e) => setF({ ...f, columnaCosto: e.target.value })} placeholder="PRECIO MAYORISTA" /></label>
        <div className="co-full"><button className="btn btn-line btn-sm">Agregar planilla</button></div>
      </form>
      {!rows ? <p className="muted">Cargando…</p> : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Proveedor</th><th>Columnas</th><th>Última sincronización</th><th>Activa</th><th></th></tr></thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id} className={s.activo === false ? "off" : ""}>
                  <td><b>{s.nombre}</b><br /><small className="muted">{s.moneda}</small></td>
                  <td>{s.columnaCodigo} → {s.columnaCosto}</td>
                  <td>{fmtDate(s.ultimaSync)}<br /><small className="muted">{s.ultimoResultado}</small></td>
                  <td><input type="checkbox" checked={s.activo !== false} onChange={() => toggle(s)} aria-label="Activa" /></td>
                  <td><button className="link danger" onClick={() => remove(s)}>Quitar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
