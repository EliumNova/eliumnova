import { site } from "@/lib/site";

// Google Analytics 4, en el <head> tal como lo indica Google. Se activa solo si site.gaId tiene un ID.
export default function Analytics() {
  if (!site.gaId) return null;
  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${site.gaId}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${site.gaId}',{currency:'ARS'});`,
        }}
      />
    </>
  );
}
