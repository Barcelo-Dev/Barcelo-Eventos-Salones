"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/client";
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  async function login() {
    setErr(""); setLoading(true);
    const { error } = await getSupabaseBrowser().auth.signInWithPassword({ email: email.trim(), password: pass });
    setLoading(false);
    if (error) { setErr("Correo o contraseña incorrectos."); return; }
    router.push("/personal"); router.refresh();
  }
  return (
    <section className="section"><div className="wrap">
      <div className="staff-gate">
        <img src="/assets/icono.png" alt="" style={{ width: 52, height: 52, borderRadius: 12, marginBottom: 12 }} />
        <div className="eyebrow">Acceso interno</div>
        <h2 style={{ fontSize: 30, margin: "8px 0 4px" }}>Panel de personal</h2>
        <p style={{ color: "var(--muted)", fontSize: 14, margin: "0 0 20px" }}>Ingrese sus credenciales para responder cotizaciones.</p>
        <div className="field" style={{ textAlign: "left", marginBottom: 12 }}><label>Correo</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="usuario@barcelo.com" /></div>
        <div className="field" style={{ textAlign: "left" }}><label>Contraseña</label><input type="password" value={pass} onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") login(); }} placeholder="••••••••" /></div>
        <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 16 }} onClick={login} disabled={loading}>{loading ? "Ingresando…" : "Ingresar"}</button>
        {err && <p style={{ color: "#B0413B", fontSize: 13, marginTop: 12 }}>{err}</p>}
        <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 14, lineHeight: 1.5 }}>Acceso a personal autorizado </p>
      </div>
    </div></section>
  );
}
