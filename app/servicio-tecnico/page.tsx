import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Servicio técnico en Rafael Castillo",
  description:
    "Reparación de celulares, tablets, PCs y consolas en Rafael Castillo, La Matanza. Pantallas, baterías, pin de carga. Pedí tu presupuesto por WhatsApp.",
  alternates: { canonical: "/servicio-tecnico" },
  openGraph: {
    url: "/servicio-tecnico",
    title: "EliumNova · Servicio técnico en Rafael Castillo",
    description: "Más que una reparación, una solución. Celulares, tablets, PCs y consolas. Pedí tu presupuesto por WhatsApp.",
  },
};

export default function ServicioTecnico() {
  return (
    <>
      <Header active="servicio" />
      <main id="inicio">
        <Hero />
        <Services />
        <Reviews />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <JsonLd />
    </>
  );
}
