import "./globals.css";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import VisitTracker from "@/components/VisitTracker";

export const metadata: Metadata = {
  title: "Barceló Guatemala City · Eventos y Salones",
  description: "Cotice bodas, congresos y eventos en los salones del Hotel Barceló Guatemala City. Elija su salón y reciba su proforma.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Mulish:wght@400;500;600;700;800&family=Zilla+Slab:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <VisitTracker />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
