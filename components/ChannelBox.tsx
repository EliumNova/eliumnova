import { site } from "@/lib/site";
import { WhatsAppIcon } from "./Icons";

// Invitación al canal de WhatsApp de ofertas. Se muestra solo si hay link cargado.
export default function ChannelBox({ compact = false }: { compact?: boolean }) {
  if (!site.whatsappChannel) return null;
  if (compact) {
    return (
      <a className="channel-link" href={site.whatsappChannel} target="_blank" rel="noopener">
        <WhatsAppIcon /> Canal de ofertas
      </a>
    );
  }
  return (
    <div className="encargo channel">
      <div>
        <p className="kicker">Novedades y ofertas</p>
        <h2>Enterate primero de los descuentos.</h2>
        <p>Sumate al canal de WhatsApp de EliumNova: ofertas, ingresos nuevos y consejos para cuidar tu equipo. Sin spam y sin que nadie vea tu número.</p>
      </div>
      <a className="btn btn-main" href={site.whatsappChannel} target="_blank" rel="noopener">
        <WhatsAppIcon /> Unirme al canal
      </a>
    </div>
  );
}
