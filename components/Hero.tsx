import Image from "next/image";
import { site, waLink } from "@/lib/site";
import { WhatsAppIcon } from "./Icons";

export default function Hero() {
  return (
    <section className="hero">
      <Image className="mark" src="/img/logo.png" alt="" aria-hidden width={560} height={541} />
      <div className="wrap">
        <div>
          <h1 className="kicker">Servicio técnico</h1>
          <p className="slogan">
            Más que una reparación, <span>una solución.</span>
          </p>
          <p className="lead">
            Trabajamos en tu equipo y por supuesto en tu confianza.
          </p>
          <div className="cta">
            <a className="btn btn-main" href={waLink} target="_blank" rel="noopener">
              <WhatsAppIcon /> Pedí tu presupuesto
            </a>
            <a className="btn btn-line" href="#servicios">
              Ver servicios
            </a>
          </div>
          <a className="rating" href={site.google.url} target="_blank" rel="noopener">
            <span className="stars" aria-hidden>★★★★★</span>
            <b>{site.google.rating}</b> en Google · {site.google.count} opiniones
          </a>
        </div>
        <div className="hero-photo">
          <Image
            src="/img/img_5991.jpg"
            alt="Celular Motorola reparado en EliumNova, servicio técnico en Rafael Castillo"
            width={1050}
            height={1400}
            priority
            sizes="(max-width: 860px) 100vw, 380px"
          />
        </div>
      </div>
    </section>
  );
}
