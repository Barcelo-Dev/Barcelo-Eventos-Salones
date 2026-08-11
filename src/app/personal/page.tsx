import { listarCotizaciones, listarVisitas } from "./actions";
import StaffDashboard from "@/components/StaffDashboard";
import { getSupabaseServer } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";
export default async function PersonalPage() {
  const supabase = getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  const [quotes, visitas] = await Promise.all([listarCotizaciones(), listarVisitas()]);
  return <StaffDashboard initialQuotes={quotes} visitas={visitas} email={user?.email ?? ""} />;
}
