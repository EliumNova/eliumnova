"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { categories, money, priceOf, shop, type Product } from "@/lib/shop";
import { parseCsv, parseNumber } from "@/lib/sheet";
import { userApi } from "@/lib/backend";
import { api, fmtDate, type ProductRow } from "./data";

type Draft = {
  slug: string; nombre: string; categoria: string; marca: string; estado: string;
  costo: string; moneda: string; precio: string; detalle: string; compat: string; plazo: string;
  garantia: string; nota: string; foto: string; proveedor: string; codigoProveedor: string;
  orden: string; activo: boolean; destacado: boolean; consultar: boolean;
};

const empty: Draft = {
  slug: "", nombre: "", categoria: "celulares", marca: "", estado: "Nuevo", costo: "", moneda: "USD", precio: "",
  detalle: "", compat: "", plazo: "24 a 48 h", garantia: "6 meses", nota: "", foto: "", proveedor: "", codigoProveedor: "",
  orden: "", activo: true, destacado: false, consultar: false,
};

const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const toDraft = (r: ProductRow): Draft => ({
  slug: r.slug, nombre: r.nombre, categoria: r.categoria, marca: r.marca ?? "", estado: r.estado ?? "Nuevo",
  costo: r.costo != null ? String(r.costo) : "", moneda: r.moneda ?? "USD", precio: r.precio != null ? String(r.precio) : "",
  detalle: r.detalle ?? "", compat: r.compat ?? "", plazo: r.plazo ?? "", garantia: r.garantia ?? "", nota: r.nota ?? "",
  foto: r.foto ?? "", proveedor: r.proveedor ?? "", codigoProveedor: r.codigoProveedor ?? "", orden: r.orden != null ? String(r.orden) : "",
  activo: r.activo !== false, destacado: !!r.destacado, consultar: !!r.consultar,
});
const fromDraft = (d: Draft) => ({
  slug: d.slug || slugify(d.nombre), nombre: d.nombre.trim(), categoria: d.categoria, marca: d.marca.trim() || null, estado: d.estado.trim() || null,
  costo: d.costo ? parseNumber(d.costo) : null, moneda: d.moneda, precio: d.precio ? parseNumber(d.precio) : null,
  detalle: d.detalle.trim() || null, compat: d.compat.trim() || null, plazo: d.plazo.trim() || null, garantia: d.garantia.trim() || null,
  nota: d.nota.trim() || null, foto: d.foto.trim() || null, proveedor: d.proveedor.trim() || null, codigoProveedor: d.codigoProveedor.trim() || null,
  orden: d.orden ? Math.round(parseNumber(d.orden)) : null, activo: d.activo, destacado: d.destacado, consultar: d.consultar,
});
const asProduct = (r: ProductRow): Product => ({
  id: r.slug, nombre: r.nombre, categoria: r.categoria as Product["categoria"], marca: r.marca ?? "", estado: r.estado ?? "",
  costo: r.costo ?? 0, moneda: r.moneda === "ARS" ? "ARS" : "USD", precio: r.precio ?? undefined, consultar: !!r.consultar,
  plazo: "", garantia: "",
});

