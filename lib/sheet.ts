import { categories, type Category, type Product } from "./shop";

// Lee la planilla de Google publicada como CSV y la convierte en productos.
// Columnas (fila 1): id, nombre, categoria, marca, estado, costo, moneda, precio,
// consultar, detalle, compat, plazo, garantia, nota, foto, destacado, activo

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += c;
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((v) => v.trim() !== ""));
}

/** Acepta 1400, 1.400, 1.400,50, 18,5, $ 6.900 */
export function parseNumber(raw: string): number {
  let s = (raw || "").replace(/[$\s]|USD|ARS/gi, "");
  if (!s) return NaN;
  if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
  else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, "");
  return Number(s);
}

const yes = (v: string) => /^(s[ií]|si|x|true|1)$/i.test((v || "").trim());
const validCats = new Set(categories.map((c) => c.id));

export function rowsToProducts(rows: string[][]): Product[] {
  if (!rows.length) return [];
  const head = rows[0].map((h) => h.trim().toLowerCase());
  const get = (r: string[], key: string) => (r[head.indexOf(key)] ?? "").trim();
  const out: Product[] = [];
  for (const r of rows.slice(1)) {
    const nombre = get(r, "nombre");
    const categoria = get(r, "categoria").toLowerCase() as Category;
    const activo = get(r, "activo");
    if (!nombre || !validCats.has(categoria)) continue;
    if (activo && !yes(activo)) continue;
    const costo = parseNumber(get(r, "costo"));
    const precio = parseNumber(get(r, "precio"));
    const consultar = yes(get(r, "consultar"));
    if (!consultar && !(costo > 0) && !(precio > 0)) continue;
    out.push({
      id: get(r, "id") || nombre.toLowerCase().normalize("NFD").replace(/[^\w]+/g, "-").replace(/^-|-$/g, ""),
      nombre,
      categoria,
      marca: get(r, "marca") || "Genérico",
      estado: get(r, "estado") || "Nuevo",
      costo: costo > 0 ? costo : 0,
      moneda: get(r, "moneda").toUpperCase() === "ARS" ? "ARS" : "USD",
      precio: precio > 0 ? precio : undefined,
      consultar,
      detalle: get(r, "detalle") || undefined,
      compat: get(r, "compat") || undefined,
      plazo: get(r, "plazo") || "A confirmar",
      garantia: get(r, "garantia") || "6 meses",
      nota: get(r, "nota") || undefined,
      foto: get(r, "foto") || undefined,
      destacado: yes(get(r, "destacado")),
    });
  }
  return out;
}
