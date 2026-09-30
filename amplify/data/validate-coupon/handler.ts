import type { Schema } from "../resource";
import { dataClient } from "../client";

// Valida un código de descuento sin exponer la lista de códigos.
const today = () => new Date(Date.now() - 3 * 3600_000).toISOString().slice(0, 10); // fecha de Argentina

export async function findValidCoupon(codigo: string) {
  const code = (codigo || "").trim().toUpperCase();
  if (!code || code.length > 40) return null;
  const client = await dataClient();
  const { data } = await client.models.Coupon.get({ codigo: code });
  if (!data || data.activo === false) return null;
  const d = today();
  if (data.desde && d < data.desde) return null;
  if (data.hasta && d > data.hasta) return null;
  return data;
}

export const handler: Schema["validateCoupon"]["functionHandler"] = async (event) => {
  const c = await findValidCoupon(event.arguments.codigo);
  if (!c) return { valido: false, mensaje: "Ese código no existe o ya no está vigente." };
  return {
    valido: true,
    codigo: c.codigo,
    pct: c.pct,
    descripcion: c.descripcion ?? `${c.pct}% de descuento`,
    categorias: (c.categorias ?? []).filter((x): x is string => !!x),
  };
};
