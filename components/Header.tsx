import Image from "next/image";
import Link from "next/link";
import { waLink } from "@/lib/site";
import { WhatsAppIcon } from "./Icons";

type Section = "inicio" | "servicio" | "tienda" | "nosotros" | "otra";

export default function Header({ active = "otra" }: { active?: Section }) {
  return (
    <header className="nav">
      <div className="wrap">
        <Link className="logo" href="/">
          <Image src="/img/logo.png" alt="Logo de EliumNova" width={34} height={33} priority />
          <span className="logo-text">EliumNova</span>
        </Link>
        <nav className="menu" aria-label="Secciones">
          <Link href="/servicio-tecnico" aria-current={active === "servicio" ? "page" : undefined}>
            Servicio técnico
          </Link>
          <Link href="/tienda" aria-current={active === "tienda" ? "page" : undefined}>
            Tienda
          </Link>
          <Link className="menu-extra" href="/sobre-nosotros" aria-current={active === "nosotros" ? "page" : undefined}>
            Nosotros
          </Link>
        </nav>
        <a className="btn btn-main nav-wa" href={waLink} target="_blank" rel="noopener" aria-label="WhatsApp">
          <WhatsAppIcon /> <span>WhatsApp</span>
        </a>
      </div>
    </header>
  );
}
