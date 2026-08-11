"use server";
import { getSupabaseServer } from "@/lib/supabase/server";
import type { Cotizacion, NuevaCotizacion } from "@/lib/types";

export async function crearCotizacion(input: NuevaCotizacion) {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase.rpc("crear_cotizacion", { p: input });
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const, cotizacion: data as Cotizacion };
  } catch (e: any) {
    return { ok: false as const, error: e.message ?? "Error al crear la cotización" };
  }
}

export async function obtenerCotizacion(ref: string): Promise<Cotizacion | null> {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase.rpc("obtener_cotizacion", { p_ref: ref.trim().toUpperCase() });
    if (error || !data) return null;
    return data as Cotizacion;
  } catch { return null; }
}

export async function confirmarCotizacion(ref: string) {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase.rpc("confirmar_cotizacion", { p_ref: ref.trim().toUpperCase() });
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const, cotizacion: data as Cotizacion };
  } catch (e: any) {
    return { ok: false as const, error: e.message ?? "Error al confirmar" };
  }
}

export async function registrarVisita() {
  try {
    const supabase = getSupabaseServer();
    await supabase.rpc("registrar_visita");
  } catch {}
  return { ok: true as const };
}
