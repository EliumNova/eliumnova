import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PcBuilder from "@/components/shop/PcBuilder";

export const metadata: Metadata = {
  title: "Armá tu PC a medida",
  description:
    "PC gamer, para trabajar, estudiar o diseñar, armada y probada en nuestro taller de Rafael Castillo. Elegí el uso y el presupuesto y te pasamos la propuesta por WhatsApp.",
  alternates: { canonical: "/tienda/arma-tu-pc" },
  openGraph: {
    url: "/tienda/arma-tu-pc",
    title: "Armá tu PC · EliumNova",
    description: "Elegí el uso y el presupuesto. Nosotros la armamos, la probamos y te la entregamos lista.",
  },
};

export default function ArmaTuPc() {
  return (
    <>
      <Header active="tienda" />
      <main>
        <PcBuilder />
      </main>
      <Footer fab={false} />
    </>
  );
}
