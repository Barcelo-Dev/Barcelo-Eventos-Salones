import React from "react";
import { STATUS_META } from "@/lib/format";
import type { Cotizacion } from "@/lib/types";

export default function StatusTimeline({ q }: { q: Cotizacion }) {
  const steps = ["solicitada", "cotizada", "confirmada"];
  const idx = steps.indexOf(q.status);
  const meta = STATUS_META[q.status] ?? { desc: "" };
  const hist = [...(q.historial || [])].reverse();
  return (
    <div className="tracking">
      <div className="eyebrow" style={{ textAlign: "center", marginBottom: 6 }}>Seguimiento de su cotización</div>
      <p style={{ textAlign: "center", color: "var(--ink-soft)", margin: "0 0 22px" }}>{meta.desc}</p>
      <div className="trk-bar">
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div className={`trk-step ${i <= idx ? "done" : ""}`}>
              <div className="trk-dot">{i <= idx ? "✓" : i + 1}</div>
              <div className="trk-lab">{STATUS_META[s].label}</div>
            </div>
            {i < steps.length - 1 && <div className={`trk-line ${i < idx ? "done" : ""}`} />}
          </React.Fragment>
        ))}
      </div>
      <ul className="trk-hist">
        {hist.map((h, i) => (
          <li key={i}>
            <span className="trk-time">{new Date(h.fecha).toLocaleString("es-GT", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
            <b>{STATUS_META[h.estado]?.label ?? h.estado}</b>{h.por ? ` · ${h.por}` : ""}
            {h.nota && <div className="trk-note">{h.nota}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}
