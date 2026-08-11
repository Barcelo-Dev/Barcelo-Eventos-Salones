"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Cotizacion, Visita, LineItem, Estado } from "@/lib/types";
import { SALONES, TIPOS_EVENTO } from "@/lib/salones";
import { money, fmtDate, STATUS_META, calcTotals } from "@/lib/format";
import { actualizarCotizacion } from "@/app/personal/actions";
import { getSupabaseBrowser } from "@/lib/supabase/client";

const CHART_COLORS = ["#157F9F", "#1C4F70", "#2F94AE", "#3D474C", "#5B6A70", "#26708A", "#8FB9C6"];
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function Donut({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  const r = 54, c = 2 * Math.PI * r;
  let off = 0;
  return (
    <svg viewBox="0 0 140 140" width="140" height="140" style={{ flexShrink: 0 }}>
      {data.map((d, i) => {
        const len = (d.value / total) * c;
        const el = <circle key={i} r={r} cx="70" cy="70" fill="none" stroke={d.color} strokeWidth="20" strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-off} transform="rotate(-90 70 70)" />;
        off += len;
        return el;
      })}
      <text x="70" y="66" textAnchor="middle" fontSize="26" fontWeight="700" fill="#333B3F" fontFamily="Zilla Slab, serif">{total}</text>
      <text x="70" y="86" textAnchor="middle" fontSize="9" fill="#6B767B" letterSpacing="1.5">TOTAL</text>
    </svg>
  );
}

