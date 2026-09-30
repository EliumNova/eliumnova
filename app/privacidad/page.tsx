import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacidad",
  description: "Qué datos usa el sitio de EliumNova y para qué.",
  alternates: { canonical: "/privacidad" },
};

export default function Privacidad() {
  return (
    <>
      <Header />
      <main className="doc">
        <section>
          <div className="wrap narrow">
            <p className="kicker">EliumNova</p>
            <h1>Privacidad</h1>
            <h2>Pedidos</h2>
            <p>
              Cuando enviás un pedido o una solicitud desde el sitio, los datos que cargás (nombre, localidad, productos y forma de entrega)
              se usan solo para gestionar tu compra y se guardan en nuestro registro de pedidos. No los compartimos ni los vendemos.
            </p>
            <h2>Métricas del sitio</h2>
            <p>
              Usamos Google Analytics para saber cuánta gente visita el sitio, desde qué zona aproximada, por qué medio llega y qué
              productos mira. Esa información es anónima y la usamos para mejorar la tienda. Podés bloquearla con la configuración de tu
              navegador.
            </p>
            <h2>Tu carrito</h2>
            <p>El carrito se guarda en tu propio navegador para que no pierdas lo que elegiste. No se envía a ningún lado hasta que mandás el pedido.</p>
            <h2>Tus derechos</h2>
            <p>
              Podés pedir que corrijamos o borremos tus datos escribiéndonos por WhatsApp al {site.whatsapp.display}. La Agencia de Acceso a
              la Información Pública es el órgano de control de la Ley 25.326 de Protección de Datos Personales.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
