"use client";

import { useShop } from "./ShopProvider";
import { track } from "@/lib/track";

// Selector para ver los precios en pesos o en dólares.
export default function MonedaToggle({ compact = false }: { compact?: boolean }) {
  const { moneda, setMoneda } = useShop();
  const opts = [
    { id: "ARS", label: compact ? "$" : "Pesos" },
    { id: "USD", label: compact ? "US$" : "Dólares" },
  ] as const;
  return (
    <div className="moneda" role="radiogroup" aria-label="Ver precios en">
      {opts.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={moneda === o.id}
          className={moneda === o.id ? "on" : ""}
          onClick={() => {
            setMoneda(o.id);
            track("cambiar_moneda", { moneda: o.id });
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
