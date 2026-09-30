import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cómo comprar, envíos y garantía",
  description: "Cómo comprar en la tienda EliumNova: pedido por WhatsApp, formas de pago, retiro y envío, garantía y devoluciones.",
  alternates: { canonical: "/como-comprar" },
};

export default function ComoComprar() {
  return (
    <>
      <Header />
      <main className="doc">
        <section>
          <div className="wrap narrow">
            <p className="kicker">Tienda</p>
            <h1>Cómo comprar</h1>

            <ol className="steps">
              <li>
                <b>Armá tu pedido en la <Link href="/tienda">tienda</Link>.</b> Elegí los productos y tocá «Enviar pedido por WhatsApp». Se
                abre el chat con todo el detalle y un código de pedido.
              </li>
              <li>
                <b>Te confirmamos disponibilidad y total.</b> Revisamos con el proveedor y te respondemos por WhatsApp en horario de
                atención. Todavía no pagás nada.
              </li>
              <li>
                <b>Reservás.</b> Los equipos (celulares y Mac) se reservan con 50% de seña y el resto se paga al retirar. Los accesorios se
                pagan completos al confirmar.
              </li>
              <li>
                <b>Lo revisamos y te lo entregamos.</b> Todo producto pasa por el taller antes de entregarse: se prueba, se revisa y se
                entrega con su garantía.
              </li>
            </ol>

            <h2 id="pagos">Pagos</h2>
            <p>Efectivo (pesos o dólares al valor del dólar blue del día), transferencia en pesos o USDT. Te pasamos los datos de pago por WhatsApp junto con la confirmación del pedido. Por ahora no trabajamos con tarjetas.</p>

            <h2 id="entrega">Retiro y envío</h2>
            <ul>
              <li>
                <b>Retiro en el taller, sin costo:</b> {site.address.street}, {site.address.locality}. Lunes a viernes de 8 a 12 y de 13 a 18;
                sábados de 8 a 12 y de 13 a 15.
              </li>
              <li>
                <b>Envío en moto a CABA y GBA:</b> por aplicación, a cargo del cliente.
              </li>
              <li>
                <b>Correo o encomienda al interior:</b> a cargo del cliente, según peso y destino.
              </li>
            </ul>
            <p>El plazo de cada producto figura en su ficha y corre desde que confirmás el pedido.</p>

            <h2 id="precios">Precios</h2>
            <p>
              Los precios están en pesos y se actualizan todos los días según el valor del dólar. El precio que vale es el que te
              confirmamos por WhatsApp al tomar tu pedido.
            </p>

            <h2 id="garantia">Garantía y devoluciones</h2>
            <ul>
              <li>Productos nuevos: 6 meses de garantía desde la entrega.</li>
              <li>Productos reacondicionados: 3 meses de garantía desde la entrega, y se aclaran como tales en su ficha.</li>
              <li>La garantía cubre fallas de funcionamiento. No cubre golpes, humedad ni daños por mal uso.</li>
              <li>Para usarla, escribinos por WhatsApp con tu código de pedido y traé el producto al taller.</li>
            </ul>

            <h2 id="arrepentimiento">Botón de arrepentimiento</h2>
            <p>
              Tenés 10 días corridos desde que recibís el producto para arrepentirte de la compra, sin dar explicaciones y sin costo. Podés
              pedirlo desde el <Link href="/arrepentimiento">botón de arrepentimiento</Link>. El producto tiene que volver completo, con su
              caja y accesorios.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
