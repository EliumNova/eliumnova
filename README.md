# EliumNova · Sitio web

Sitio de EliumNova hecho con **Next.js 16** (App Router + TypeScript). Se exporta como sitio estático, así que es rápido y se puede subir a Netlify gratis.

## Editar datos del negocio
Casi todo está en **`lib/site.ts`**: WhatsApp, dirección, horarios, reseñas, preguntas frecuentes, redes y el dominio del sitio.
Si cambiás algo ahí, se actualiza la página **y** el SEO (datos para Google, sitemap, etc.).

> Cuando tengas dominio propio, cambiá `url` en `lib/site.ts` (ej: `https://eliumnova.com.ar`).

## Estructura
```
app/
  layout.tsx      → SEO (título, descripción, imagen para compartir), fuentes
  page.tsx        → arma la página con los componentes
  globals.css     → todos los estilos
  sitemap.ts, robots.ts, manifest.ts → archivos para Google y celulares
  fonts/          → Syne e Inter Tight (licencia OFL, alojadas en el sitio)
  icon.png, apple-icon.png, favicon.ico
components/       → Header, Hero, Services, Reviews, Faq, Contact, Footer, JsonLd, Icons
lib/site.ts       → datos del negocio
public/img/       → logo, fotos e imagen para compartir (og.jpg)
netlify.toml      → configuración para Netlify
```

## Usarlo en tu compu
Necesitás Node.js 20 o más nuevo.
```bash
npm install
npm run dev      # abre http://localhost:3000
npm run build    # genera el sitio final en la carpeta /out
```

## Publicar en Netlify
**Opción A (recomendada, con GitHub):** subí esta carpeta a un repositorio de GitHub → en Netlify, *Add new site → Import from Git* → elegí el repo. Netlify lee `netlify.toml` y compila solo. Cada cambio que subas se publica automáticamente.

**Opción B (manual):** corré `npm run build` y arrastrá la carpeta **`out`** a *Deploys* en Netlify.

## Después de publicar
1. Google Search Console → agregar el sitio → enviar `sitemap.xml`.
2. En tu Perfil de Empresa de Google, cargar el link en "Sitio web".
