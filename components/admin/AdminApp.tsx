"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Authenticator, translations } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { I18n } from "aws-amplify/utils";
import { fetchAuthSession } from "aws-amplify/auth";
import { configureAmplify, hasBackend } from "@/lib/backend";
import Summary from "./Summary";
import Orders from "./Orders";
import Products from "./Products";
import Coupons from "./Coupons";
import Suppliers from "./Suppliers";

I18n.putVocabularies(translations);
I18n.setLanguage("es");
I18n.putVocabulariesForLanguage("es", {
  "Setup TOTP": "Activá la verificación en dos pasos",
  "Scan then enter verification code": "Escaneá el código con Google Authenticator (u otra app) e ingresá el número de 6 dígitos",
  "Copy": "Copiar",
  "Copied!": "¡Copiado!",
  "Confirm TOTP Code": "Código de la app",
  "Code *": "Código *",
  "Enter your code": "Ingresá el código",
});

// Verificación en dos pasos (TOTP) obligatoria: al primer ingreso muestra un QR para la app.
const formFields = { setupTotp: { QR: { totpIssuer: "EliumNova" } } };

const tabs = [
  { id: "resumen", label: "Resumen" },
  { id: "pedidos", label: "Pedidos" },
  { id: "productos", label: "Productos" },
  { id: "codigos", label: "Códigos" },
  { id: "proveedores", label: "Proveedores" },
] as const;
type Tab = (typeof tabs)[number]["id"];

export default function AdminApp() {
  if (!hasBackend) {
    return (
      <main className="admin-shell">
        <div className="admin-card">
          <h1>Panel de EliumNova</h1>
          <p className="muted">El servidor todavía no está activo en esta versión del sitio. Cuando se despliegue el backend en AWS, este panel se habilita solo.</p>
          <Link className="btn btn-line" href="/">Volver al sitio</Link>
        </div>
      </main>
    );
  }
  configureAmplify();
  return (
    <main className="admin-shell">
      <Authenticator formFields={formFields}>{({ signOut, user }) => <Panel email={user?.signInDetails?.loginId ?? ""} signOut={signOut} />}</Authenticator>
    </main>
  );
}

function Panel({ email, signOut }: { email: string; signOut?: () => void }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("resumen");

  useEffect(() => {
    fetchAuthSession({ forceRefresh: true })
      .then((s) => {
        const groups = (s.tokens?.accessToken.payload["cognito:groups"] as string[] | undefined) ?? [];
        setIsAdmin(groups.includes("ADMIN"));
      })
      .catch(() => setIsAdmin(false));
  }, []);

  if (isAdmin === null) return <p className="muted">Cargando…</p>;
  if (!isAdmin)
    return (
      <div className="admin-card">
        <h1>Sin permisos</h1>
        <p className="muted">La cuenta {email} no es administradora. Si es la tuya, agregala al grupo ADMIN.</p>
        <button className="btn btn-line" onClick={signOut}>Salir</button>
      </div>
    );

  return (
    <div className="admin">
      <header className="admin-top">
        <Link href="/" className="logo">EliumNova <span className="muted">· Panel</span></Link>
        <nav className="admin-tabs" role="tablist">
          {tabs.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? "on" : ""} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </nav>
        <button className="btn btn-line btn-sm" onClick={signOut}>Salir</button>
      </header>
      {tab === "resumen" && <Summary />}
      {tab === "pedidos" && <Orders />}
      {tab === "productos" && <Products />}
      {tab === "codigos" && <Coupons />}
      {tab === "proveedores" && <Suppliers />}
    </div>
  );
}
