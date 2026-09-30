import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/lib/site";
import Analytics from "@/components/Analytics";
import "./globals.css";

// Fuentes alojadas en el propio sitio (más rápido y sin depender de Google Fonts).
const syne = localFont({ src: "./fonts/syne-latin-wght-normal.woff2", weight: "400 800", variable: "--font-syne", display: "swap" });
const interTight = localFont({ src: "./fonts/inter-tight-latin-wght-normal.woff2", weight: "100 900", variable: "--font-inter-tight", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "EliumNova · Servicio técnico y tienda de tecnología en La Matanza", template: "%s | EliumNova" },
  description: "Reparamos y vendemos tecnología en Rafael Castillo, La Matanza: servicio técnico de celulares, tablets, PCs y consolas, y tienda de celulares, Apple y accesorios.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { "max-image-preview": "large" } },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: site.name,
    url: "/",
    title: "EliumNova · Más que una reparación, una solución",
    description: "Servicio técnico y tienda de tecnología en Rafael Castillo, La Matanza. Pedí por WhatsApp.",
    images: [{ url: "/img/og.jpg", width: 1200, height: 630, alt: "EliumNova, servicio técnico en Rafael Castillo" }],
  },
  twitter: { card: "summary_large_image" },
  other: { "geo.region": "AR-B", "geo.placename": "Rafael Castillo, La Matanza" },
};

export const viewport: Viewport = {
  themeColor: "#050706",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${syne.variable} ${interTight.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
