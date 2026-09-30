import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <>
      <Header active="inicio" />
      <main id="inicio">
        <section className="hub-hero">
          <Image className="mark" src="/img/logo.png" alt="" aria-hidden width={560} height={541} />
          <div className="wrap">
            <h1 className="kicker">EliumNova · Tecnología en La Matanza</h1>
            <p className="slogan">
              Más que una reparación, <span>una solución.</span>
            </p>
            <p className="lead">
              Reparamos y vendemos tecnología con la misma regla: que funcione, que te dure y que sepas qué te llevás.
            </p>
            <a className="rating" href={site.google.url} target="_blank" rel="noopener">
              <span className="stars" aria-hidden>★★★★★</span>
              <b>{site.google.rating}</b> en Google · {site.google.count} opiniones
            </a>
          </div>
        </section>

        <section className="doors" aria-label="Qué hacemos">
          <div className="wrap doors-grid">
            <Link className="door" href="/servicio-tecnico">
              <Image
                src="/img/img_5991.jpg"
                alt="Celular reparado en el taller de EliumNova"
                width={1050}
                height={1400}
                sizes="(max-width: 760px) 100vw, 540px"
                priority
              />
              <div className="door-text">
                <p className="kicker">Servicio técnico</p>
                <h2>Tu equipo, de vuelta como tiene que andar.</h2>
                <p>Celulares, tablets, PCs y consolas. Pantallas, baterías, pin de carga y mantenimiento.</p>
                <span className="btn btn-main">Pedí tu presupuesto →</span>
              </div>
            </Link>
            <Link className="door" href="/tienda">
              <Image
                src="/img/img_3364.jpg"
                alt="iPhones revisados en el taller de EliumNova"
                width={1050}
                height={1400}
                sizes="(max-width: 760px) 100vw, 540px"
                priority
              />
              <div className="door-text">
                <p className="kicker">Tienda</p>
                <h2>Tecnología revisada antes de llegar a tus manos.</h2>
                <p>Celulares Samsung, Motorola y iPhone, AirPods, Mac y accesorios, con garantía.</p>
                <span className="btn btn-main">Ver la tienda →</span>
              </div>
            </Link>
          </div>
        </section>

        <Reviews />
        <Contact quote={false} />
      </main>
      <Footer />
      <JsonLd />
    </>
  );
}
