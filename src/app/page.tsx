import Link from "next/link";
import Gallery from "@/components/Gallery";
export default function Home() {
  return (
    <section>
      <div className="hero">
        <div className="wrap">
          <div>
            <div className="eyebrow">Hotel Barceló · Guatemala</div>
            <h1>Celebre lo importante en un <em>salón a su medida</em></h1>
            <p className="lead">Bodas, congresos, galas y reuniones corporativas. Elija su salón, arme su evento y reciba una proforma en minutos.</p>
            <div className="hero-actions">
              <Link className="btn btn-primary btn-arrow" href="/salones">Iniciar cotización</Link>
              <Link className="btn btn-ghost" href="#galeria">Ver galería</Link>
            </div>
          </div>
          <div className="hero-card">
            <div className="hero-collage">
              <div className="ph t1"><img className="ph-img" src="/assets/salones/reyes-3.jpg" alt="" /><span className="ph-tag">Gala</span></div>
              <div className="ph t3"><img className="ph-img" src="/assets/gallery/boda-de-gala.jpg" alt="" /><span className="ph-tag">Boda</span></div>
              <div className="ph t5"><img className="ph-img" src="/assets/salones/jardin-1.jpg" alt="" /><span className="ph-tag">Jardín</span></div>
            </div>
            <div className="hero-stats">
              <div><div className="num">9</div><div className="lab">Salones</div></div>
              <div><div className="num">800</div><div className="lab">Capacidad máx.</div></div>
              <div><div className="num">24h</div><div className="lab">Respuesta</div></div>
            </div>
          </div>
        </div>
      </div>
      <div className="section" id="galeria">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Galería</div>
            <h2>Momentos que hemos hecho posibles</h2>
            <p>Explore ambientes de eventos reales y el montaje de nuestros salones. Filtre por categoría.</p>
          </div>
          <Gallery />
        </div>
      </div>
    </section>
  );
}
