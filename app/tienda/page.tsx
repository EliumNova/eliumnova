import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Shop from "@/components/shop/Shop";

export const metadata: Metadata = {
  title: "Tienda: celulares, Apple y accesorios",
  description:
    "Celulares Samsung, Motorola y iPhone, AirPods, Mac y accesorios, revisados en el taller antes de entregarlos. Retiro en Rafael Castillo o envío. Pedí por WhatsApp.",
  alternates: { canonical: "/tienda" },
  openGraph: {
    url: "/tienda",
    title: "Tienda EliumNova",
    description: "Tecnología que pasa por el taller antes de llegar a tus manos. Pedí por WhatsApp.",
  },
};

export default function Tienda() {
  return (
    <>
      <Header active="tienda" />
      <main>
        <Shop />
      </main>
      <Footer fab={false} />
    </>
  );
}
