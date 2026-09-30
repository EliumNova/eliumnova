import type { Schema } from "../resource";
import { dataClient } from "../client";
import { catalogoInicial } from "./catalogo";

// Carga inicial automática: la primera vez que arranca el servidor sube el catálogo
// y los códigos de descuento de lanzamiento. Deja una marca para no repetirlo nunca más
// (si después borrás productos desde el panel, no vuelven a aparecer).

const MARCA = "seed-v1";

const cuponesIniciales: Schema["Coupon"]["createType"][] = [
  { codigo: "BIENVENIDA", pct: 5, descripcion: "Primera compra", activo: true, usos: 0 },
  { codigo: "ELIUMNOVA", pct: 5, descripcion: "Seguidores de redes", activo: true, usos: 0 },
];

let hecho = false;

export async function seedIfNeeded(): Promise<boolean> {
  if (hecho) return false;
  const client = await dataClient();
  const { data: marca } = await client.models.Setting.get({ clave: MARCA });
  if (marca) {
    hecho = true;
    return false;
  }
  const ahora = new Date().toISOString();
  for (const p of catalogoInicial) {
    // Si ya existe (otra ejecución en paralelo), el create falla y seguimos.
    await client.models.Product.create({ ...p, costoActualizado: ahora }).catch(() => undefined);
  }
  for (const c of cuponesIniciales) await client.models.Coupon.create(c).catch(() => undefined);
  await client.models.Setting.create({ clave: MARCA, valor: ahora });
  hecho = true;
  return true;
}
