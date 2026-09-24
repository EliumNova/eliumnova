export function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.4 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.8-1.1-4.6-4-4.8-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.2.5.1.6-.1l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.2.1.8-.1 1.4Z"
      />
    </svg>
  );
}

export function ServiceIcon({ name }: { name: "phone" | "laptop" | "tablet" | "console" }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 2.4 } as const;
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      {name === "phone" && (
        <>
          <rect x="11" y="3" width="18" height="34" rx="4" {...common} />
          <path d="M17 32h6" {...common} strokeLinecap="round" />
        </>
      )}
      {name === "laptop" && (
        <>
          <rect x="7" y="8" width="26" height="18" rx="2.5" {...common} />
          <path d="M3 31h34" {...common} strokeLinecap="round" />
        </>
      )}
      {name === "tablet" && (
        <>
          <rect x="6" y="5" width="28" height="30" rx="4" {...common} />
          <circle cx="20" cy="30" r="1.6" fill="currentColor" />
        </>
      )}
      {name === "console" && (
        <>
          <path d="M9 14h22a5 5 0 0 1 5 5l-1 7a4 4 0 0 1-7 1.8L26 26H14l-2 1.8A4 4 0 0 1 5 26l-1-7a5 5 0 0 1 5-5Z" {...common} strokeLinejoin="round" />
          <path d="M12 18v5M9.5 20.5h5" {...common} strokeWidth={2.2} strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
