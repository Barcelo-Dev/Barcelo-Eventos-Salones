"use client";
export default function PrintButton({ label = "Descargar / Imprimir" }: { label?: string }) {
  return <button className="btn btn-brass" onClick={() => window.print()}>{label}</button>;
}
