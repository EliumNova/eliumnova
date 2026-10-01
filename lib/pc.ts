// "Armá tu PC": opciones del armador y configuraciones orientativas.
// No son precios ni stock: sirven para que el cliente entienda qué le conviene
// y para que el pedido llegue por WhatsApp con todo lo necesario para presupuestar.

export type Uso = "gaming" | "stream" | "trabajo" | "diseno" | "programacion";

export const usos: { id: Uso; label: string; bajada: string }[] = [
  { id: "gaming", label: "Gaming", bajada: "Jugar fluido, competitivo o en calidad alta" },
  { id: "stream", label: "Streaming y edición", bajada: "Jugar y transmitir, editar video" },
  { id: "trabajo", label: "Oficina y estudio", bajada: "Navegar, Office, clases, Zoom" },
  { id: "diseno", label: "Diseño y 3D", bajada: "Photoshop, AutoCAD, Blender, render" },
  { id: "programacion", label: "Programación", bajada: "Código, máquinas virtuales, varias pantallas" },
];

// Rangos de presupuesto en dólares (solo la PC, sin monitor ni periféricos).
export const presupuestos = [
  { id: "p1", desde: 0, hasta: 500, label: "Hasta US$ 500" },
  { id: "p2", desde: 500, hasta: 800, label: "US$ 500 a 800" },
  { id: "p3", desde: 800, hasta: 1200, label: "US$ 800 a 1.200" },
  { id: "p4", desde: 1200, hasta: 1800, label: "US$ 1.200 a 1.800" },
  { id: "p5", desde: 1800, hasta: 0, label: "Más de US$ 1.800" },
  { id: "p0", desde: 0, hasta: 0, label: "No sé, recomendame" },
] as const;
export type PresupuestoId = (typeof presupuestos)[number]["id"];

export const plataformas = ["AMD (Ryzen)", "Intel (Core)", "Me da igual"] as const;
export const graficas = ["NVIDIA (GeForce)", "AMD (Radeon)", "Intel (Arc)", "Sin placa de video", "Me da igual"] as const;
export const resoluciones = ["1080p a 60 FPS", "1080p competitivo (144 FPS o más)", "1440p", "4K"] as const;
export const gabinetes = ["Negro", "Blanco", "Me da igual"] as const;

export const extras = [
  "Monitor",
  "Teclado y mouse",
  "Auriculares",
  "Wi-Fi y Bluetooth",
  "Windows instalado",
  "Luces RGB",
  "Que sea silenciosa",
  "Tengo piezas para reutilizar",
] as const;

const nivel = (p: PresupuestoId) => ({ p0: 2, p1: 0, p2: 1, p3: 2, p4: 3, p5: 4 })[p];

/** Configuración orientativa según uso y presupuesto. */
export function sugerencia(uso: Uso, p: PresupuestoId): { pieza: string; texto: string }[] {
  const n = nivel(p);
  const sinGrafica = uso === "trabajo" || (uso === "programacion" && n < 2);
  const cpu = [
    "6 núcleos con gráficos integrados (tipo Ryzen 5 con gráficos Radeon)",
    "6 núcleos actual (tipo Ryzen 5 / Core i5)",
    "6 a 8 núcleos actual (tipo Ryzen 5 / Core i5 de última generación)",
    "8 núcleos (tipo Ryzen 7 / Core i7)",
    "8 a 16 núcleos (tipo Ryzen 7 X3D / Ryzen 9 / Core i9)",
  ][n];
  const gpu = sinGrafica
    ? "Gráficos integrados (alcanzan para este uso)"
    : [
        "Gráficos integrados, con lugar para sumar placa más adelante",
        "Placa de video de entrada, para 1080p en calidad media",
        "Placa de video gama media, para 1080p alto y algo de 1440p",
        "Placa de video gama media-alta, para 1440p alto",
        "Placa de video gama alta, para 1440p competitivo y 4K",
      ][n];
  const ram = ["16 GB", "16 GB", "32 GB", "32 GB", uso === "diseno" || uso === "stream" ? "64 GB" : "32 GB"][n];
  const disco = ["SSD NVMe de 500 GB", "SSD NVMe de 1 TB", "SSD NVMe de 1 TB", "SSD NVMe de 2 TB", "SSD NVMe de 2 TB o más"][n];
  const fuente = ["500 W certificada", "550 W 80 Plus", "650 W 80 Plus Bronze", "750 W 80 Plus Gold", "850 W 80 Plus Gold o más"][sinGrafica ? Math.min(n, 1) : n];
  return [
    { pieza: "Procesador", texto: cpu },
    { pieza: "Placa de video", texto: gpu },
    { pieza: "Memoria", texto: `${ram} DDR4 o DDR5 en dual channel` },
    { pieza: "Almacenamiento", texto: disco },
    { pieza: "Fuente", texto: fuente },
    { pieza: "Gabinete", texto: "Con buena ventilación y espacio para crecer" },
  ];
}
