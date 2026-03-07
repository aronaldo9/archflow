"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const pageTitles: Record<string, string> = {
  "/dashboard": "Panel",
  "/projects": "Proyectos",
  "/projects/new": "Nuevo Proyecto",
  "/map": "Mapa",
};

export default function Header() {
  const pathname = usePathname();

  const title =
    pageTitles[pathname] ??
    (pathname.startsWith("/projects/") ? "Detalle del Proyecto" : "ArchFlow");

  return (
    <header className="h-16 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-8 sticky top-0 z-20">
      <h1 className="text-white font-semibold text-lg">{title}</h1>
      <Link
        href="/projects/new"
        className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Nuevo Proyecto
      </Link>
    </header>
  );
}