export default function Products() {
  const [rows, setRows] = useState<ProductRow[] | null>(null);
  const [dolar, setDolar] = useState(shop.dolarFallback);
  const [edit, setEdit] = useState<Draft | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => api.products().then((r) => setRows(r.sort((a, b) => (a.orden ?? 999) - (b.orden ?? 999) || a.nombre.localeCompare(b.nombre)))).catch((e) => setMsg(String(e?.message ?? e)));
  useEffect(() => {
    load();
    fetch(shop.dolarApiUrl).then((r) => r.json()).then((d) => d?.venta > 0 && setDolar(d.venta)).catch(() => {});
  }, []);

  const list = useMemo(() => (rows ?? []).filter((r) => !q || `${r.nombre} ${r.marca} ${r.proveedor}`.toLowerCase().includes(q.toLowerCase())), [rows, q]);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!edit) return;
    setBusy(true);
    const input = fromDraft(edit);
    const res = isNew ? await userApi().models.Product.create(input) : await userApi().models.Product.update(input);
    setBusy(false);
    if (res.errors?.length) return setMsg(res.errors[0].message);
    setEdit(null);
    setMsg(`Guardado: ${input.nombre}`);
    load();
  }

  async function quick(r: ProductRow, patch: Partial<ProductRow>) {
    setRows((l) => l?.map((x) => (x.slug === r.slug ? { ...x, ...patch } : x)) ?? null);
    const { errors } = await userApi().models.Product.update({ slug: r.slug, ...patch } as Parameters<ReturnType<typeof userApi>["models"]["Product"]["update"]>[0]);
    if (errors?.length) setMsg(errors[0].message);
  }

  async function remove(r: ProductRow) {
    if (!window.confirm(`¿Borrar "${r.nombre}"? Si solo querés ocultarlo, desactivalo.`)) return;
    await userApi().models.Product.delete({ slug: r.slug });
    load();
  }

  async function importCsv(file: File) {
    setBusy(true);
    setMsg("Importando…");
    const rowsCsv = parseCsv(await file.text());
    const head = rowsCsv[0].map((h) => h.trim().toLowerCase());
    const get = (r: string[], k: string) => (r[head.indexOf(k)] ?? "").trim();
    const yes = (v: string) => /^(s[ií]|si|x|true|1)$/i.test(v);
    const existing = new Set((rows ?? []).map((r) => r.slug));
    let creados = 0, actualizados = 0, errores = 0;
    for (const r of rowsCsv.slice(1)) {
      const nombre = get(r, "nombre");
      if (!nombre) continue;
      const d: Draft = {
        ...empty,
        slug: get(r, "id") || slugify(nombre), nombre, categoria: get(r, "categoria").toLowerCase() || "accesorios", marca: get(r, "marca"),
        estado: get(r, "estado") || "Nuevo", costo: get(r, "costo"), moneda: get(r, "moneda").toUpperCase() === "ARS" ? "ARS" : "USD",
        precio: get(r, "precio"), detalle: get(r, "detalle"), compat: get(r, "compat"), plazo: get(r, "plazo"), garantia: get(r, "garantia"),
        nota: get(r, "nota"), foto: get(r, "foto"), proveedor: get(r, "proveedor"), codigoProveedor: get(r, "codigo_proveedor"), orden: get(r, "orden"),
        activo: get(r, "activo") ? yes(get(r, "activo")) : true, destacado: yes(get(r, "destacado")), consultar: yes(get(r, "consultar")),
      };
      const input = fromDraft(d);
      const res = existing.has(input.slug) ? await userApi().models.Product.update(input) : await userApi().models.Product.create(input);
      if (res.errors?.length) errores++;
      else if (existing.has(input.slug)) actualizados++;
      else creados++;
    }
    setBusy(false);
    setMsg(`Importación lista: ${creados} nuevos, ${actualizados} actualizados${errores ? `, ${errores} con error` : ""}.`);
    load();
  }

  if (!rows) return <p className="muted">Cargando…</p>;

  return (
    <section className="admin-section">
      <div className="admin-head">
        <h2>Productos <small className="muted">({rows.length})</small></h2>
        <input className="admin-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar…" />
        <button className="btn btn-main btn-sm" onClick={() => { setEdit({ ...empty }); setIsNew(true); }}>Nuevo producto</button>
        <label className="btn btn-line btn-sm file-btn">
          Importar CSV
          <input type="file" accept=".csv,text/csv" disabled={busy} onChange={(e) => e.target.files?.[0] && importCsv(e.target.files[0])} />
        </label>
      </div>
      <p className="fine">Precio de venta calculado con el dólar blue de hoy ({money(dolar)}) y la regla de margen. El cliente nunca ve el costo.</p>
      {msg && <p className="admin-msg">{msg}</p>}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th>Producto</th><th>Proveedor</th><th className="num">Costo</th><th className="num">Precio fijo</th><th className="num">Venta</th><th>Activo</th><th>Dest.</th><th></th></tr>
          </thead>
          <tbody>
            {list.map((r) => {
              const venta = priceOf(asProduct(r), dolar);
              return (
                <tr key={r.slug} className={r.activo === false ? "off" : ""}>
                  <td><b>{r.nombre}</b><br /><small className="muted">{r.categoria} · {r.detalle}</small></td>
                  <td>{r.proveedor}<br /><small className="muted">{r.costoActualizado ? `act. ${fmtDate(r.costoActualizado)}` : ""}</small></td>
                  <td className="num">
                    <input className="cell-input" defaultValue={r.costo ?? ""} onBlur={(e) => { const v = parseNumber(e.target.value); if (v !== r.costo) quick(r, { costo: Number.isFinite(v) ? v : null }); }} />
                    <small className="muted"> {r.moneda}</small>
                  </td>
                  <td className="num">
                    <input className="cell-input" defaultValue={r.precio ?? ""} placeholder="—" onBlur={(e) => { const v = e.target.value ? parseNumber(e.target.value) : null; if (v !== (r.precio ?? null)) quick(r, { precio: v }); }} />
                  </td>
                  <td className="num">{venta === null ? "Consultar" : money(venta)}</td>
                  <td><input type="checkbox" checked={r.activo !== false} onChange={(e) => quick(r, { activo: e.target.checked })} aria-label="Activo" /></td>
                  <td><input type="checkbox" checked={!!r.destacado} onChange={(e) => quick(r, { destacado: e.target.checked })} aria-label="Destacado" /></td>
                  <td className="actions">
                    <button className="link" onClick={() => { setEdit(toDraft(r)); setIsNew(false); }}>Editar</button>
                    <button className="link danger" onClick={() => remove(r)}>Borrar</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {edit && (
        <div className="overlay" onClick={() => setEdit(null)}>
          <form className="sheet admin-form" onSubmit={save} onClick={(e) => e.stopPropagation()}>
            <h3>{isNew ? "Nuevo producto" : edit.nombre}</h3>
            <div className="form-grid">
              <F label="Nombre" full><input required value={edit.nombre} onChange={(e) => setEdit({ ...edit, nombre: e.target.value, slug: isNew ? slugify(e.target.value) : edit.slug })} /></F>
              <F label="Categoría"><select value={edit.categoria} onChange={(e) => setEdit({ ...edit, categoria: e.target.value })}>{categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select></F>
              <F label="Marca"><input value={edit.marca} onChange={(e) => setEdit({ ...edit, marca: e.target.value })} /></F>
              <F label="Estado"><select value={edit.estado} onChange={(e) => setEdit({ ...edit, estado: e.target.value })}><option>Nuevo</option><option>Sellado</option><option>Reacondicionado</option></select></F>
              <F label="Detalle (ej. 4 GB · 128 GB)"><input value={edit.detalle} onChange={(e) => setEdit({ ...edit, detalle: e.target.value })} /></F>
              <F label="Costo"><input value={edit.costo} onChange={(e) => setEdit({ ...edit, costo: e.target.value })} /></F>
              <F label="Moneda del costo"><select value={edit.moneda} onChange={(e) => setEdit({ ...edit, moneda: e.target.value })}><option>USD</option><option>ARS</option></select></F>
              <F label="Precio fijo en pesos (opcional)"><input value={edit.precio} onChange={(e) => setEdit({ ...edit, precio: e.target.value })} /></F>
              <F label="Orden en la tienda"><input value={edit.orden} onChange={(e) => setEdit({ ...edit, orden: e.target.value })} /></F>
              <F label="Proveedor"><input value={edit.proveedor} onChange={(e) => setEdit({ ...edit, proveedor: e.target.value })} placeholder="Onpres, Zona, GoaTech…" /></F>
              <F label="Código en la planilla del proveedor"><input value={edit.codigoProveedor} onChange={(e) => setEdit({ ...edit, codigoProveedor: e.target.value })} placeholder="Ej. MXP63LL/A" /></F>
              <F label="Plazo"><input value={edit.plazo} onChange={(e) => setEdit({ ...edit, plazo: e.target.value })} /></F>
              <F label="Garantía"><input value={edit.garantia} onChange={(e) => setEdit({ ...edit, garantia: e.target.value })} /></F>
              <F label="Compatible con" full><input value={edit.compat} onChange={(e) => setEdit({ ...edit, compat: e.target.value })} /></F>
              <F label="Nota" full><input value={edit.nota} onChange={(e) => setEdit({ ...edit, nota: e.target.value })} /></F>
              <F label="Foto (link)" full><input value={edit.foto} onChange={(e) => setEdit({ ...edit, foto: e.target.value })} /></F>
            </div>
            <div className="checks">
              <label><input type="checkbox" checked={edit.activo} onChange={(e) => setEdit({ ...edit, activo: e.target.checked })} /> Activo</label>
              <label><input type="checkbox" checked={edit.destacado} onChange={(e) => setEdit({ ...edit, destacado: e.target.checked })} /> Destacado</label>
              <label><input type="checkbox" checked={edit.consultar} onChange={(e) => setEdit({ ...edit, consultar: e.target.checked })} /> Mostrar "Consultar precio"</label>
            </div>
            <div className="row">
              <button className="btn btn-main" disabled={busy}>Guardar</button>
              <button type="button" className="btn btn-line" onClick={() => setEdit(null)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

function F({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={`field${full ? " co-full" : ""}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}
