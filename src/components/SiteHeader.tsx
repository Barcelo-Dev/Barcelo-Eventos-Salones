"use client";
import Link from "next/link";
import { useState } from "react";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="topbar">
      <div className="wrap">
        <Link href="/" className="brand" onClick={close}>
          <img src="/assets/icono.png" alt="" className="brand-icon" />
          <img src="/assets/logo-blanco.png" alt="Barceló Guatemala City" className="brand-word" />
        </Link>
        <nav className={`nav ${open ? "open" : ""}`}>
          <Link href="/" onClick={close}>Inicio</Link>
          <Link href="/#galeria" onClick={close}>Galería</Link>
          <Link href="/salones" onClick={close}>Salones</Link>
          <Link href="/consulta" onClick={close}>Mi cotización</Link>
          <Link className="staff" href="/personal" onClick={close}>Personal</Link>
          <Link className="cta" href="/salones" onClick={close}>Cotizar ahora</Link>
        </nav>
        <button className="menu-btn" onClick={() => setOpen((o) => !o)} aria-label="Menú">☰</button>
      </div>
    </header>
  );
}
