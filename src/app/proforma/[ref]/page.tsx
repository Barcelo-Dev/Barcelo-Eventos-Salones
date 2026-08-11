import Link from "next/link";
import { obtenerCotizacion } from "@/app/actions";
import Proforma from "@/components/Proforma";
import StatusTimeline from "@/components/StatusTimeline";
import ConfirmButton from "@/components/ConfirmButton";
import PrintButton from "@/components/PrintButton";
export const dynamic = "force-dynamic";
export default async function ProformaPage({ params }: { params: { ref: string } }) {
  const q = await obtenerCotizacion(params.ref);
  if (!q) {
    return (
      <section className="section"><div className="wrap" style={{ textAlign: "center" }}>
        <div className="section-head" style={{ margin: "0 auto" }}>
          <h2>Cotización no encontrada</h2>
          <p>No encontramos la referencia {params.ref}.</p>
        </div>
        <Link className="btn btn-primary" href="/salones">Nueva cotización</Link>
      </div></section>
    );
  }
  return (
    <section className="section"><div className="wrap">
      <Proforma q={q} />
      <div className="pf-actions">
        {q.status === "cotizada" && <ConfirmButton refCot={q.ref} />}
        <PrintButton />
        <Link className="btn btn-ghost" href="/consulta">Consultar estado</Link>
        <Link className="btn btn-ghost" href="/salones">Nueva cotización</Link>
      </div>
      <div style={{ maxWidth: 820, margin: "0 auto" }}><StatusTimeline q={q} /></div>
    </div></section>
  );
}
