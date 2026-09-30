import type { Schema } from "../resource";
import { dataClient, listAll } from "../client";
import { seedIfNeeded } from "../seed";
import { parseCsv, parseNumber } from "../../../lib/sheet";

// Lee las planillas de proveedores (publicadas como CSV) y actualiza el costo
// de los productos que tengan el mismo proveedor y código.
// Corre cada hora y también cuando lo pedís desde el panel.

type Product = Schema["Product"]["type"];
type Source = Schema["SupplierSource"]["type"];

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

async function run(): Promise<string> {
  const client = await dataClient();
  await seedIfNeeded().catch((e) => console.error("seed", e));
  const [sources, products] = await Promise.all([
    listAll<Source>((nextToken) => client.models.SupplierSource.list({ limit: 100, nextToken })),
    listAll<Product>((nextToken) => client.models.Product.list({ limit: 500, nextToken })),
  ]);
  const partes: string[] = [];
  for (const src of sources.filter((s) => s.activo !== false)) {
    let resultado: string;
    try {
      const r = await fetch(src.csvUrl, { signal: AbortSignal.timeout(15000) });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const rows = parseCsv(await r.text());
      // La fila de encabezados es la primera que contiene las dos columnas.
      const hi = rows.findIndex((row) => row.some((c) => norm(c) === norm(src.columnaCodigo)) && row.some((c) => norm(c) === norm(src.columnaCosto)));
      if (hi < 0) throw new Error("no encontré las columnas");
      const head = rows[hi].map(norm);
      const ci = head.indexOf(norm(src.columnaCodigo));
      const pi = head.indexOf(norm(src.columnaCosto));
      const costos = new Map<string, number>();
      for (const row of rows.slice(hi + 1)) {
        const code = norm(row[ci] ?? "");
        const cost = parseNumber(row[pi] ?? "");
        if (code && cost > 0) costos.set(code, cost);
      }
      let actualizados = 0;
      for (const p of products.filter((x) => x.proveedor && norm(x.proveedor) === norm(src.nombre) && x.codigoProveedor)) {
        const cost = costos.get(norm(p.codigoProveedor!));
        if (cost && cost !== p.costo) {
          await client.models.Product.update({ slug: p.slug, costo: cost, moneda: src.moneda ?? p.moneda, costoActualizado: new Date().toISOString() });
          actualizados++;
        }
      }
      resultado = `${actualizados} costos actualizados de ${costos.size} filas leídas`;
    } catch (e) {
      resultado = `Error: ${(e as Error).message}`;
    }
    await client.models.SupplierSource.update({ id: src.id, ultimaSync: new Date().toISOString(), ultimoResultado: resultado });
    partes.push(`${src.nombre}: ${resultado}`);
  }
  return partes.join(" · ") || "No hay planillas de proveedores cargadas.";
}

// Sirve para la ejecución programada y para la mutación syncSuppliersNow.
export const handler = async (event: unknown) => {
  const resumen = await run();
  const isGraphql = typeof event === "object" && event !== null && "arguments" in event;
  return isGraphql ? { ok: !resumen.startsWith("Error"), resumen } : undefined;
};
