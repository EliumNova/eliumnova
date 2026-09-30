import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RegretForm from "@/components/RegretForm";

export const metadata: Metadata = {
  title: "Botón de arrepentimiento",
  description: "Pedí la cancelación de tu compra en EliumNova dentro de los 10 días corridos desde que la recibiste.",
  alternates: { canonical: "/arrepentimiento" },
};

export default function Arrepentimiento() {
  return (
    <>
      <Header />
      <main className="doc">
        <section>
          <div className="wrap narrow">
            <p className="kicker">Tienda</p>
            <h1>Botón de arrepentimiento</h1>
            <p className="lead-doc">
              Si compraste en la tienda, tenés 10 días corridos desde que recibiste el producto (o desde la compra, lo que pase último) para
              cancelarla, sin explicar por qué y sin costo. No hace falta registrarse.
            </p>
            <RegretForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
