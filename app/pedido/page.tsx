import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutPage from "@/components/shop/Checkout";

export const metadata: Metadata = {
  title: "Confirmar pedido",
  robots: { index: false, follow: true },
  alternates: { canonical: "/pedido" },
};

export default function Pedido() {
  return (
    <>
      <Header active="tienda" />
      <main className="co-page">
        <CheckoutPage />
      </main>
      <Footer fab={false} />
    </>
  );
}
