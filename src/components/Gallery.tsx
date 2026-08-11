"use client";
import { useState } from "react";
import { GALLERY, CATEGORIAS } from "@/lib/salones";
export default function Gallery() {
  const [cat, setCat] = useState("todos");
  const items = GALLERY.filter((g) => cat === "todos" || g.cat === cat);
  return (
    <>
      <div className="filters">
        {CATEGORIAS.map((c) => (
          <button key={c.id} className={`chip ${cat === c.id ? "active" : ""}`} onClick={() => setCat(c.id)}>{c.label}</button>
        ))}
      </div>
      <div className="gallery">
        {items.map((g, i) => (
          <div key={i} className={`ph ${g.tono} ${g.cls}`}>
            <img className="ph-img" src={g.img} alt={g.titulo} loading="lazy" />
            <div className="g-cap"><b>{g.titulo}</b><small>{g.sub}</small></div>
          </div>
        ))}
      </div>
    </>
  );
}
