import Image from "next/image";
import { site, waLink } from "@/lib/site";
import { WhatsAppIcon } from "./Icons";

export default function Footer() {
  return (
    <>
      <footer>
        <div className="wrap">
          <a className="logo" href="#inicio">
            <Image src="/img/logo.png" alt="" width={28} height={27} />
            EliumNova
          </a>
          <nav aria-label="Redes">
            {site.socials.map((s) => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener">
                {s.name}
              </a>
            ))}
          </nav>
          <span>© {new Date().getFullYear()} EliumNova</span>
        </div>
      </footer>

      <a className="fab" href={waLink} target="_blank" rel="noopener" aria-label="Escribinos por WhatsApp">
        <WhatsAppIcon size={28} />
      </a>
    </>
  );
}
