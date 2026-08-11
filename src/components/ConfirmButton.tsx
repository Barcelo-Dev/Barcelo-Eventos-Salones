"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { confirmarCotizacion } from "@/app/actions";
export default function ConfirmButton({ refCot }: { refCot: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function onClick() {
    setLoading(true);
    const r = await confirmarCotizacion(refCot);
    setLoading(false);
    if (r.ok) router.refresh();
  }
  return (
    <button className="btn btn-primary btn-arrow" onClick={onClick} disabled={loading}>
      {loading ? "Confirmando…" : "Confirmar y reservar"}
    </button>
  );
}
