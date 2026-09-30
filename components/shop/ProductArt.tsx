/* eslint-disable @next/next/no-img-element */
import type { Product } from "@/lib/shop";

// Foto del producto; si todavía no tiene, un dibujo simple según la categoría.
export default function ProductArt({ p, big = false }: { p: Product; big?: boolean }) {
  if (p.foto) {
    return (
      <div className={`art${p.foto.startsWith("http") ? " art-pack" : ""}${big ? " art-big" : ""}`}>
        <img src={p.foto} alt={p.nombre} loading="lazy" referrerPolicy="no-referrer" />
      </div>
    );
  }
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <div className={`art art-empty${big ? " art-big" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 64 64">
        {p.categoria === "celulares" && (
          <>
            <rect x="20" y="6" width="24" height="52" rx="5" {...s} />
            <path d="M28 51h8" {...s} />
          </>
        )}
        {p.categoria === "mac" && (
          <>
            <rect x="12" y="14" width="40" height="27" rx="3" {...s} />
            <path d="M6 49h52" {...s} />
          </>
        )}
        {p.categoria === "audio" && (
          <>
            <path d="M22 14a7 7 0 0 1 7 7v10a7 7 0 0 1-7 7" {...s} />
            <path d="M22 38v14" {...s} />
            <path d="M42 14a7 7 0 0 0-7 7v10a7 7 0 0 0 7 7" {...s} />
            <path d="M42 38v14" {...s} />
          </>
        )}
        {p.categoria === "accesorios" && (
          <>
            <rect x="18" y="8" width="20" height="16" rx="3" {...s} />
            <path d="M24 24v4M32 24v4M28 28v8a10 10 0 0 0 10 10h4a6 6 0 0 1 6 6v4" {...s} />
          </>
        )}
      </svg>
      <span>{p.marca}</span>
    </div>
  );
}
