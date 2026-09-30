"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/lib/site";
import { WhatsAppIcon } from "./Icons";

// Arma la solicitud de arrepentimiento con un número de trámite y la manda por WhatsApp.
export default function RegretForm() {
  const [nombre, setNombre] = useState("");
  const [pedido, setPedido] = useState("");
  const [fecha, setFecha] = useState("");
  const [producto, setProducto] = useState("");
  const [tramite, setTramite] = useState<string | null>(null);

  function enviar(e: FormEvent) {
    e.preventDefault();
    const code = `AR-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    const msg = [
      "*Botón de arrepentimiento*",
      `Número de trámite: ${code}`,
      "",
      `*Nombre:* ${nombre.trim()}`,
      ...(pedido.trim() ? [`*Código de pedido:* ${pedido.trim()}`] : []),
      `*Fecha de compra o entrega:* ${fecha}`,
      `*Producto:* ${producto.trim()}`,
      "",
      "Quiero revocar la compra.",
    ].join("\n");
    window.open(`https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
    setTramite(code);
  }

  if (tramite) {
    return (
      <div className="cta-box">
        <p className="kicker">Número de trámite</p>
        <h3>{tramite}</h3>
        <p>
          Se abrió WhatsApp con tu solicitud; enviá el mensaje para completarla. Guardá este número: te confirmamos la recepción por el
          mismo medio dentro de las 24 horas. Si no se abrió WhatsApp, escribinos al {site.whatsapp.display} con este número.
        </p>
      </div>
    );
  }

  return (
    <form className="cta-box quote" onSubmit={enviar}>
      <div className="q-grid">
        <label className="q-field">
          <span>Nombre y apellido</span>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} required autoComplete="name" />
        </label>
        <label className="q-field">
          <span>Código de pedido (si lo tenés)</span>
          <input value={pedido} onChange={(e) => setPedido(e.target.value)} placeholder="Ej. EN-0211-4821" />
        </label>
        <label className="q-field">
          <span>Fecha de compra o entrega</span>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
        </label>
        <label className="q-field">
          <span>Producto</span>
          <input value={producto} onChange={(e) => setProducto(e.target.value)} placeholder="Ej. AirPods 4" required />
        </label>
      </div>
      <div className="row">
        <button type="submit" className="btn btn-main">
          <WhatsAppIcon /> Pedir la cancelación
        </button>
      </div>
    </form>
  );
}
