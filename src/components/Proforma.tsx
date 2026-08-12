import { money, fmtDate, STATUS_META, calcTotals } from "@/lib/format";
import type { Cotizacion } from "@/lib/types";

export default function Proforma({ q }: { q: Cotizacion }) {
  const t = calcTotals(q);
  const statusLabel = STATUS_META[q.status]?.label ?? q.status;
  const preliminar = q.status === "solicitada";
  const confirmada = q.status === "confirmada";
  const docTitle = confirmada ? "Proforma de confirmación" : preliminar ? "Proforma preliminar" : "Proforma No.";
  return (
    <div className="proforma" id="proforma">
      <div className="pf-head">
        <img src="/assets/logo-blanco.png" alt="Barceló Guatemala City" style={{ height: 52, display: "block" }} />
        <div className="ref">
          <div className="eyebrow">{docTitle}</div>
          <b>{q.ref}</b>
          <span className="pf-status">{statusLabel}</span>
        </div>
      </div>
      {confirmada && (
        <div style={{ background: "var(--ok-bg)", color: "var(--ok)", textAlign: "center", padding: 12, fontWeight: 600, fontSize: 14, letterSpacing: ".04em" }}>
          ✓ Cotización confirmada por el cliente el {new Date(q.confirmada_at || q.created_at).toLocaleDateString("es-GT")}
        </div>
      )}
      <div className="pf-body">
        <div className="pf-meta">
          <div><span>Cliente</span> {q.nombre} {q.apellido}</div>
          <div><span>Fecha evento</span> {fmtDate(q.fecha)} · {q.horario}</div>
          <div><span>Correo</span> {q.correo}</div>
          <div><span>Tipo de evento</span> {q.tipo}</div>
          <div><span>Teléfono</span> {q.telefono}</div>
          <div><span>Personas</span> {q.pax} pax</div>
          <div><span>Salón</span> {q.salon_nombre}{q.apartado && q.apartado !== "Salón completo" ? ` · ${q.apartado}` : ""}</div>
          <div><span>Montaje</span> {q.montaje || "—"}</div>
        </div>
        {q.mensaje && (
          <div style={{ fontSize: 14, color: "var(--ink-soft)", marginBottom: 20 }}>
            <b style={{ color: "var(--ink)" }}>Requerimientos:</b> {q.mensaje}
          </div>
        )}
        <table className="pf-table">
          <thead><tr><th>Concepto</th><th className="r">Cant.</th><th className="r">P. unitario</th><th className="r">Importe</th></tr></thead>
          <tbody>
            {q.lineas.map((l, i) => (
              <tr key={i}><td>{l.desc}</td><td className="r">{l.cant}</td><td className="r">{money(l.precio)}</td><td className="r">{money(l.cant * l.precio)}</td></tr>
            ))}
          </tbody>
        </table>
        <div className="pf-totals">
          <div className="row"><span>Subtotal</span><span>{money(t.sub)}</span></div>
          {t.desc > 0 && <div className="row"><span>Descuento</span><span>− {money(t.desc)}</span></div>}
          <div className="row"><span>IVA (12%)</span><span>{money(t.iva)}</span></div>
          <div className="row grand"><span>Total {preliminar ? "estimado" : ""}</span><span>{money(t.total)}</span></div>
        </div>
        {q.respuesta && (
          <div className="pf-msg"><div className="eyebrow">Mensaje de nuestro equipo</div><p style={{ margin: "6px 0 0" }}>{q.respuesta}</p></div>
        )}
        {preliminar ? (
          <div className="pf-note no-print"><b>Proforma preliminar.</b> Los montos son una estimación. Nuestro equipo revisará su solicitud y le confirmará precios finales, disponibilidad y opciones de menú.</div>
        ) : (
          <div className="pf-note">Válida por 15 días a partir de la fecha de emisión. Sujeta a disponibilidad al momento de la confirmación.</div>
        )}
      </div>
      <div className="pf-foot">
        <span>Barceló Eventos &amp; Salones · Guatemala · guatemalacity.banquetes-asist@barcelo.com · +502 2378 4000</span>
        <span>Ref: {q.ref}</span>
      </div>
    </div>
  );
}
