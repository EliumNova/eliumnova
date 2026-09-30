// Íconos de línea para las categorías de la tienda.
export default function CategoryIcon({ id }: { id: string }) {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      {id === "celulares" && (
        <>
          <rect x="15" y="5" width="18" height="38" rx="4" {...s} />
          <path d="M21 38h6" {...s} />
        </>
      )}
      {id === "mac" && (
        <>
          <rect x="9" y="11" width="30" height="20" rx="2.5" {...s} />
          <path d="M4 37h40M19 37l1-3h8l1 3" {...s} />
        </>
      )}
      {id === "audio" && (
        <>
          <path d="M10 28v-4a14 14 0 0 1 28 0v4" {...s} />
          <rect x="7" y="27" width="8" height="12" rx="3" {...s} />
          <rect x="33" y="27" width="8" height="12" rx="3" {...s} />
        </>
      )}
      {id === "accesorios" && (
        <>
          <rect x="14" y="6" width="14" height="12" rx="2.5" {...s} />
          <path d="M18 18v3M24 18v3M21 21v7a8 8 0 0 0 8 8h3a5 5 0 0 1 5 5v2" {...s} />
        </>
      )}
      {id === "pc" && (
        <>
          <rect x="26" y="6" width="15" height="34" rx="2.5" {...s} />
          <circle cx="33.5" cy="30" r="4" {...s} />
          <path d="M30 12h7M30 17h7" {...s} />
          <rect x="5" y="12" width="17" height="13" rx="2" {...s} />
          <path d="M10 31h7M13.5 25v6" {...s} />
        </>
      )}
      {id === "todo" && (
        <>
          <rect x="7" y="7" width="14" height="14" rx="3" {...s} />
          <rect x="27" y="7" width="14" height="14" rx="3" {...s} />
          <rect x="7" y="27" width="14" height="14" rx="3" {...s} />
          <rect x="27" y="27" width="14" height="14" rx="3" {...s} />
        </>
      )}
    </svg>
  );
}
