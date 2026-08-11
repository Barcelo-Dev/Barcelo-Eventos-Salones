"use client";
import { useState } from "react";
import { obtenerCotizacion, confirmarCotizacion } from "@/app/actions";
import Proforma from "@/components/Proforma";
import StatusTimeline from "@/components/StatusTimeline";
import PrintButton from "@/components/PrintButton";
import type { Cotizacion } from "@/lib/types";

export default function ConsultaPage() {
  const [ref, setRef] = useState("");
  const [q, setQ] = useState<Cotizacion | null>(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function buscar() {
    setMsg("");
    if (!ref.trim()) { setMsg("Ingrese un número de referencia."); return; }
    setLoading(true);
    const r = await obtenerCotizacion(ref);
    setLoading(false);
    if (!r) { setMsg("No encontramos esa referencia. Verifique el código."); setQ(null); return; }
    setQ(r);
  }
  async function confirmar() {
    if (!q) return;
    const r = await confirmarCotizacion(q.ref);
    if (r.ok && r.cotizacion) setQ(r.cotizacion);
  }

  if (q) {
    return (
      <section className="section"><div className="wrap">
        <Proforma q={q} />
        <div className="pf-actions">
          {q.status === "cotizada" && <button className="btn btn-primary btn-arrow" onClick={confirmar}>Confirmar y reservar</button>}
          <PrintButton />
          <button className="btn btn-ghost" onClick={() => { setQ(null); setRef(""); }}>Buscar otra</button>
        </div>
        <div style={{ maxWidth: 820, margin: "0 auto" }}><StatusTimeline q={q} /></div>
      </div></section>
    );
  }
  return (
    <section className="section"><div className="wrap">
      <div className="section-head" style={{ textAlign: "center", margin: "0 auto 34px" }}>
        <div className="eyebrow">Seguimiento</div>
        <h2>Consulte su cotización</h2>
      </div>
      <div className="lookup">
        <p style={{ color: "var(--ink-soft)", margin: 0 }}>Ingrese el número de referencia que recibió al generar su proforma para ver el estado y la respuesta de nuestro equipo.</p>
        <div className="row">
          <input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="COT-000000-000" onKeyDown={(e) => { if (e.key === "Enter") buscar(); }} />
          <button className="btn btn-primary" onClick={buscar} disabled={loading}>{loading ? "…" : "Buscar"}</button>
        </div>
        {msg && <p style={{ color: "#B0413B", fontSize: 14, margin: "14px 0 0" }}>{msg}</p>}
      </div>
    </div></section>
  );
}
