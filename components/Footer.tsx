import Image from "next/image";
import Link from "next/link";
import { site, waLink } from "@/lib/site";
import { WhatsAppIcon } from "./Icons";

export default function Footer({ fab = true }: { fab?: boolean }) {
  return (
    <>
      <footer>
        <div className="wrap foot">
          <div className="foot-brand">
            <Link className="logo" href="/">
              <Image src="/img/logo.png" alt="" width={28} height={27} />
              EliumNova
            </Link>
            <p>{site.slogan}</p>
          </div>
          <nav aria-label="Secciones del sitio">
            <Link href="/servicio-tecnico">Servicio técnico</Link>
            <Link href="/tienda">Tienda</Link>
            <Link href="/como-comprar">Cómo comprar</Link>
            <Link href="/como-comprar#garantia">Garantía y devoluciones</Link>
            <Link href="/privacidad">Privacidad</Link>
          </nav>
          <nav aria-label="Redes">
            {site.socials.map((s) => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener">
                {s.name}
              </a>
            ))}
          </nav>
          <Link className="regret" href="/arrepentimiento">
            Botón de arrepentimiento
          </Link>
        </div>
        <div className="wrap foot-legal">
          <span>© {new Date().getFullYear()} EliumNova · {site.address.street}, {site.address.locality} · CUIT {site.cuit}</span>
        </div>
      </footer>

      {fab && (
        <a className="fab" href={waLink} target="_blank" rel="noopener" aria-label="Escribinos por WhatsApp">
          <WhatsAppIcon size={28} />
        </a>
      )}
    </>
  );
}
