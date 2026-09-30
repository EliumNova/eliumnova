import type { Schema } from "../resource";
import { dataClient, listAll } from "../client";
import { seedIfNeeded } from "../seed";
import { priceOf, shop, type Product } from "../../../lib/shop";

// Catálogo público: precios finales en pesos calculados en el servidor.
// El navegador del cliente nunca recibe costos, monedas de compra ni márgenes.

type Row = Schema["Product"]["type"];
let cache: { at: number; value: Schema["CatalogResult"]["type"] } | null = null;

async function dolarBlue(): Promise<{ value: number; live: boolean }> {
  try {
    const r = await fetch(shop.dolarApiUrl, { signal: AbortSignal.timeout(4000) });
    const d = (await r.json()) as { venta?: number };
    if (d?.venta && d.venta > 0) return { value: d.venta, live: true };
  } catch {}
  return { value: shop.dolarFallback, live: false };
}

export const toProduct = (r: Row): Product => ({
  id: r.slug,
  nombre: r.nombre,
  categoria: (r.categoria as Product["categoria"]) ?? "accesorios",
  marca: r.marca ?? "Genérico",
  estado: r.estado ?? "Nuevo",
  costo: r.costo ?? 0,
  moneda: r.moneda === "ARS" ? "ARS" : "USD",
  precio: r.precio ?? undefined,
  consultar: !!r.consultar,
  detalle: r.detalle ?? undefined,
  compat: r.compat ?? undefined,
  plazo: r.plazo ?? "A confirmar",
  garantia: r.garantia ?? "6 meses",
  nota: r.nota ?? undefined,
  foto: r.foto ?? undefined,
  destacado: !!r.destacado,
});

export const handler: Schema["getCatalog"]["functionHandler"] = async () => {
  if (cache && Date.now() - cache.at < 60_000) return cache.value;
  const client = await dataClient();
  await seedIfNeeded().catch((e) => console.error("seed", e));
  const [rows, dolar] = await Promise.all([
    listAll<Row>((nextToken) => client.models.Product.list({ limit: 500, nextToken })),
    dolarBlue(),
  ]);
  const productos = rows
    .filter((r) => r.activo !== false)
    .sort((a, b) => (a.orden ?? 999) - (b.orden ?? 999))
    .map((r) => {
      const p = toProduct(r);
      const precio = priceOf(p, dolar.value);
      // Solo campos públicos.
      return {
        id: p.id,
        nombre: p.nombre,
        categoria: p.categoria,
        marca: p.marca,
        estado: p.estado,
        detalle: p.detalle,
        compat: p.compat,
        plazo: p.plazo,
        garantia: p.garantia,
        nota: p.nota,
        foto: p.foto,
        destacado: p.destacado,
        consultar: precio === null,
        precio: precio ?? undefined,
      };
    });
  const value = { productos, dolar: dolar.value, dolarEnVivo: dolar.live, actualizado: new Date().toISOString() };
  cache = { at: Date.now(), value };
  return value;
};
