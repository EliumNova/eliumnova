import Link from "next/link";
import { waLink } from "@/lib/site";
import { WhatsAppIcon } from "../Icons";

const pasos = [
  { t: "Armá tu pedido", d: "Elegí los productos y mandalo por WhatsApp con un toque." },
  { t: "Te confirmamos", d: "Disponibilidad y total, antes de que pagues nada." },
  { t: "Reservás", d: "Equipos con 50% de seña; accesorios al confirmar." },
  { t: "Lo revisamos y es tuyo", d: "Pasa por el taller, se prueba y te lo llevás con garantía." },
];

const faq = [
  {
    q: "¿Los productos son originales?",
    a: "Sí. Los genéricos (cables, fundas, templados) se aclaran como genéricos en la ficha, y los reacondicionados se marcan como reacondicionados. Nada se vende como algo que no es.",
  },
  {
    q: "¿Por qué hay que esperar un plazo?",
    a: "Trabajamos por encargue con proveedores de confianza: así el precio es más bajo. El plazo de cada producto está en su ficha y corre desde que confirmás.",
  },
  {
    q: "¿Qué garantía tienen?",
    a: "6 meses los productos nuevos y 3 meses los reacondicionados, desde la entrega. Si algo falla, lo ves directamente con nosotros en el taller.",
  },
  {
    q: "¿Cómo pago?",
    a: "Transferencia o efectivo. Te pasamos los datos por WhatsApp cuando confirmamos el pedido.",
  },
  {
    q: "¿Hacen envíos?",
    a: "Sí: moto a CABA y GBA, y correo o encomienda al interior. El envío corre por cuenta del cliente; el retiro en Rafael Castillo es sin costo.",
  },
];

export default function StoreInfo() {
  return (
    <>
      <section className="store-band" aria-label="Cómo comprar">
        <div className="wrap">
          <p className="kicker">Cómo comprar</p>
          <h2>Cuatro pasos, todo por WhatsApp.</h2>
          <ol className="pasos">
            {pasos.map((p, i) => (
              <li key={p.t}>
                <span>{i + 1}</span>
                <b>{p.t}</b>
                <p>{p.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="store-band" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="encargo">
            <div>
              <p className="kicker">Lo buscamos por vos</p>
              <h2>¿No está lo que buscás?</h2>
              <p>
                Celulares, Apple, notebooks, consolas o accesorios: decinos qué necesitás y te lo cotizamos con nuestros proveedores, con la
                misma revisión y garantía.
              </p>
            </div>
            <a className="btn btn-main" href={waLink} target="_blank" rel="noopener">
              <WhatsAppIcon /> Pedí una cotización
            </a>
          </div>
        </div>
      </section>

      <section className="store-band" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <p className="kicker">Preguntas frecuentes</p>
          <h2>Antes de comprar</h2>
          <div className="faq">
            {faq.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <p className="fine">
            Más detalle en <Link href="/como-comprar">cómo comprar, envíos y garantía</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
