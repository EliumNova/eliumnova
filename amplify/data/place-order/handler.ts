import type { Schema } from "../resource";
import { dataClient } from "../client";
import { findValidCoupon } from "../validate-coupon/handler";

// Registra un pedido de la tienda. El pedido se confirma después por WhatsApp,
// pero acá se recalcula el descuento del código en el servidor y se marca si coincide.

type Item = { id: string; nombre: string; categoria: string; marca?: string; cantidad: number; precio: number | null; enOferta?: boolean };
type Pedido = {
  codigo: string;
  nombre?: string;
  telefono?: string;
  email?: string;
  localidad?: string;
  entrega?: string;
  direccion?: string;
  pago?: string;
  items: Item[];
  subtotal: number;
  descuento: number;
  total: number;
  reserva?: number;
  codigoDescuento?: string;
  dolar?: number;
  origen?: string;
  nota?: string;
};

const str = (v: unknown, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : undefined);
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);

export const handler: Schema["placeOrder"]["functionHandler"] = async (event) => {
  let raw: unknown = event.arguments.pedido;
  for (let i = 0; i < 2 && typeof raw === "string"; i++) raw = JSON.parse(raw);
  const p = raw as Pedido;
  if (!p || !/^EN-\d{4}-\d{4}$/.test(p.codigo ?? "") || !Array.isArray(p.items) || !p.items.length || p.items.length > 50) {
    return { ok: false, mensaje: "Pedido inválido." };
  }
  const items = p.items.slice(0, 50).map((it) => ({
    id: str(it.id, 80),
    nombre: str(it.nombre, 120),
    categoria: str(it.categoria, 30),
    marca: str(it.marca, 60),
    cantidad: Math.max(1, Math.min(99, Math.round(num(it.cantidad)))),
    precio: it.precio === null ? null : num(it.precio),
    enOferta: !!it.enOferta,
  }));

  // Recalcular el descuento del código (si hay) con la regla del servidor.
  let verificado = true;
  if (p.codigoDescuento) {
    const c = await findValidCoupon(p.codigoDescuento);
    if (!c) verificado = false;
  }

  const client = await dataClient();
  const { errors } = await client.models.Order.create({
    codigo: p.codigo,
    estado: "PENDIENTE",
    nombre: str(p.nombre, 120),
    telefono: str(p.telefono, 40),
    email: str(p.email, 120),
    localidad: str(p.localidad, 120),
    entrega: str(p.entrega, 80),
    direccion: str(p.direccion, 200),
    pago: str(p.pago, 60),
    items: JSON.stringify(items),
    subtotal: num(p.subtotal),
    descuento: num(p.descuento),
    total: num(p.total),
    reserva: num(p.reserva),
    codigoDescuento: str(p.codigoDescuento, 40),
    dolar: num(p.dolar),
    origen: str(p.origen, 300),
    nota: str(p.nota, 500),
    verificado,
  });
  if (errors?.length) return { ok: false, mensaje: "No se pudo registrar el pedido." };

  if (p.codigoDescuento && verificado) {
    const c = await client.models.Coupon.get({ codigo: p.codigoDescuento.trim().toUpperCase() });
    if (c.data) await client.models.Coupon.update({ codigo: c.data.codigo, usos: (c.data.usos ?? 0) + 1 });
  }
  return { ok: true, codigo: p.codigo };
};
