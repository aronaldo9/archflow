"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/dashboard": "Panel",
  "/projects": "Proyectos",
  "/projects/new": "Nuevo Proyecto",
  "/map": "Mapa",
  "/calendar": "Calendario",
};

interface HeaderUser {
  name: string;
  email: string;
  role: string;
}

export default function Header({ user }: { user: HeaderUser | null }) {
  const pathname = usePathname();
  const router = useRouter();

  const title =
    pageTitles[pathname] ??
    (pathname.startsWith("/projects/") ? "Detalle del Proyecto" : "ArchFlow");

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <header className="h-16 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-8 sticky top-0 z-20">
      <h1 className="text-white font-semibold text-lg">{title}</h1>

      <div className="flex items-center gap-4">
        <Link
          href="/projects/new"
          className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Proyecto
        </Link>

        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-white text-sm font-medium leading-none">{user.name}</p>
              <p className="text-zinc-500 text-xs mt-0.5">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
