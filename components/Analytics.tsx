import Script from "next/script";
import { site } from "@/lib/site";

// Google Analytics 4. Se activa solo si site.gaId tiene un ID.
export default function Analytics() {
  if (!site.gaId) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${site.gaId}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${site.gaId}',{currency:'ARS'});`}
      </Script>
    </>
  );
}
