"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { activeCampaign, fmtDay, upcomingCampaign } from "@/lib/promos";

// Cartel arriba de todo: avisa la campaña que se viene y la muestra mientras dura.
export default function CampaignBar() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);
  const live = activeCampaign(now);
  const soon = live ? null : upcomingCampaign(now);
  if (!live && !soon) return null;
  const c = (live ?? soon)!;
  return (
    <Link href="/tienda" className={`promo-bar${live ? " live" : ""}`}>
      {live ? (
        <>
          <b>{c.nombre}</b> · {c.bajada} · hasta el {fmtDay(c.hasta)} →
        </>
      ) : (
        <>
          Se viene <b>{c.nombre}</b>: {c.bajada} del {fmtDay(c.desde)} al {fmtDay(c.hasta)} →
        </>
      )}
    </Link>
  );
}