export default function StaffDashboard({ initialQuotes, visitas, email }: { initialQuotes: Cotizacion[]; visitas: Visita[]; email: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<"resumen" | "cotizaciones">("resumen");
  const [editing, setEditing] = useState<Cotizacion | null>(null);
  const quotes = initialQuotes;

  async function logout() {
    await getSupabaseBrowser().auth.signOut();
    router.push("/personal/login");
    router.refresh();
  }

  // ----- métricas -----
  const total = quotes.length;
  const confirmadas = quotes.filter((q) => q.status === "confirmada").length;
  const conv = total ? Math.round((confirmadas / total) * 100) : 0;
  const valor = quotes.reduce((a, q) => a + calcTotals(q).total, 0);

  const visitTotal = visitas.reduce((a, v) => a + v.conteo, 0);
  const visitMap: Record<string, number> = {};
  visitas.forEach((v) => { visitMap[v.dia] = v.conteo; });

  const porSalon = SALONES.map((s) => ({ label: s.nombre, value: quotes.filter((q) => q.salon_id === s.id).length }))
    .filter((d) => d.value > 0).sort((a, b) => b.value - a.value);
  const maxS = Math.max(...porSalon.map((d) => d.value), 1);

  const porTipo = TIPOS_EVENTO.map((t, i) => ({ label: t, value: quotes.filter((q) => q.tipo === t).length, color: CHART_COLORS[i % CHART_COLORS.length] }))
    .filter((d) => d.value > 0).sort((a, b) => b.value - a.value);

  const byMonth: Record<string, number> = {};
  quotes.forEach((q) => { if (!q.fecha) return; const d = new Date(q.fecha + "T00:00"); const k = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0"); byMonth[k] = (byMonth[k] || 0) + 1; });
  const monthKeys = Object.keys(byMonth).sort();
  const totalMonth = monthKeys.reduce((a, k) => a + byMonth[k], 0) || 1;
  const monthData = monthKeys.map((k) => { const p = k.split("-"); return { label: MESES[+p[1] - 1] + " " + p[0].slice(2), value: byMonth[k], pct: Math.round((byMonth[k] / totalMonth) * 100) }; });
  const maxM = Math.max(...monthData.map((d) => d.value), 1);

  const days: Date[] = [];
  for (let i = 13; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); days.push(d); }
  const maxV = Math.max(...days.map((d) => visitMap[d.toISOString().split("T")[0]] || 0), 1);

  return (
    <section className="section">
      <div className="wrap">
        <div className="staff-bar">
          <div>
            <div className="eyebrow">Panel de personal · {email}</div>
            <h2 style={{ fontSize: 34 }}>Tablero</h2>
          </div>
          <button className="btn btn-ghost" onClick={logout}>Cerrar sesión</button>
        </div>

        <div className="tabs">
          <button className={`tab ${tab === "resumen" ? "active" : ""}`} onClick={() => setTab("resumen")}>Resumen</button>
          <button className={`tab ${tab === "cotizaciones" ? "active" : ""}`} onClick={() => setTab("cotizaciones")}>Cotizaciones</button>
        </div>

        {tab === "resumen" && (
          <>
            <div className="kpis">
              <div className="kpi accent"><div className="k-lab">Visitas al sitio</div><div className="k-num">{visitTotal}</div><div className="k-sub">sesiones registradas</div></div>
              <div className="kpi"><div className="k-lab">Cotizaciones</div><div className="k-num">{total}</div><div className="k-sub">solicitudes recibidas</div></div>
              <div className="kpi accent2"><div className="k-lab">Confirmadas</div><div className="k-num">{confirmadas}</div><div className="k-sub">{conv}% de conversión</div></div>
              <div className="kpi"><div className="k-lab">Valor cotizado</div><div className="k-num" style={{ fontSize: 28 }}>{money(valor)}</div><div className="k-sub">IVA incluido</div></div>
            </div>

            {total === 0 ? (
              <div className="chart-card"><div className="chart-empty">Aún no hay cotizaciones para graficar. Cuando los clientes generen proformas, verás aquí el tablero.</div></div>
            ) : (
              <div className="charts">
                <div className="chart-card">
                  <h3>Salón más cotizado</h3><div className="c-sub">Cotizaciones por salón</div>
                  {porSalon.map((d, i) => (
                    <div className="hbar" key={i}>
                      <span className="hbar-lab" title={d.label}>{d.label}</span>
                      <span className="hbar-track"><span className="hbar-fill" style={{ width: `${(d.value / maxS) * 100}%`, background: "var(--teal)" }} /></span>
                      <span className="hbar-val">{d.value}</span>
                    </div>
                  ))}
                </div>

                <div className="chart-card">
                  <h3>Tipo de evento</h3><div className="c-sub">Distribución porcentual</div>
                  <div className="donut-wrap">
                    <Donut data={porTipo} />
                    <ul className="legend">
                      {porTipo.map((d, i) => (
                        <li key={i}><span className="dot" style={{ background: d.color }} />{d.label}<span className="lg-val">{d.value}</span><span className="lg-pct">{Math.round((d.value / total) * 100)}%</span></li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="chart-card span2">
                  <h3>Eventos por mes</h3><div className="c-sub">Porcentaje de eventos según la fecha del evento</div>
                  <div className="vbars">
                    {monthData.map((d, i) => (
                      <div className="vbar" key={i}>
                        <span className="vbar-pct">{d.pct}%</span>
                        <span className="vbar-col" style={{ height: `${(d.value / maxM) * 100}%` }} />
                        <span className="vbar-lab">{d.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="chart-card span2">
                  <h3>Visitas al sitio</h3><div className="c-sub">Últimos 14 días · {visitTotal} sesiones en total</div>
                  <div className="vbars" style={{ height: 120 }}>
                    {days.map((d, i) => {
                      const key = d.toISOString().split("T")[0];
                      const v = visitMap[key] || 0;
                      return (
                        <div className="vbar mini" key={i}>
                          <span className="vbar-col" style={{ height: `${(v / maxV) * 100}%` }} title={`${key}: ${v}`} />
                          <span className="vbar-lab">{d.getDate()}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {tab === "cotizaciones" && (
          total === 0 ? (
            <div className="empty">Aún no hay cotizaciones. Cuando un cliente genere una proforma, aparecerá aquí.</div>
          ) : (
            <table className="staff-table">
              <thead><tr><th>Referencia</th><th>Cliente</th><th>Evento</th><th>Salón</th><th>Fecha</th><th>Pax</th><th>Total</th><th>Estado</th></tr></thead>
              <tbody>
                {quotes.map((q) => (
                  <tr className="clickable" key={q.id} onClick={() => setEditing(q)}>
                    <td><b>{q.ref}</b></td>
                    <td>{q.nombre} {q.apellido}<br /><small style={{ color: "var(--muted)" }}>{q.correo}</small></td>
                    <td>{q.tipo}</td><td>{q.salon_nombre}{q.apartado && q.apartado !== "Salón completo" ? <><br /><small style={{ color: "var(--muted)" }}>{q.apartado}</small></> : ""}</td><td>{fmtDate(q.fecha)}</td><td>{q.pax}</td>
                    <td>{money(calcTotals(q).total)}</td>
                    <td><span className={`badge ${q.status}`}>{STATUS_META[q.status]?.label ?? q.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>

      {editing && <Editor quote={editing} email={email} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); router.refresh(); }} />}
    </section>
  );
}

function Editor({ quote, email, onClose, onSaved }: { quote: Cotizacion; email: string; onClose: () => void; onSaved: () => void }) {
  const [lineas, setLineas] = useState<LineItem[]>(quote.lineas.length ? quote.lineas : [{ desc: "", cant: 1, precio: 0 }]);
  const [descuento, setDescuento] = useState(String(quote.descuento || 0));
  const [status, setStatus] = useState<Estado>(quote.status);
  const [respuesta, setRespuesta] = useState(quote.respuesta || "");
  const [nota, setNota] = useState("");
  const [saving, setSaving] = useState(false);

  const setLinea = (i: number, k: keyof LineItem, v: string) =>
    setLineas((arr) => arr.map((l, j) => (j === i ? { ...l, [k]: k === "desc" ? v : Number(v) || 0 } : l)));
  const addLinea = () => setLineas((a) => [...a, { desc: "", cant: 1, precio: 0 }]);
  const delLinea = (i: number) => setLineas((a) => a.filter((_, j) => j !== i));

  async function save() {
    setSaving(true);
    const clean = lineas.filter((l) => l.desc.trim());
    const historial = [...(quote.historial || [])];
    const notas: Record<string, string> = {
      solicitada: "Cotización marcada como pendiente de atención.",
      cotizada: "El equipo envió la cotización con precios finales.",
      confirmada: "El equipo confirmó la reserva.",
    };
    if (status !== quote.status) historial.push({ estado: status, nota: nota || notas[status], por: email, fecha: new Date().toISOString() });
    else if (nota) historial.push({ estado: status, nota, por: email, fecha: new Date().toISOString() });

    const patch: Partial<Cotizacion> = {
      lineas: clean.length ? clean : quote.lineas,
      descuento: Number(descuento) || 0,
      status, respuesta: respuesta.trim(), historial,
      ...(status === "confirmada" && quote.status !== "confirmada" ? { confirmada_at: new Date().toISOString() } : {}),
    };
    const r = await actualizarCotizacion(quote.id, patch);
    setSaving(false);
    if (r.ok) onSaved();
    else alert(r.error);
  }

  return (
    <div className="modal-bg open" onClick={(e) => { if ((e.target as HTMLElement).className === "modal-bg open") onClose(); }}>
      <div className="modal">
        <div className="modal-head">
          <h3>{quote.ref} · {quote.nombre} {quote.apellido}</h3>
          <button className="close-x" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div style={{ background: "var(--ivory)", borderRadius: 12, padding: "14px 16px", marginBottom: 20, fontSize: 14 }}>
            <b>{quote.tipo}</b> en <b>{quote.salon_nombre}</b>{quote.apartado && quote.apartado !== "Salón completo" ? ` · ${quote.apartado}` : ""} · {fmtDate(quote.fecha)} · {quote.pax} pax · {quote.horario}<br />
            {quote.montaje && <span style={{ color: "var(--ink-soft)" }}>Montaje: {quote.montaje}<br /></span>}
            <span style={{ color: "var(--muted)" }}>{quote.correo} · {quote.telefono}</span>
            {quote.mensaje && <div style={{ marginTop: 8, color: "var(--ink-soft)" }}><b>Requerimientos:</b> {quote.mensaje}</div>}
          </div>

          <label style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-soft)" }}>Conceptos de la proforma</label>
          <div style={{ margin: "10px 0" }}>
            {lineas.map((l, i) => (
              <div className="line-item" key={i}>
                <input placeholder="Concepto" value={l.desc} onChange={(e) => setLinea(i, "desc", e.target.value)} />
                <input type="number" min={0} value={l.cant} onChange={(e) => setLinea(i, "cant", e.target.value)} style={{ textAlign: "right" }} />
                <button className="del-btn" onClick={() => delLinea(i)}>×</button>
                <input type="number" min={0} value={l.precio} onChange={(e) => setLinea(i, "precio", e.target.value)} placeholder="Precio unitario" style={{ gridColumn: "1/3" }} />
              </div>
            ))}
          </div>
          <button className="add-line" onClick={addLinea}>+ Agregar concepto</button>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 20 }}>
            <div className="field"><label>Descuento (Q)</label><input type="number" min={0} value={descuento} onChange={(e) => setDescuento(e.target.value)} /></div>
            <div className="field"><label>Estado</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as Estado)}>
                <option value="solicitada">Solicitada (por atender)</option>
                <option value="cotizada">Cotizada (enviar al cliente)</option>
                <option value="confirmada">Confirmada</option>
              </select>
            </div>
          </div>
          <div className="field" style={{ marginTop: 16 }}><label>Mensaje para el cliente</label>
            <textarea value={respuesta} onChange={(e) => setRespuesta(e.target.value)} placeholder="Ej. Estimada María, adjuntamos su cotización con menú incluido. Disponibilidad confirmada." />
          </div>
          <div className="field" style={{ marginTop: 16 }}><label>Nota de seguimiento (interna)</label>
            <input value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Ej. Llamé al cliente, espera confirmar el menú." style={{ padding: "12px 14px", border: "1px solid var(--line)", borderRadius: 10, fontFamily: "var(--sans)", fontSize: 15 }} />
          </div>

          {quote.historial?.length > 0 && (
            <div style={{ marginTop: 22 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-soft)" }}>Historial de seguimiento</label>
              <ul className="trk-hist" style={{ marginTop: 8 }}>
                {[...quote.historial].reverse().map((h, i) => (
                  <li key={i}><span className="trk-time">{new Date(h.fecha).toLocaleString("es-GT", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span><b>{STATUS_META[h.estado]?.label ?? h.estado}</b>{h.por ? ` · ${h.por}` : ""}{h.nota && <div className="trk-note">{h.nota}</div>}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? "Guardando…" : "Guardar y enviar respuesta"}</button>
        </div>
      </div>
    </div>
  );
}
