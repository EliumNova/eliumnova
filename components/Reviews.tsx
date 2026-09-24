import { site } from "@/lib/site";

export default function Reviews() {
  return (
    <section id="resenas" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="rev-head">
          <div>
            <p className="kicker">Reseñas</p>
            <h2>Lo que dicen nuestros clientes</h2>
          </div>
          <div className="score">
            <b>{site.google.rating}</b>
            <div>
              <span className="stars" aria-hidden>★★★★★</span>
              <small>{site.google.count} opiniones en Google</small>
            </div>
          </div>
        </div>
        <div className="revs">
          {site.reviews.map((r) => (
            <figure className="rev" key={r.name}>
              <blockquote>“{r.text}”</blockquote>
              <figcaption>
                <span>{r.name}</span>
                <span className="stars" aria-label="5 estrellas">★★★★★</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
