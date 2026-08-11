import { notFound } from "next/navigation";
import { salonById, SALONES } from "@/lib/salones";
import QuoteForm from "@/components/QuoteForm";
export function generateStaticParams() { return SALONES.map((s) => ({ salon: s.id })); }
export default function CotizarPage({ params }: { params: { salon: string } }) {
  const salon = salonById(params.salon);
  if (!salon) notFound();
  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">Paso 2 de 3 · Sus datos</div>
          <h2>Detalles de su cotización</h2>
          <p>Complete la información de su evento. Con esto generaremos su proforma preliminar.</p>
        </div>
        <QuoteForm salon={salon} />
      </div>
    </section>
  );
}
