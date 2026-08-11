"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Salon, MontajeId } from "@/lib/salones";
import { PER_PAX_EST, TIPOS_EVENTO, MONTAJES, montajePorTipo, getApartados, tieneApartados, sugerirApartado } from "@/lib/salones";
import { money } from "@/lib/format";
import { crearCotizacion } from "@/app/actions";

type FormState = { nombre: string; apellido: string; correo: string; telefono: string; tipo: string; pax: string; fecha: string; horario: string; mensaje: string; };
const montajeCorto = (m: MontajeId) => (m === "coctel" ? "cóctel" : m);

export default function QuoteForm({ salon }: { salon: Salon }) {
  const router = useRouter();
  const [f, setF] = useState<FormState>({ nombre: "", apellido: "", correo: "", telefono: "", tipo: "", pax: "", fecha: "", horario: "Tarde", mensaje: "" });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [foto, setFoto] = useState(salon.fotos[0]);
  const [montaje, setMontaje] = useState<MontajeId>("banquete");
  const [montajeManual, setMontajeManual] = useState(false);
  const [apartadoOverride, setApartadoOverride] = useState<string | null>(null);

  const apartados = useMemo(() => getApartados(salon), [salon]);
  const completo = apartados.find((a) => a.id === "completo")!;
  const divisible = tieneApartados(salon);

  const upd = (k: keyof FormState, v: string) => {
    setF((s) => ({ ...s, [k]: v }));
    if (k === "tipo" && !montajeManual) { setMontaje(montajePorTipo(v)); setApartadoOverride(null); }
  };
  const cambiarMontaje = (m: MontajeId) => { setMontaje(m); setMontajeManual(true); setApartadoOverride(null); };

  const paxNum = Number(f.pax) || 0;
  const sugerido = paxNum > 0 ? sugerirApartado(salon, paxNum, montaje) : completo;
  const selId = apartadoOverride ?? sugerido.id;
  const selected = apartados.find((a) => a.id === selId) ?? completo;
  const est = selected.renta + paxNum * PER_PAX_EST;
  const capMax = completo[montaje];
  const excede = paxNum > capMax;
  const opciones = [...apartados].sort((a, b) => a[montaje] - b[montaje]);
  const today = new Date().toISOString().split("T")[0];

  function validate() {
    const e: Record<string, boolean> = {};
    if (!f.nombre.trim()) e.nombre = true;
    if (!f.apellido.trim()) e.apellido = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.correo.trim())) e.correo = true;
    if (f.telefono.trim().length < 6) e.telefono = true;
    if (!f.tipo) e.tipo = true;
    if (!(Number(f.pax) >= 1)) e.pax = true;
    if (!f.fecha) e.fecha = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  async function submit() {
    setServerError("");
    if (!validate()) return;
    setLoading(true);
    const r = await crearCotizacion({
      salon_id: salon.id, nombre: f.nombre.trim(), apellido: f.apellido.trim(), correo: f.correo.trim(),
      telefono: f.telefono.trim(), tipo: f.tipo, pax: Number(f.pax), fecha: f.fecha, horario: f.horario, mensaje: f.mensaje.trim(),
      montaje: MONTAJES.find((m) => m.id === montaje)!.label, apartado: selected.label, renta_salon: selected.renta,
    });
    setLoading(false);
    if (r.ok && r.cotizacion) router.push(`/proforma/${r.cotizacion.ref}`);
    else setServerError(r.error || "No se pudo generar la cotización.");
  }
  const fc = (k: string) => `field${errors[k] ? " invalid" : ""}`;

  return (
    <div className="quote-layout">
      <div className="form-card">
        <div className="form-grid">
          <div className={fc("nombre")}><label>Nombre <span className="req">*</span></label><input value={f.nombre} onChange={(e) => upd("nombre", e.target.value)} placeholder="Ej. María" /><small className="err">Ingrese su nombre.</small></div>
          <div className={fc("apellido")}><label>Apellido <span className="req">*</span></label><input value={f.apellido} onChange={(e) => upd("apellido", e.target.value)} placeholder="Ej. González" /><small className="err">Ingrese su apellido.</small></div>
          <div className={fc("correo")}><label>Correo electrónico <span className="req">*</span></label><input type="email" value={f.correo} onChange={(e) => upd("correo", e.target.value)} placeholder="nombre@correo.com" /><small className="err">Ingrese un correo válido.</small></div>
          <div className={fc("telefono")}><label>Número de teléfono <span className="req">*</span></label><input type="tel" value={f.telefono} onChange={(e) => upd("telefono", e.target.value)} placeholder="+502 0000 0000" /><small className="err">Ingrese un teléfono.</small></div>
          <div className={fc("tipo")}><label>Tipo de evento <span className="req">*</span></label>
            <select value={f.tipo} onChange={(e) => upd("tipo", e.target.value)}>
              <option value="">Seleccione…</option>
              {TIPOS_EVENTO.map((t) => <option key={t}>{t}</option>)}
            </select><small className="err">Seleccione el tipo de evento.</small>
          </div>
          <div className={fc("pax")}><label>Cantidad de personas (pax) <span className="req">*</span></label><input type="number" min={1} value={f.pax} onChange={(e) => upd("pax", e.target.value)} placeholder="Ej. 120" /><small className="err">Ingrese la cantidad de personas.</small></div>
          <div className="field"><label>Tipo de montaje</label>
            <select value={montaje} onChange={(e) => cambiarMontaje(e.target.value as MontajeId)}>
              {MONTAJES.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
          </div>
          <div className={fc("fecha")}><label>Fecha del evento <span className="req">*</span></label><input type="date" min={today} value={f.fecha} onChange={(e) => upd("fecha", e.target.value)} /><small className="err">Seleccione una fecha.</small></div>
          <div className="field"><label>Horario aproximado</label>
            <select value={f.horario} onChange={(e) => upd("horario", e.target.value)}><option>Mañana</option><option>Tarde</option><option>Noche</option></select>
          </div>
          {divisible && (
            <div className="field full"><label>Distribución del salón {paxNum > 0 && <span className="hint-auto">· sugerimos {sugerido.label} para {paxNum} pax</span>}</label>
              <select value={selId} onChange={(e) => setApartadoOverride(e.target.value)}>
                {opciones.map((a) => (
                  <option key={a.id} value={a.id}>{a.label} — hasta {a[montaje]} pax ({montajeCorto(montaje)})</option>
                ))}
              </select>
            </div>
          )}
          <div className="field full"><label>Mensaje / requerimientos especiales</label><textarea value={f.mensaje} onChange={(e) => upd("mensaje", e.target.value)} placeholder="Cuéntenos sobre montaje, menú, decoración, audio, etc." /></div>
        </div>
        {excede && <p style={{ color: "#B0413B", fontSize: 13.5, marginTop: 12 }}>Con {paxNum} pax se supera la capacidad máxima del salón en {montajeCorto(montaje)} ({capMax} pax). Nuestro equipo le propondrá alternativas.</p>}
        {serverError && <p style={{ color: "#B0413B", fontSize: 14, marginTop: 14 }}>{serverError}</p>}
        <div className="form-foot">
          <a className="btn btn-ghost" href="/salones">← Cambiar salón</a>
          <button className="btn btn-primary btn-arrow" onClick={submit} disabled={loading}>{loading ? "Generando…" : "Generar proforma"}</button>
        </div>
      </div>
      <aside>
        <div className="detail-card">
          <div className={`ph ${salon.tono}`} style={{ height: 190 }}>
            <img className="ph-img" src={foto} alt={`Salón ${salon.nombre}`} />
          </div>
          <div className="detail-inner">
            {salon.fotos.length > 1 && (
              <div className="salon-thumbs">
                {salon.fotos.map((src) => (
                  <img key={src} src={src} alt="" onClick={() => setFoto(src)} style={{ outline: foto === src ? "2px solid var(--teal)" : "none" }} />
                ))}
              </div>
            )}
            <div className="eyebrow" style={{ marginTop: salon.fotos.length > 1 ? 16 : 0 }}>Salón seleccionado</div>
            <h3>{salon.nombre}</h3>
            <ul className="detail-list">
              <li><span>Distribución</span><b>{selected.label}</b></li>
              <li><span>Capacidad ({montajeCorto(montaje)})</span><b>{selected[montaje]} pax</b></li>
              <li><span>Área</span><b>{selected.area} m²</b></li>
              <li><span>Renta {selected.id === "completo" ? "del salón" : "del apartado"}</span><b>{money(selected.renta)}</b></li>
            </ul>
            <div className="est-box">
              <div className="est-lab">Estimación preliminar</div>
              <div className="est-num">{money(est)}</div>
              <small>{paxNum > 0 ? `Renta + ${paxNum} pax × ${money(PER_PAX_EST)} (banquete estimado)` : "Ingrese los pax para estimar el banquete"}</small>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
