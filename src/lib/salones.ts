export type Salon = {
  id: string; nombre: string; tono: string; categoria: string; descripcion: string;
  banquete: number; auditorio: number; coctel: number; area: number; renta: number; fotos: string[];
};
const fotos = (id: string, n: number) => Array.from({ length: n }, (_, i) => `/assets/salones/${id}-${i + 1}.jpg`);

export const SALONES: Salon[] = [
  { id: "naciones", nombre: "Las Naciones", tono: "t1", categoria: "salones", descripcion: "Nuestro gran salón. Techos altos, ideal para bodas de gala y congresos de gran formato.", banquete: 1140, auditorio: 1500, coctel: 1500, area: 864, renta: 12000, fotos: fotos("naciones", 3) },
  { id: "piedras", nombre: "Piedras Negras", tono: "t2", categoria: "salones", descripcion: "Amplio y versátil, perfecto para banquetes y convenciones medianas.", banquete: 240, auditorio: 270, coctel: 250, area: 215.36, renta: 6500, fotos: fotos("piedras", 3) },
  { id: "reyes", nombre: "Reyes", tono: "t2", categoria: "salones", descripcion: "Salón de gran elegancia para galas, bodas temáticas y celebraciones de lujo, con espacio para escenario y grandes montajes.", banquete: 500, auditorio: 750, coctel: 600, area: 531.81, renta: 6000, fotos: fotos("reyes", 3) },
  { id: "jardin", nombre: "Jardín", tono: "t3", categoria: "salones", descripcion: "Jardín interior con fuente y ambiente natural bajo techo, ideal para cócteles, recepciones y bodas al aire libre.", banquete: 150, auditorio: 200, coctel: 250, area: 156, renta: 5500, fotos: fotos("jardin", 3) },
  { id: "dorado", nombre: "El Dorado", tono: "t4", categoria: "salones", descripcion: "Elegante y luminoso, favorito para bodas y cenas de gala.", banquete: 300, auditorio: 400, coctel: 400, area: 368.64, renta: 5000, fotos: fotos("dorado", 3) },
  { id: "xelaju", nombre: "Xelajú", tono: "t3", categoria: "salones", descripcion: "Espacio equilibrado para reuniones corporativas y eventos sociales.", banquete: 240, auditorio: 270, coctel: 250, area: 215.36, renta: 4000, fotos: fotos("xelaju", 3) },
  { id: "zacapa", nombre: "Zacapa", tono: "t5", categoria: "salones", descripcion: "Ambiente cálido para celebraciones íntimas y capacitaciones.", banquete: 50, auditorio: 70, coctel: 60, area: 82.5, renta: 3000, fotos: fotos("zacapa", 1) },
  { id: "coban", nombre: "Cobán", tono: "t7", categoria: "salones", descripcion: "Salón acogedor ideal para juntas ejecutivas y talleres.", banquete: 50, auditorio: 70, coctel: 60, area: 82.5, renta: 2500, fotos: fotos("coban", 1) },
  { id: "flores", nombre: "Flores", tono: "t6", categoria: "salones", descripcion: "El más íntimo, pensado para reuniones pequeñas y desayunos de trabajo.", banquete: 50, auditorio: 70, coctel: 60, area: 77, renta: 1800, fotos: fotos("flores", 1) },
];
export const salonById = (id: string) => SALONES.find((s) => s.id === id);
export const CURRENCY = "Q";
export const IVA = 0.12;
export const PER_PAX_EST = 250;
export const TIPOS_EVENTO = ["Boda","Congreso / Conferencia","Reunión corporativa","Gala / Cena","Cumpleaños / Social","Graduación","Otro"];

/* ===== Montajes (la capacidad depende del tipo de montaje) ===== */
export type MontajeId = "banquete" | "auditorio" | "coctel";
export const MONTAJES: { id: MontajeId; label: string }[] = [
  { id: "banquete", label: "Banquete (mesas redondas)" },
  { id: "auditorio", label: "Auditorio" },
  { id: "coctel", label: "Cóctel" },
];
// Montaje sugerido según el tipo de evento
export const montajePorTipo = (tipo: string): MontajeId =>
  /congreso|conferencia|reuni/i.test(tipo) ? "auditorio" : /c[oó]ctel|c[oó]ctel/i.test(tipo) ? "coctel" : "banquete";

/* ===== Apartados (subdivisiones de cada salón) ===== */
export type Apartado = { id: string; label: string; area: number; banquete: number; auditorio: number; coctel: number; renta: number };
type SubBase = Omit<Apartado, "renta">;

