"use client";
import { useEffect } from "react";
import { registrarVisita } from "@/app/actions";
export default function VisitTracker() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("barcelo_visit_counted")) return;
      sessionStorage.setItem("barcelo_visit_counted", "1");
      registrarVisita();
    } catch {}
  }, []);
  return null;
}
