import { site } from "@/lib/site";

export default function Faq() {
  return (
    <section id="preguntas" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <p className="kicker">Preguntas frecuentes</p>
        <h2>Lo que más nos preguntan</h2>
        <div className="faq">
          {site.faq.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
