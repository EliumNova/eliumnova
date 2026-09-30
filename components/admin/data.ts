"use client";
import type { Schema } from "@/amplify/data/resource";
import { parseJson, userApi } from "@/lib/backend";

export type OrderRow = Schema["Order"]["type"];
export type ProductRow = Schema["Product"]["type"];
export type CouponRow = Schema["Coupon"]["type"];
export type SupplierRow = Schema["SupplierSource"]["type"];
export type OrderItem = { id: string; nombre: string; categoria: string; marca?: string; cantidad: number; precio: number | null; enOferta?: boolean };

async function all<T>(page: (nextToken?: string | null) => Promise<{ data: T[]; nextToken?: string | null }>) {
  const out: T[] = [];
  let token: string | null | undefined;
  do {
    const r = await page(token);
    out.push(...r.data);
    token = r.nextToken;
  } while (token);
  return out;
}

export const api = {
  orders: () => all<OrderRow>((nextToken) => userApi().models.Order.list({ limit: 500, nextToken })),
  products: () => all<ProductRow>((nextToken) => userApi().models.Product.list({ limit: 500, nextToken })),
  coupons: () => all<CouponRow>((nextToken) => userApi().models.Coupon.list({ limit: 200, nextToken })),
  suppliers: () => all<SupplierRow>((nextToken) => userApi().models.SupplierSource.list({ limit: 100, nextToken })),
};

export const itemsOf = (o: OrderRow): OrderItem[] => {
  try {
    return parseJson<OrderItem[]>(o.items) ?? [];
  } catch {
    return [];
  }
};

export const fmtDate = (s?: string | null) =>
  s ? new Date(s).toLocaleString("es-AR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "";
