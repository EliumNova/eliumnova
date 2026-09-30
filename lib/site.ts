// Todos los datos del negocio en un solo lugar.
// Cambiá acá el dominio, teléfono, horarios o reseñas y se actualiza todo el sitio (incluido el SEO).

export const site = {
  url: "https://eliumnova.com.ar", // cambiar cuando tengas dominio propio (ej: https://eliumnova.com.ar)
  name: "EliumNova",

  // Métricas: ID de medición de Google Analytics 4 (empieza con G-). Vacío = sin métricas.
  gaId: "G-YLLKVSY7ZF",

  // Datos fiscales que se muestran en el pie (exigidos para vender online).
  cuit: "20-44413922-7",
  slogan: "Más que una reparación, una solución.",
  title: "Servicio técnico | EliumNova",
  description:
    "Trabajamos en tu equipo y por supuesto en tu confianza.",

  whatsapp: {
    number: "5491160018011",
    display: "+54 9 11 6001-8011",
    message: "Hola Eze! Tengo una consulta.",
  },

  address: {
    street: "Santa Rosa 2706",
    locality: "Rafael Castillo",
    region: "Provincia de Buenos Aires",
    postalCode: "B1755",
    country: "AR",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Santa+Rosa+2706,+Rafael+Castillo,+Buenos+Aires",
  },

  areaServed: [
    "Rafael Castillo",
    "La Matanza",
    "Gregorio de Laferrere",
    "San Justo",
    "Isidro Casanova",
    "Ramos Mejía",
    "Ciudad Autónoma de Buenos Aires",
    "Gran Buenos Aires",
  ],

  hours: [
    { label: "Lunes a viernes", slots: ["08:00 – 12:00", "13:00 – 18:00"] },
    { label: "Sábados", slots: ["08:00 – 12:00", "13:00 – 15:00"] },
    { label: "Domingos", slots: [] as string[] },
  ],

  // Formato para Google (schema.org)
  hoursSchema: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "12:00" },
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "13:00", closes: "18:00" },
    { days: ["Saturday"], opens: "08:00", closes: "12:00" },
    { days: ["Saturday"], opens: "13:00", closes: "15:00" },
  ],

  google: {
    url: "https://share.google/kDNc56x9J5RnGyBjV",
    rating: "5.0",
    count: 7,
  },

  socials: [
    { name: "Instagram", url: "https://www.instagram.com/eliumnova.ar" },
    { name: "TikTok", url: "https://www.tiktok.com/@eliumnova.ar" },
    { name: "YouTube", url: "https://www.youtube.com/@EliumNova" },
  ],

  services: [
    { icon: "phone", title: "Celulares", text: "Cambio de pantalla y módulo, batería, pin de carga, cámara y más. Android e iPhone." },
    { icon: "laptop", title: "PC y notebooks", text: "Reparación y mantenimiento: limpieza, pasta térmica, discos, memoria y teclados." },
    { icon: "tablet", title: "Tablets", text: "Pantalla, touch, batería y conector de carga." },
    { icon: "console", title: "Consolas", text: "Mantenimiento, limpieza interna y pasta térmica." },
  ] as const,

  serviceNames: [
    "Cambio de pantalla de celular",
    "Cambio de batería de celular",
    "Reparación de pin de carga",
    "Reparación de iPhone",
    "Reparación de tablets",
    "Mantenimiento de notebooks y PC",
    "Mantenimiento de consolas",
  ],

  // Reseñas reales de Google, textuales.
  reviews: [
    { name: "Evelyn F.", text: "Excelente atención, predisposición y calidad en cada trabajo. 👏🏼 RECOMIENDO 100%" },
    { name: "Juan Facundo J.", text: "Excelente atención. Muy buen trabajo super recomendable" },
    { name: "Soledad B.", text: "Muy buena atención y bien servicio 💪 recomendado" },
  ],

  faq: [
    {
      q: "¿Dónde queda el servicio técnico?",
      a: "En Santa Rosa 2706, Rafael Castillo, partido de La Matanza. Estamos cerca de Gregorio de Laferrere, San Justo, Isidro Casanova y Ramos Mejía.",
    },
    {
      q: "¿Cuánto sale cambiar la pantalla del celular?",
      a: "Depende de la marca, el modelo y la calidad del repuesto que elijas. Mandanos marca y modelo por WhatsApp y te pasamos el presupuesto sin compromiso.",
    },
    {
      q: "¿Cuánto tarda la reparación?",
      a: "La mayoría de los cambios de pantalla, batería y pin de carga se hacen en el día si tenemos el repuesto. Te confirmamos el plazo con el presupuesto.",
    },
    {
      q: "¿Las reparaciones tienen garantía?",
      a: "Sí. Todas las reparaciones tienen garantía, que depende del repuesto usado. Te la detallamos junto con el presupuesto.",
    },
    {
      q: "¿Hacen retiro y envío?",
      a: "Sí. Coordinamos retiro y entrega por cadetería en CABA y GBA, y envíos por correo o encomienda al resto del país.",
    },
    {
      q: "¿Reparan iPhone?",
      a: "Sí. Reparamos iPhone y todas las marcas de Android: Samsung, Motorola, Xiaomi y más.",
    },
  ],
};

export const waLink = `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(site.whatsapp.message)}`;
