import Link from "next/link";
import { SALONES } from "@/lib/salones";
import { money } from "@/lib/format";
export default function SalonesPage() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">Paso 1 de 3 · Elija su salón</div>
          <h2>Nuestros salones</h2>
          <p>Seleccione el espacio que mejor se ajuste a su evento. La cotización se arma en base al salón elegido.</p>
        </div>
        <div className="salon-grid">
          {SALONES.map((s) => (
            <div className="salon-card" key={s.id}>
              <div className={`ph ${s.tono}`}>
                <img className="ph-img" src={s.fotos[0]} alt={`Salón ${s.nombre}`} loading="lazy" />
              </div>
              <div className="salon-body">
                <div className="eyebrow" style={{ marginBottom: 6 }}>Desde {money(s.renta)}</div>
                <h3>{s.nombre}</h3>
                <p className="desc">{s.descripcion}</p>
                <div className="salon-specs">
                  <div><b>{s.banquete}</b>Banquete</div>
                  <div><b>{s.auditorio}</b>Auditorio</div>
                  <div><b>{s.area}</b>m²</div>
                </div>
                <Link className="btn btn-primary btn-arrow" href={`/cotizar/${s.id}`}>Cotizar este salón</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
