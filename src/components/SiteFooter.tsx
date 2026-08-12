import Link from "next/link";
export default function SiteFooter() {
  return (
    <footer>
      <div className="wrap">
        <div>
          <img src="/assets/logo-blanco.png" alt="Barceló Guatemala City" style={{ height: 56, display: "block", marginBottom: 10 }} />
          <small>Eventos &amp; Salones · Guatemala</small>
        </div>
        <div>
          <small style={{ letterSpacing: ".14em", textTransform: "uppercase" }}>Contacto</small>
          <span style={{ display: "block", color: "rgba(255,255,255,.8)", fontSize: 14, margin: "6px 0" }}>+502 2378 4000</span>
          <span style={{ display: "block", color: "rgba(255,255,255,.8)", fontSize: 14, margin: "6px 0" }}>guatemalacity.banquetes-asist@barcelo.com</span>
        </div>
        <div>
          <small style={{ letterSpacing: ".14em", textTransform: "uppercase" }}>Salones</small>
          <Link href="/salones">Ver disponibilidad</Link>
          <Link href="/consulta">Consultar cotización</Link>
        </div>
      </div>
    </footer>
  );
}
