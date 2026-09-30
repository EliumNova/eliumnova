import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site, waLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Sobre nosotros",
  description: "Cómo nació EliumNova, qué nos importa y qué no vamos a hacer nunca. Servicio técnico y tienda de tecnología en Rafael Castillo.",
  alternates: { canonical: "/sobre-nosotros" },
};

const valores = [
  { t: "Calidad", d: "Repuestos y productos que usaríamos nosotros. Si algo es genérico o reacondicionado, lo decimos antes de que pagues." },
  { t: "Generosidad", d: "Un consejo, una limpieza de pin de carga, un chiste mientras esperás. Lo que te llevás no es solo el equipo." },
  { t: "Honestidad", d: "Si una reparación no te conviene, te lo decimos aunque eso signifique no cobrarte nada." },
];

const nunca = [
  "Venderte humo o prometerte algo que no podemos cumplir.",
  "Reparar algo que no conviene solo para cobrar.",
  "Darte una garantía que nosotros mismos no aceptaríamos.",
  "Mostrar o exponer a nuestros clientes en redes.",
];

export default function SobreNosotros() {
  return (
    <>
      <Header active="nosotros" />
      <main className="doc">
        <section>
          <div className="wrap narrow">
            <p className="kicker">Sobre nosotros</p>
            <h1>{site.slogan}</h1>
            <p className="lead-doc">
              EliumNova arrancó a mediados de 2025 en Rafael Castillo, de boca en boca y agarrando todo tipo de trabajos. Empezó como una
              necesidad; con cada equipo que volvía a funcionar, la necesidad se volvió ambición: dejar de dar solo un servicio y empezar a
              dar una solución.
            </p>
            <p>
              Hoy reparamos celulares, tablets, PCs, notebooks y consolas de todas las marcas, Apple incluido, y sumamos una tienda con
              celulares, Apple y accesorios. Todo pasa por el mismo taller: lo que vendemos se revisa con el mismo criterio con el que
              reparamos.
            </p>

            <h2>Lo que nos importa</h2>
            <div className="about-grid">
              {valores.map((v) => (
                <div key={v.t} className="svc">
                  <h3>{v.t}</h3>
                  <p>{v.d}</p>
                </div>
              ))}
            </div>

            <h2>Lo que no vamos a hacer nunca</h2>
            <ul>
              {nunca.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>

            <h2>Dónde estamos</h2>
            <p>
              {site.address.street}, {site.address.locality}, La Matanza. Atendemos de lunes a viernes de 8 a 12 y de 13 a 18, y los
              sábados de 8 a 12 y de 13 a 15. Hacemos retiros y envíos a CABA, GBA y el interior.
            </p>

            <div className="cta-box">
              <h3>¿Tenés un equipo que no anda o buscás uno nuevo?</h3>
              <div className="row">
                <a className="btn btn-main" href={waLink} target="_blank" rel="noopener">
                  <WhatsAppIcon /> Escribinos
                </a>
                <Link className="btn btn-line" href="/tienda">
                  Ver la tienda
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
