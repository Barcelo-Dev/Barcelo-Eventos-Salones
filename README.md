# Barceló Guatemala City — Cotizaciones (Next.js + Supabase)

Aplicación web profesional para cotizar eventos y salones del Hotel Barceló
Guatemala City. Los clientes eligen salón, envían su cotización y reciben una
proforma; el personal responde desde un panel con autenticación real, da
seguimiento y confirma; y un tablero muestra analítica (visitas, salón más
cotizado, tipo de evento y eventos por mes).

## Stack

- **Next.js 14** (App Router, React + TypeScript) — deploy nativo en Vercel
- **Tailwind CSS** + sistema de diseño con la identidad Barceló (Mulish + Zilla Slab)
- **Supabase** — Postgres, autenticación del personal y funciones RPC seguras
- **Row Level Security (RLS)** + Server Actions para acceso a datos protegido

## Requisitos

- Node.js 18.17 o superior
- Una cuenta gratuita en https://supabase.com

## Puesta en marcha (local)

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Crear el proyecto en Supabase** y obtener las credenciales en
   *Project Settings → API*: la **Project URL** y la **anon public key**.

3. **Variables de entorno:** copia el ejemplo y complétalo.
   ```bash
   cp .env.example .env.local
   ```
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
   ```

4. **Crear la base de datos:** en Supabase → **SQL Editor** → *New query*, pega
   y ejecuta el contenido de [`supabase/schema.sql`](supabase/schema.sql).
   Esto crea las tablas, la seguridad (RLS), las funciones y siembra los 7 salones.

5. **Crear usuarios del personal:** Supabase → **Authentication → Users → Add user**
   (correo + contraseña, activa *Auto Confirm*). Cualquier usuario autenticado
   podrá entrar a `/personal`.

6. **Arrancar en desarrollo**
   ```bash
   npm run dev
   ```
   Abre http://localhost:3000

## Desplegar en Vercel

1. Sube el proyecto a un repositorio de GitHub.
2. En https://vercel.com → **Add New → Project** → importa el repo.
3. En **Environment Variables** agrega `NEXT_PUBLIC_SUPABASE_URL` y
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` con los valores de tu proyecto Supabase.
4. **Deploy.** Vercel detecta Next.js automáticamente (sin configuración extra).

## Cómo funciona

- **Cliente:** `/` (galería) → `/salones` → `/cotizar/[salon]` (formulario) →
  `/proforma/[ref]` (proforma con número de referencia). Puede dar seguimiento y
  **confirmar** su proforma en `/consulta`.
- **Personal:** `/personal` (protegido). Pestaña **Resumen** con KPIs y gráficas,
  y pestaña **Cotizaciones** para responder, poner precios, cambiar estado, dejar
  notas de seguimiento y enviar la respuesta al cliente.
- **Seguridad:** el público nunca accede directo a la tabla de cotizaciones; usa
  funciones `SECURITY DEFINER` (`crear_cotizacion`, `obtener_cotizacion`,
  `confirmar_cotizacion`) que solo dejan crear, ver por referencia o confirmar.
  El personal accede con sesión de Supabase y RLS.

## Estructura

```
src/
├── app/
│   ├── layout.tsx, globals.css, page.tsx     (inicio + galería)
│   ├── actions.ts                            (acciones públicas)
│   ├── salones/ · cotizar/[salon]/ · consulta/ · proforma/[ref]/
│   └── personal/ (login, panel y sus acciones)
├── components/  (header, footer, galería, proforma, tablero, etc.)
├── lib/         (salones, tipos, formato, clientes Supabase)
└── middleware.ts (protege /personal)
supabase/schema.sql   (tablas, RLS, funciones y seed)
public/assets/        (logotipos e ícono Barceló)
```

## Apartados y montajes de salón

Los salones grandes (Las Naciones, Reyes, Piedras Negras, Xelajú) se **subdividen en
apartados** (I, II, I-II, III, IV, combinaciones…). En el formulario de cotización, según
los **pax** y el **tipo de montaje** (banquete / auditorio / cóctel), el sistema **sugiere
automáticamente** el apartado más pequeño que alcanza, y el cliente puede cambiarlo. El
precio y la proforma se ajustan al apartado elegido.

- Las capacidades por montaje y las subdivisiones están en `SUBSECCIONES` dentro de
  `src/lib/salones.ts`.
- La **renta de cada apartado** se estima de forma proporcional al área; ajústala ahí si
  manejas precios fijos por apartado.

## Fotos de salones y galería

Las fotos reales viven en `public/assets/salones/` (formato `{id}-1.jpg`, `{id}-2.jpg`…)
y `public/assets/gallery/`. Cada salón referencia sus fotos en `src/lib/salones.ts`
(campo `fotos`). Para cambiar o agregar fotos de un salón, coloca los archivos con ese
patrón y ajusta el número de fotos en `salones.ts`.

## Personalizar

- **Salones, capacidades y precios:** `src/lib/salones.ts` **y** el seed en
  `supabase/schema.sql` (mantenlos iguales).
- **IVA / moneda / estimado por persona:** constantes en `src/lib/salones.ts`.
- **Fotos:** reemplaza los bloques `.ph` (marcadores de color) por etiquetas `<img>`.

## Próximos pasos sugeridos

- Envío automático de la proforma por correo (Supabase Edge Functions / Resend).
- Subir fotos reales de la galería a Supabase Storage.
