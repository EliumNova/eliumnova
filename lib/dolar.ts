// Dólar blue de CIERRE (valor de venta), el mismo para todo el día.
//
// Regla del negocio:
// - Los precios se calculan con el cierre del blue, no con el valor en vivo.
// - El cierre de un día se toma después de las 18 h (hora de Argentina).
//   Hasta esa hora rige el cierre del día hábil anterior; sábado y domingo, el del viernes.
// - Se consultan dos fuentes y se usa el valor MÁS ALTO, para no vender nunca por debajo.
// - Si no se puede obtener el cierre, no se inventa un valor: los precios pasan a "Consultar".

export const CIERRE_HORA = 18;
const TZ = "America/Argentina/Buenos_Aires";
const DOLARAPI = "https://dolarapi.com/v1/dolares/blue";
const HISTORICO = "https://api.argentinadatos.com/v1/cotizaciones/dolares/blue";

export type Cierre = { venta: number; fecha: string; fuentes: string };

/** Fecha (AAAA-MM-DD), hora y día de la semana (0 = domingo) en Argentina. */
export function enArgentina(d: Date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", hourCycle: "h23", weekday: "short" })
      .formatToParts(d)
      .map((p) => [p.type, p.value]),
  );
  const dias: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return { fecha: `${parts.year}-${parts.month}-${parts.day}`, hora: Number(parts.hour), dia: dias[parts.weekday] ?? 0 };
}

const restarDia = (fecha: string) => {
  const d = new Date(`${fecha}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
};
const diaSemana = (fecha: string) => new Date(`${fecha}T12:00:00Z`).getUTCDay();

/** Fecha del cierre que rige en este momento. */
export function cierreVigente(ahora = new Date()): string {
  const { fecha, hora, dia } = enArgentina(ahora);
  if (dia >= 1 && dia <= 5 && hora >= CIERRE_HORA) return fecha;
  let f = restarDia(fecha);
  while (diaSemana(f) === 0 || diaSemana(f) === 6) f = restarDia(f);
  return f;
}

const conTiempo = (ms: number) => (typeof AbortSignal !== "undefined" && "timeout" in AbortSignal ? AbortSignal.timeout(ms) : undefined);

/** Busca el cierre de una fecha en las dos fuentes y devuelve el valor de venta más alto. */
export async function buscarCierre(fecha: string): Promise<Cierre> {
  const [y, m, d] = fecha.split("-");
  const historico = fetch(`${HISTORICO}/${y}/${m}/${d}`, { cache: "no-store", signal: conTiempo(6000) })
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => (j && j.fecha === fecha && Number(j.venta) > 0 ? Number(j.venta) : 0))
    .catch(() => 0);
  // dolarapi solo sirve si su última actualización es de ese mismo día (después del mercado es el cierre).
  const actual = fetch(DOLARAPI, { cache: "no-store", signal: conTiempo(6000) })
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => (j && Number(j.venta) > 0 && j.fechaActualizacion && enArgentina(new Date(j.fechaActualizacion)).fecha === fecha ? Number(j.venta) : 0))
    .catch(() => 0);
  const [a, b] = await Promise.all([historico, actual]);
  const venta = Math.max(a, b);
  if (!(venta > 0)) throw new Error(`No se pudo obtener el cierre del ${fecha}`);
  const fuentes = [a ? `ArgentinaDatos ${a}` : "", b ? `dolarapi ${b}` : ""].filter(Boolean).join(" · ");
  return { venta, fecha, fuentes };
}

/** "02/10" */
export const fechaCorta = (fecha?: string) => (fecha ? `${fecha.slice(8, 10)}/${fecha.slice(5, 7)}` : "");
