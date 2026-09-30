"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { site } from "@/lib/site";
import { money } from "@/lib/shop";
import { track } from "@/lib/track";
import { WhatsAppIcon } from "../Icons";
import ShopProvider, { useShop } from "./ShopProvider";
import CategoryIcon from "./CategoryIcon";
import MonedaToggle from "./MonedaToggle";
import {
  extras,
  gabinetes,
  graficas,
  plataformas,
  presupuestos,
  resoluciones,
  sugerencia,
  usos,
  type PresupuestoId,
  type Uso,
} from "@/lib/pc";

export default function PcBuilder() {
  return (
    <ShopProvider>
      <Builder />
    </ShopProvider>
  );
}

function pcCode() {
  const d = new Date();
  return `PC-${String(d.getDate()).padStart(2, "0")}${String(d.getMonth() + 1).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function Builder() {
  const { dolar, moneda } = useShop();
  const [uso, setUso] = useState<Uso | null>(null);
  const [presu, setPresu] = useState<PresupuestoId | null>(null);
  const [plataforma, setPlataforma] = useState<string>("Me da igual");
  const [grafica, setGrafica] = useState<string>("Me da igual");
  const [resolucion, setResolucion] = useState<string>(resoluciones[0]);
  const [gabinete, setGabinete] = useState<string>("Me da igual");
  const [sumar, setSumar] = useState<string[]>([]);
  const [programas, setProgramas] = useState("");
  const [nombre, setNombre] = useState("");
  const [tel, setTel] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [nota, setNota] = useState("");
  const [acepto, setAcepto] = useState(false);
  const [done, setDone] = useState<{ code: string; msg: string } | null>(null);

  useEffect(() => {
    if (uso) track("pc_uso", { uso });
  }, [uso]);

  const juega = uso === "gaming" || uso === "stream";
  const presuObj = presupuestos.find((p) => p.id === presu);
  const pesos = (usd: number) => money(Math.round((usd * dolar.value) / 10_000) * 10_000);
  const rangoPesos = (p: (typeof presupuestos)[number]) =>
    p.hasta === 0 ? `Más de ${pesos(p.desde)}` : p.desde === 0 ? `Hasta ${pesos(p.hasta)}` : `${pesos(p.desde)} a ${pesos(p.hasta)}`;
  const presuTexto = (p: (typeof presupuestos)[number]) =>
    p.id === "p0" ? "Te recomendamos según el uso" : moneda === "USD" ? p.label : rangoPesos(p);
  const presuAlt = (p: (typeof presupuestos)[number]) => (p.id === "p0" ? "" : moneda === "USD" ? rangoPesos(p) : p.label);
  const conf = uso && presu ? sugerencia(uso, presu) : null;
  const toggle = (x: string) => setSumar((s) => (s.includes(x) ? s.filter((y) => y !== x) : [...s, x]));

  function send(e: FormEvent) {
    e.preventDefault();
    if (!uso || !presu || !presuObj) return;
    const code = pcCode();
    const usoObj = usos.find((u) => u.id === uso)!;
    const presuMsg = presu === "p0" ? "que me recomienden" : `${presuObj.label} (${rangoPesos(presuObj)})`;
    const msg = [
      `Hola EliumNova! Quiero armar una PC (${code}):`,
      "",
      `*Uso:* ${usoObj.label}`,
      `*Presupuesto (solo la PC):* ${presuMsg}`,
      `*Procesador:* ${plataforma}`,
      `*Placa de video:* ${grafica}`,
      ...(juega ? [`*Objetivo:* ${resolucion}`] : []),
      `*Gabinete:* ${gabinete}`,
      ...(programas.trim() ? [`*Juegos / programas:* ${programas.trim()}`] : []),
      ...(sumar.length ? [`*Sumar:* ${sumar.join(", ")}`] : []),
      "",
      "*Configuración orientativa de la web:*",
      ...(conf ?? []).map((c) => `• ${c.pieza}: ${c.texto}`),
      "",
      `*Nombre:* ${nombre.trim()}`,
      `*Teléfono:* ${tel.trim()}`,
      `*Localidad:* ${localidad.trim()}`,
      ...(nota.trim() ? [`*Nota:* ${nota.trim()}`] : []),
      "",
      `Dólar de referencia en la web: ${money(dolar.value)}.`,
    ].join("\n");
    window.open(`https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
    track("generate_lead", { lead_type: "arma_tu_pc", uso, presupuesto: presu });
    setDone({ code, msg });
    window.scrollTo({ top: 0 });
  }

  if (done) {
    return (
      <div className="wrap checkout-done">
        <p className="kicker">Pedido {done.code}</p>
        <h1>¡Listo! Tu PC se abrió en WhatsApp.</h1>
        <p className="lead-doc">
          Enviá el mensaje y te armamos la propuesta con precios y disponibilidad del día. Todavía no pagaste nada: primero la definimos juntos.
        </p>
        <div className="row">
          <a className="btn btn-main" href={`https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(done.msg)}`} target="_blank" rel="noopener">
            <WhatsAppIcon /> Abrir WhatsApp de nuevo
          </a>
          <Link className="btn btn-line" href="/tienda">
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="shop-hero pc-hero">
        <div className="wrap">
          <Link className="co-back" href="/tienda">
            ← Tienda
          </Link>
          <p className="kicker">Armá tu PC</p>
          <h1>Tu PC, armada y probada en el taller.</h1>
          <p className="lead">
            Contanos para qué la querés y cuánto querés invertir. Te pasamos la propuesta con precios del día, la armamos, la probamos y te
            la entregamos lista para usar.
          </p>
          <ul className="trust">
            <li>Armado prolijo y cableado ordenado</li>
            <li>Prueba de temperatura y estabilidad</li>
            <li>Garantía de cada componente</li>
          </ul>
        </div>
      </section>

      <form className="wrap checkout pc" onSubmit={send}>
        <div className="co-main">
          <fieldset className="co-block">
            <legend>1. ¿Para qué la vas a usar?</legend>
            <div className="opts opts-uso">
              {usos.map((u) => (
                <label key={u.id} className={`opt${uso === u.id ? " on" : ""}`}>
                  <input type="radio" name="uso" value={u.id} checked={uso === u.id} onChange={() => setUso(u.id)} required />
                  <b>{u.label}</b>
                  <small>{u.bajada}</small>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="co-block">
            <legend>2. ¿Cuánto querés invertir?</legend>
            <div className="pc-hint">
              <p className="fine">Solo la PC. Monitor y periféricos los sumás abajo si los necesitás.</p>
              <MonedaToggle compact />
            </div>
            <div className="opts">
              {presupuestos.map((p) => (
                <label key={p.id} className={`opt${presu === p.id ? " on" : ""}`}>
                  <input type="radio" name="presu" value={p.id} checked={presu === p.id} onChange={() => setPresu(p.id)} required />
                  <b>{presuTexto(p)}</b>
                  {presuAlt(p) && <small>{presuAlt(p)}</small>}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="co-block">
            <legend>3. Preferencias</legend>
            <div className="co-grid">
              <Select label="Procesador" value={plataforma} set={setPlataforma} options={plataformas} />
              <Select label="Placa de video" value={grafica} set={setGrafica} options={graficas} />
              {juega && <Select label="¿Cómo querés jugar?" value={resolucion} set={setResolucion} options={resoluciones} />}
              <Select label="Color del gabinete" value={gabinete} set={setGabinete} options={gabinetes} />
              <label className="field co-full">
                <span>Juegos o programas que vas a usar (opcional)</span>
                <input value={programas} onChange={(e) => setProgramas(e.target.value)} placeholder="Ej. Valorant, Fortnite, Premiere, AutoCAD" />
              </label>
            </div>
          </fieldset>

          <fieldset className="co-block">
            <legend>4. ¿Sumamos algo más?</legend>
            <div className="opts opts-extra">
              {extras.map((x) => (
                <label key={x} className={`opt opt-check${sumar.includes(x) ? " on" : ""}`}>
                  <input type="checkbox" checked={sumar.includes(x)} onChange={() => toggle(x)} />
                  <b>{x}</b>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="co-block">
            <legend>5. Tus datos</legend>
            <div className="co-grid">
              <label className="field co-full">
                <span>Nombre y apellido</span>
                <input value={nombre} onChange={(e) => setNombre(e.target.value)} required autoComplete="name" />
              </label>
              <label className="field">
                <span>WhatsApp</span>
                <input value={tel} onChange={(e) => setTel(e.target.value)} required type="tel" autoComplete="tel" placeholder="11 1234-5678" />
              </label>
              <label className="field">
                <span>Localidad</span>
                <input value={localidad} onChange={(e) => setLocalidad(e.target.value)} required autoComplete="address-level2" placeholder="Ej. San Justo" />
              </label>
              <label className="field co-full">
                <span>Algo más que tengamos que saber (opcional)</span>
                <textarea value={nota} onChange={(e) => setNota(e.target.value)} rows={3} placeholder="Para cuándo la necesitás, piezas que ya tenés, espacio donde va…" />
              </label>
            </div>
          </fieldset>
        </div>

        <aside className="co-summary" aria-label="Tu PC">
          <div className="pc-head">
            <CategoryIcon id="pc" />
            <h2>Tu PC</h2>
          </div>
          {conf ? (
            <>
              <p className="fine">
                Configuración orientativa para <b>{usos.find((u) => u.id === uso)!.label}</b>
                {presuObj && presu !== "p0" ? ` (presupuesto: ${presuTexto(presuObj)})` : ""}. Las piezas exactas las definimos con vos
                según precios y stock del día.
              </p>
              <dl className="specs pc-specs">
                {conf.map((c) => (
                  <div key={c.pieza}>
                    <dt>{c.pieza}</dt>
                    <dd>{c.texto}</dd>
                  </div>
                ))}
              </dl>
              {sumar.length > 0 && <p className="fine">Además: {sumar.join(", ").toLowerCase()}.</p>}
            </>
          ) : (
            <p className="fine">Elegí el uso y el presupuesto y te mostramos qué te conviene.</p>
          )}
          <label className="check">
            <input type="checkbox" checked={acepto} onChange={(e) => setAcepto(e.target.checked)} required />
            <span>
              Leí y acepto los <Link href="/terminos#tienda" target="_blank">términos y condiciones</Link> y la{" "}
              <Link href="/privacidad" target="_blank">política de privacidad</Link>.
            </span>
          </label>
          <button className="btn btn-main btn-block" type="submit">
            <WhatsAppIcon /> Pedir mi PC por WhatsApp
          </button>
          <p className="fine">Sin compromiso: te pasamos la propuesta y recién ahí decidís.</p>
        </aside>
      </form>
    </>
  );
}

function Select({ label, value, set, options }: { label: string; value: string; set: (v: string) => void; options: readonly string[] }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(e) => set(e.target.value)}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
