export type LineItem = { desc: string; cant: number; precio: number };
export type HistItem = { estado: string; nota: string; por: string; fecha: string };
export type Estado = "solicitada" | "cotizada" | "confirmada";
export type Cotizacion = {
  id: string; ref: string; salon_id: string; salon_nombre: string;
  nombre: string; apellido: string; correo: string; telefono: string;
  tipo: string; pax: number; fecha: string; horario: string; mensaje: string;
  montaje: string | null; apartado: string | null;
  status: Estado; lineas: LineItem[]; descuento: number; respuesta: string;
  historial: HistItem[]; created_at: string; confirmada_at: string | null;
};
export type Visita = { dia: string; conteo: number };
export type NuevaCotizacion = {
  salon_id: string; nombre: string; apellido: string; correo: string; telefono: string;
  tipo: string; pax: number; fecha: string; horario: string; mensaje: string;
  montaje: string; apartado: string; renta_salon: number;
};
