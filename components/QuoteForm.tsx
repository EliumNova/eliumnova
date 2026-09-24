"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/lib/site";
import { WhatsAppIcon } from "./Icons";

// Formulario de presupuesto: arma el mensaje y abre WhatsApp con todo completo.
export default function QuoteForm() {
  const [nombre, setNombre] = useState("");
  const [equipo, setEquipo] = useState("Celular");
  const [modelo, setModelo] = useState("");
  const [falla, setFalla] = useState("");
  const [entrega, setEntrega] = useState("Lo llevo al local");

  function enviar(e: FormEvent) {
    e.preventDefault();
    const lineas = ["Hola Eze! Tengo un problemita.", ""];
    if (nombre.trim()) lineas.push(`*Nombre:* ${nombre.trim()}`);
    lineas.push(
      `*Equipo:* ${equipo}`,
      `*Marca y modelo:* ${modelo.trim()}`,
      `*Falla:* ${falla.trim()}`,
      `*Entrega:* ${entrega}`,
    );
    const texto = encodeURIComponent(lineas.join("\n"));
    window.open(`https://wa.me/${site.whatsapp.number}?text=${texto}`, "_blank", "noopener");
  }

  return (
    <form className="cta-box quote" onSubmit={enviar}>
      <h3>¿Qué le pasa a tu equipo?</h3>
      <p>Completá los datos y te llega el mensaje listo para mandar por WhatsApp.</p>

      <div className="q-grid">
        <label className="q-field">
          <span>Tu nombre</span>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Juan Perez" autoComplete="given-name" />
        </label>
        <label className="q-field">
          <span>Equipo</span>
          <select value={equipo} onChange={(e) => setEquipo(e.target.value)}>
            <option>Celular</option>
            <option>Tablet</option>
            <option>Notebook</option>
            <option>PC</option>
            <option>Consola</option>
            <option>Otro</option>
          </select>
        </label>
        <label className="q-field q-full">
          <span>Marca y modelo</span>
          <input value={modelo} onChange={(e) => setModelo(e.target.value)} placeholder="Ej: Samsung A54, iPhone 13" required />
        </label>
        <label className="q-field q-full">
          <span>¿Qué le pasa?</span>
          <textarea value={falla} onChange={(e) => setFalla(e.target.value)} placeholder="Ej: se me cayó y la pantalla no da imagen" rows={3} required />
        </label>
        <label className="q-field q-full">
          <span>¿Cómo nos acercás el equipo?</span>
          <select value={entrega} onChange={(e) => setEntrega(e.target.value)}>
            <option>Lo llevo al local</option>
            <option>Necesito retiro por cadetería</option>
            <option>Lo envío por correo o encomienda</option>
          </select>
        </label>
      </div>

      <div className="row">
        <button type="submit" className="btn btn-main">
          <WhatsAppIcon /> Enviar por WhatsApp
        </button>
        <a className="btn btn-line" href={site.google.url} target="_blank" rel="noopener">
          Dejanos tu reseña
        </a>
      </div>
    </form>
  );
}
