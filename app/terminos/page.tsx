import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

// Texto base redactado en lenguaje simple. Conviene que lo revise un abogado antes de darlo por definitivo.

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Términos y condiciones del servicio técnico y de la tienda de EliumNova.",
  alternates: { canonical: "/terminos" },
};

const hoy = "30 de septiembre de 2026";

export default function Terminos() {
  return (
    <>
      <Header />
      <main className="doc">
        <section>
          <div className="wrap narrow">
            <p className="kicker">EliumNova</p>
            <h1>Términos y condiciones</h1>
            <p className="lead-doc">
              Estas condiciones explican cómo trabajamos en el servicio técnico y en la tienda. Al pedir un presupuesto, dejar un equipo o
              confirmar un pedido, las aceptás. Última actualización: {hoy}.
            </p>
            <nav className="toc" aria-label="Secciones">
              <a href="#general">Datos generales</a>
              <a href="#servicio">Servicio técnico</a>
              <a href="#tienda">Tienda</a>
            </nav>

            <h2 id="general">1. Datos generales</h2>
            <ul>
              <li>
                <b>Quiénes somos:</b> EliumNova, CUIT {site.cuit}, con domicilio en {site.address.street}, {site.address.locality},
                provincia de Buenos Aires.
              </li>
              <li>
                <b>Contacto:</b> WhatsApp {site.whatsapp.display}. Es el canal oficial para presupuestos, pedidos, reclamos y garantías.
              </li>
              <li>
                <b>Horario:</b> lunes a viernes de 8 a 12 y de 13 a 18; sábados de 8 a 12 y de 13 a 15.
              </li>
              <li>
                <b>Normas que aplican:</b> la Ley 24.240 de Defensa del Consumidor y el Código Civil y Comercial. Nada de lo que dice esta
                página limita los derechos que te dan esas leyes.
              </li>
            </ul>

            <h2 id="servicio">2. Servicio técnico</h2>
            <h3>Presupuesto</h3>
            <ul>
              <li>Antes de reparar te pasamos un presupuesto por escrito (por WhatsApp) con el trabajo, el repuesto, el precio, el plazo y la garantía.</li>
              <li>No hacemos ningún trabajo sin que lo aceptes. Si durante la reparación aparece otra falla, te avisamos y esperamos tu OK antes de seguir.</li>
              <li>El presupuesto vale 7 días corridos, porque el precio de los repuestos cambia seguido.</li>
              <li>Si una reparación no te conviene (por ejemplo, porque sale casi lo mismo que un equipo nuevo), te lo decimos.</li>
            </ul>
            <h3>Diagnóstico y reparación</h3>
            <ul>
              <li>Algunas fallas necesitan abrir el equipo para diagnosticarlas. Si es así, te lo avisamos antes.</li>
              <li>Los trabajos de microsoldadura pueden realizarse con técnicos especializados de confianza; en ese caso te lo informamos en el presupuesto y la garantía la seguimos dando nosotros.</li>
              <li>Si lo pedís, te devolvemos la pieza reemplazada.</li>
            </ul>
            <h3>Tus datos y tu equipo</h3>
            <ul>
              <li>Te recomendamos hacer una copia de seguridad antes de dejar el equipo. Cuidamos tu información, pero algunas reparaciones pueden requerir restaurar el sistema.</li>
              <li>No revisamos, copiamos ni compartimos el contenido de tu equipo. Si hace falta el código de desbloqueo para probarlo, te lo pedimos.</li>
              <li>Los equipos con humedad, golpes fuertes o reparaciones anteriores de terceros pueden presentar fallas nuevas durante o después del trabajo; si lo detectamos, te lo avisamos en el diagnóstico.</li>
            </ul>
            <h3>Garantía de la reparación</h3>
            <ul>
              <li>Toda reparación tiene garantía sobre el trabajo realizado y el repuesto colocado. El plazo depende del repuesto elegido y figura en el presupuesto; nunca es menor a 30 días desde la entrega.</li>
              <li>La garantía no cubre golpes, humedad, pantallas rotas después de la entrega, ni equipos abiertos o reparados por otra persona después de nuestro trabajo.</li>
              <li>Para usarla, escribinos por WhatsApp y traé el equipo al taller.</li>
            </ul>
            <h3>Retiro del equipo</h3>
            <ul>
              <li>Te avisamos por WhatsApp cuando el equipo está listo. El pago se hace al retirarlo.</li>
              <li>Si pasan 60 días desde el aviso sin que lo retires ni te comuniques, te enviamos un aviso final por WhatsApp para coordinar la entrega.</li>
              <li>Para retiros y envíos por cadetería, correo o encomienda, el costo del traslado corre por cuenta del cliente, salvo que el trabajo esté en garantía.</li>
            </ul>

            <h2 id="tienda">3. Tienda</h2>
            <h3>Productos y precios</h3>
            <ul>
              <li>Los precios están en pesos argentinos y se actualizan todos los días según el valor del dólar. Valen el día en que se publican.</li>
              <li>Los productos reacondicionados y los genéricos se aclaran como tales en su ficha. Las fotos pueden ser ilustrativas: el color y el detalle exacto se confirman por WhatsApp.</li>
              <li>Trabajamos por encargue: cada ficha indica el plazo en que el producto está disponible desde que confirmás.</li>
            </ul>
            <h3>Pedido y pago</h3>
            <ul>
              <li>El pedido se envía por WhatsApp desde la web. Te confirmamos disponibilidad, total final y datos de pago antes de cobrarte.</li>
              <li>Formas de pago: efectivo (pesos o dólares al valor del día), transferencia en pesos o USDT. Por ahora no aceptamos tarjetas.</li>
              <li>Los equipos (celulares y Mac) se reservan con una seña del 50% y el resto se paga al retirar o recibir. Los accesorios se pagan completos al confirmar.</li>
              <li>Si después de confirmar el pedido el proveedor no tiene el producto, te ofrecemos una alternativa o te devolvemos todo lo que hayas pagado.</li>
              <li>Emitimos factura por cada venta.</li>
            </ul>
            <h3>Entrega</h3>
            <ul>
              <li>Retiro sin costo en el taller, o envío en moto a CABA y GBA y por correo o encomienda al interior, a cargo del cliente.</li>
              <li>Todo producto se revisa en el taller antes de entregarse.</li>
            </ul>
            <h3>Garantía</h3>
            <ul>
              <li>Productos nuevos: 6 meses desde la entrega. Productos usados o reacondicionados: 3 meses desde la entrega.</li>
              <li>La garantía cubre fallas de funcionamiento. No cubre golpes, humedad ni mal uso.</li>
              <li>Para usarla, escribinos por WhatsApp con tu código de pedido y traé el producto al taller.</li>
            </ul>
            <h3>Arrepentimiento y devoluciones</h3>
            <ul>
              <li>
                Tenés 10 días corridos desde que recibís el producto (o desde la compra, lo último que pase) para arrepentirte, sin dar
                explicaciones y sin costo. Podés pedirlo desde el <Link href="/arrepentimiento">botón de arrepentimiento</Link>.
              </li>
              <li>El producto tiene que volver completo, con su caja y accesorios. Te devolvemos lo que pagaste, incluida la seña, por el mismo medio.</li>
            </ul>

            <h2>4. Privacidad</h2>
            <p>
              Cómo usamos tus datos está explicado en la <Link href="/privacidad">política de privacidad</Link>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
