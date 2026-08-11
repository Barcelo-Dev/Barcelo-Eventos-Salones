"use server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Cotizacion, Visita } from "@/lib/types";

async function requireUser() {
  const supabase = getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");
  return { supabase, user };
}

export async function listarCotizaciones(): Promise<Cotizacion[]> {
  const { supabase } = await requireUser();
  const { data } = await supabase.from("cotizaciones").select("*").order("created_at", { ascending: false });
  return (data as Cotizacion[]) ?? [];
}

export async function listarVisitas(): Promise<Visita[]> {
  const { supabase } = await requireUser();
  const { data } = await supabase.from("visitas").select("*");
  return (data as Visita[]) ?? [];
}

export async function actualizarCotizacion(id: string, patch: Partial<Cotizacion>) {
  try {
    const { supabase } = await requireUser();
    const { error } = await supabase.from("cotizaciones").update(patch).eq("id", id);
    if (error) return { ok: false as const, error: error.message };
    revalidatePath("/personal");
    return { ok: true as const };
  } catch (e: any) {
    return { ok: false as const, error: e.message ?? "Error al actualizar" };
  }
}
