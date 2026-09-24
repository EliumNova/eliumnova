import Image from "next/image";
import { waLink } from "@/lib/site";

export default function Header() {
  return (
    <header className="nav">
      <div className="wrap">
        <a className="logo" href="#inicio">
          <Image src="/img/logo.png" alt="Logo de EliumNova" width={34} height={33} priority />
          EliumNova
        </a>
        <a className="btn btn-main" href={waLink} target="_blank" rel="noopener">
          WhatsApp
        </a>
      </div>
    </header>
  );
}
