import { site, waLink } from "@/lib/site";
import QuoteForm from "./QuoteForm";

export default function Contact() {
  return (
    <section id="contacto" style={{ paddingTop: 0 }}>
      <div className="wrap contact">
        <div>
          <p className="kicker">Contacto</p>
          <h2>EliumNova</h2>
          <dl className="info">
            <div>
              <dt>WhatsApp</dt>
              <dd className="phone">
                <a href={waLink} target="_blank" rel="noopener" aria-label="Escribinos por WhatsApp al 11 6001-8011">
                  {site.whatsapp.display}
                  <span className="phone-go" aria-hidden="true">→</span>
                </a>
              </dd>
            </div>
            <div>
              <dt>Dirección</dt>
              <dd>
                {site.address.street}, {site.address.locality}
                <small>
                  <a href={site.address.mapsUrl} target="_blank" rel="noopener" style={{ color: "var(--green)" }}>
                    Cómo llegar →
                  </a>
                </small>
              </dd>
            </div>
            <div>
              <dt>Horarios</dt>
              <dd>
                <ul className="hours">
                  {site.hours.map((h) => (
                    <li key={h.label} className={h.slots.length ? undefined : "off"}>
                      <span>{h.label}</span>
                      <span>{h.slots[0] ?? "Cerrado"}</span>
                      <span>{h.slots[1] ?? ""}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt>Retiro y envío</dt>
              <dd>
                Cadetería, correo o encomienda<small>Para CABA, GBA y el interior</small>
              </dd>
            </div>
          </dl>
        </div>
          <QuoteForm />
      </div>
    </section>
  );
}
