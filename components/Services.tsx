import Image from "next/image";
import { site } from "@/lib/site";
import { ServiceIcon } from "./Icons";

export default function Services() {
  return (
    <>
      <section id="servicios">
        <div className="wrap">
          <p className="kicker">Servicios</p>
          <h2>Servicio Técnico Integral</h2>
          <div className="grid4">
            {site.services.map((s) => (
              <article className="svc" key={s.title}>
                <ServiceIcon name={s.icon} />
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="gal">
            <Image
              src="/img/img_3364.jpg"
              alt="Dos iPhone reparados en el servicio técnico EliumNova, La Matanza"
              width={1050}
              height={1400}
              sizes="(max-width: 760px) 50vw, 352px"
            />
            <Image
              src="/img/img_6115.jpg"
              alt="Módulo de pantalla nuevo para cambio de pantalla de celular"
              width={1050}
              height={1400}
              sizes="(max-width: 760px) 50vw, 352px"
            />
          </div>
        </div>
      </section>
    </>
  );
}
