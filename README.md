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

## Tienda (/tienda)
Los productos se leen de una **planilla de Google**. La web calcula el precio en pesos sola:
- Toma el **dólar blue del día** (dolarapi.com). Si no responde, usa `dolarFallback` de `lib/shop.ts`.
- Aplica la regla de margen: costo menor a 50 USD → ×2; desde 50 USD → ×1,5.
- Redondea hacia arriba a un precio terminado en 900.
- Si la fila tiene algo en `precio`, se usa ese precio fijo en pesos (sirve para accesorios ajustados al mercado).

### Conectar la planilla
1. En Google Sheets: Archivo → Importar → subí `docs/planilla-productos.csv`.
2. Archivo → Compartir → **Publicar en la web** → elegí la hoja → formato **CSV** → Publicar. Copiá el link.
3. Pegá ese link en `sheetCsvUrl` dentro de `lib/shop.ts` y publicá el sitio.

Desde ahí, cambiar un costo o sacar un producto (`activo` = no) se ve en la tienda en unos minutos, sin tocar código.
Mientras `sheetCsvUrl` esté vacío, la tienda usa `lib/products.ts`.

### Columnas
`id` (único, sin espacios) · `nombre` · `categoria` (celulares, accesorios, audio, mac) · `marca` · `estado` (Nuevo, Sellado, Reacondicionado) · `costo` · `moneda` (USD o ARS) · `precio` (opcional, fijo en pesos) · `consultar` (si) · `detalle` · `compat` · `plazo` · `garantia` · `nota` · `foto` (link a imagen) · `destacado` (si) · `activo` (si/no)

### Pedidos
El carrito arma el mensaje con un código (EN-DDMM-XXXX) y lo abre en WhatsApp. No hay cobro online: se confirma y cobra por WhatsApp.

## Servidor (AWS Amplify Gen 2)

La carpeta `amplify/` define el backend: usuarios (Cognito, grupo `ADMIN`), base de datos
(Product, Order, Coupon, SupplierSource) y funciones:

| Función | Qué hace | Quién la usa |
|---|---|---|
| `getCatalog` | Devuelve el catálogo activo con precios calculados en el servidor (sin costos) | Tienda (público) |
| `validateCoupon` | Valida un código de descuento | Checkout (público) |
| `placeOrder` | Guarda el pedido antes de mandarlo por WhatsApp | Checkout (público) |
| `syncSuppliersNow` / `sync-suppliers` | Lee las planillas de proveedores y actualiza costos (cada 1 h y a demanda) | Panel |

Panel de gestión en `/admin` (solo usuarios del grupo `ADMIN`).
Sin backend desplegado el sitio sigue funcionando con el catálogo local (`lib/products.ts`).

### Activarlo
1. Amplify → la app → *App settings → IAM roles*: el rol de servicio necesita `AmplifyBackendDeployFullAccess`.
2. Conectar la rama y desplegar; `amplify.yml` ya corre `npx ampx pipeline-deploy`.
3. Poner tu email en `ADMIN_EMAILS` (`amplify/auth/post-confirmation/resource.ts`) y crear la cuenta en `/admin`.
4. En el panel: *Productos → Importar CSV* con `docs/planilla-productos.csv`; *Códigos* para cupones; *Proveedores* para las planillas.