const SUBSECCIONES: Record<string, SubBase[]> = {
  reyes: [
    { id: "r1",  label: "Reyes I",    area: 90.18,  banquete: 60,  auditorio: 60,  coctel: 50 },
    { id: "r2",  label: "Reyes II",   area: 90.18,  banquete: 60,  auditorio: 60,  coctel: 50 },
    { id: "r12", label: "Reyes I-II", area: 180.36, banquete: 150, auditorio: 220, coctel: 200 },
    { id: "r3",  label: "Reyes III",  area: 189.55, banquete: 150, auditorio: 220, coctel: 200 },
    { id: "r4",  label: "Reyes IV",   area: 156.15, banquete: 150, auditorio: 220, coctel: 200 },
  ],
  piedras: [
    { id: "p1", label: "Piedras Negras I",   area: 85.63, banquete: 60, auditorio: 70, coctel: 50 },
    { id: "p2", label: "Piedras Negras II",  area: 85.63, banquete: 60, auditorio: 70, coctel: 50 },
    { id: "p3", label: "Piedras Negras III", area: 85.63, banquete: 60, auditorio: 70, coctel: 50 },
    { id: "p4", label: "Piedras Negras IV",  area: 85.63, banquete: 60, auditorio: 70, coctel: 50 },
  ],
  xelaju: [
    { id: "x1", label: "Xelajú I",   area: 85.63, banquete: 60, auditorio: 70, coctel: 50 },
    { id: "x2", label: "Xelajú II",  area: 85.63, banquete: 60, auditorio: 70, coctel: 50 },
    { id: "x3", label: "Xelajú III", area: 85.63, banquete: 60, auditorio: 70, coctel: 50 },
    { id: "x4", label: "Xelajú IV",  area: 85.63, banquete: 60, auditorio: 70, coctel: 50 },
  ],
  naciones: [
    { id: "n1",   label: "Las Naciones I",       area: 142.41, banquete: 150, auditorio: 180, coctel: 150 },
    { id: "n2",   label: "Las Naciones II",      area: 142.41, banquete: 150, auditorio: 180, coctel: 150 },
    { id: "n3",   label: "Las Naciones III",     area: 163.94, banquete: 180, auditorio: 220, coctel: 200 },
    { id: "n4",   label: "Las Naciones IV",      area: 205.44, banquete: 180, auditorio: 275, coctel: 250 },
    { id: "n5",   label: "Las Naciones V",       area: 293.76, banquete: 250, auditorio: 350, coctel: 300 },
    { id: "n6",   label: "Las Naciones VI",      area: 175.88, banquete: 170, auditorio: 220, coctel: 150 },
    { id: "n123", label: "Las Naciones I, II, III", area: 450.00, banquete: 480, auditorio: 600, coctel: 500 },
    { id: "n45",  label: "Las Naciones IV, V",   area: 499.20, banquete: 480, auditorio: 700, coctel: 650 },
  ],
};

// Devuelve los apartados de un salón (subdivisiones + "Salón completo"), con renta estimada por área
export function getApartados(salon: Salon): Apartado[] {
  const completo: Apartado = { id: "completo", label: "Salón completo", area: salon.area, banquete: salon.banquete, auditorio: salon.auditorio, coctel: salon.coctel, renta: salon.renta };
  const subs = (SUBSECCIONES[salon.id] || []).map((s) => ({ ...s, renta: Math.max(100, Math.round((salon.renta * s.area) / salon.area / 100) * 100) }));
  return [...subs, completo];
}
export const tieneApartados = (salon: Salon) => (SUBSECCIONES[salon.id]?.length ?? 0) > 0;

// Sugerencia: el apartado más pequeño cuya capacidad (según montaje) alcanza los pax
export function sugerirApartado(salon: Salon, pax: number, montaje: MontajeId): Apartado {
  const aps = getApartados(salon);
  const sorted = [...aps].sort((a, b) => a[montaje] - b[montaje]);
  return sorted.find((a) => a[montaje] >= pax) || sorted[sorted.length - 1];
}

export type GalleryItem = { img: string; tono: string; cat: string; cls: string; titulo: string; sub: string };
export const GALLERY: GalleryItem[] = [
  { img:"/assets/gallery/boda-de-gala.jpg",        tono:"t1", cat:"bodas",       cls:"big",  titulo:"Boda de gala",         sub:"Montaje de ceremonia" },
  { img:"/assets/gallery/congreso-anual.jpg",      tono:"t3", cat:"corporativo", cls:"",     titulo:"Congreso anual",       sub:"Montaje auditorio" },
  { img:"/assets/gallery/cena-de-aniversario.jpg", tono:"t5", cat:"social",      cls:"",     titulo:"Cena de aniversario",  sub:"Montaje banquete" },
  { img:"/assets/gallery/recepcion.jpg",           tono:"t4", cat:"bodas",       cls:"wide", titulo:"Recepción",            sub:"Coffee break y estaciones" },
  { img:"/assets/gallery/montaje-banquete.jpg",    tono:"t2", cat:"salones",     cls:"",     titulo:"Montaje banquete",     sub:"Mesas redondas" },
  { img:"/assets/gallery/junta-ejecutiva.jpg",     tono:"t7", cat:"corporativo", cls:"",     titulo:"Junta ejecutiva",      sub:"Montaje en U" },
  { img:"/assets/gallery/quinceanera.jpg",         tono:"t6", cat:"social",      cls:"",     titulo:"Quinceañera",          sub:"Celebración social" },
  { img:"/assets/salones/jardin-1.jpg",            tono:"t3", cat:"salones",     cls:"wide", titulo:"Jardín",               sub:"Ambiente al aire libre" },
];
export const CATEGORIAS = [
  { id:"todos", label:"Todos" },{ id:"bodas", label:"Bodas" },
  { id:"corporativo", label:"Corporativo" },{ id:"social", label:"Social" },{ id:"salones", label:"Salones" },
];
