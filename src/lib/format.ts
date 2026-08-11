import { CURRENCY, IVA } from "./salones";
import type { LineItem } from "./types";
export const money = (n: number) =>
  CURRENCY + Number(n || 0).toLocaleString("es-GT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const fmtDate = (s?: string | null) => {
  if (!s) return "—";
  const d = s.length > 10 ? new Date(s) : new Date(s + "T00:00");
  return d.toLocaleDateString("es-GT", { day: "2-digit", month: "long", year: "numeric" });
};
export const STATUS_META: Record<string, { label: string; desc: string }> = {
  solicitada: { label: "Solicitud recibida", desc: "Estamos revisando su solicitud." },
  cotizada: { label: "Cotización enviada", desc: "Revise la proforma y confírmela para reservar." },
  confirmada: { label: "Cotización confirmada", desc: "¡Gracias! Su evento está confirmado." },
};
export function calcTotals(q: { lineas: LineItem[]; descuento: number }) {
  const sub = (q.lineas || []).reduce((a, l) => a + l.cant * l.precio, 0);
  const desc = Number(q.descuento) || 0;
  const base = Math.max(0, sub - desc);
  const iva = base * IVA;
  return { sub, desc, base, iva, total: base + iva };
}
