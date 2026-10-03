import { dataClient } from "./client";
import { buscarCierre, cierreVigente, type Cierre } from "../../lib/dolar";

// Guarda el dólar de cierre en la base (Setting "dolar-cierre") para que sea
// el mismo para todos los clientes durante todo el día.

const CLAVE = "dolar-cierre";
let memoria: Cierre | null = null;

export type DolarVigente = Cierre & { alDia: boolean };

/** Devuelve el cierre vigente. Si hay que actualizarlo, lo busca y lo guarda.
 *  Si no se puede actualizar, devuelve el último guardado marcado como no actualizado.
 *  Si nunca hubo uno, devuelve null (los precios pasan a "Consultar"). */
export async function dolarVigente(): Promise<DolarVigente | null> {
  const objetivo = cierreVigente();
  if (memoria && memoria.fecha >= objetivo) return { ...memoria, alDia: true };

  const client = await dataClient();
  const { data } = await client.models.Setting.get({ clave: CLAVE });
  let guardado: Cierre | null = null;
  try {
    guardado = data?.valor ? (JSON.parse(data.valor) as Cierre) : null;
  } catch {}
  if (guardado && guardado.fecha >= objetivo && guardado.venta > 0) {
    memoria = guardado;
    return { ...guardado, alDia: true };
  }

  try {
    const nuevo = await buscarCierre(objetivo);
    const valor = JSON.stringify(nuevo);
    if (data) await client.models.Setting.update({ clave: CLAVE, valor });
    else await client.models.Setting.create({ clave: CLAVE, valor }).catch(() => client.models.Setting.update({ clave: CLAVE, valor }));
    memoria = nuevo;
    return { ...nuevo, alDia: true };
  } catch (e) {
    console.error("dólar de cierre", e);
    return guardado && guardado.venta > 0 ? { ...guardado, alDia: false } : null;
  }
}
