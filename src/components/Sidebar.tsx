"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/dashboard",
    label: "Panel",
    icon: (
      <svg aria-hidden="true" className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: "/projects",
    label: "Proyectos",
    icon: (
      <svg aria-hidden="true" className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    href: "/calendar",
    label: "Calendario",
    icon: (
      <svg aria-hidden="true" className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: "/map",
    label: "Mapa",
    icon: (
      <svg aria-hidden="true" className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop — mobile only */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Navegación principal"
      >
        {/* Logo + close button */}
        <div className="h-16 flex items-center justify-between border-b border-zinc-800 px-4">
          <svg
            width="192"
            height="48"
            viewBox="0 0 192 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="ArchFlow"
            role="img"
          >
            <defs>
              <linearGradient id="sb-gold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <linearGradient id="sb-blue" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>
            <path d="M8 38 L8 22 Q8 10 18 10 Q28 10 28 22 L28 38" stroke="url(#sb-gold)" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <path d="M20 38 L20 18 Q20 4 32 4 Q44 4 44 18 L44 38" stroke="url(#sb-gold)" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <path d="M4 42 Q10 38 16 42 Q22 46 28 42 Q34 38 40 42 Q46 46 52 42" stroke="url(#sb-blue)" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M4 46 Q10 42 16 46 Q22 50 28 46 Q34 42 40 46 Q46 50 52 46" stroke="url(#sb-blue)" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
            <text x="60" y="30" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="22" fill="white">Arch</text>
            <text x="101" y="30" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="22" fill="#38bdf8">Flow</text>
            <text x="60" y="44" fontFamily="system-ui, sans-serif" fontWeight="400" fontSize="9" fill="#71717a" letterSpacing="2">ARQUITECTURA</text>
          </svg>

          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            aria-label="Cerrar menú"
            className="lg:hidden w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1" aria-label="Menú principal">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Studio info */}
        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-300">
              AS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-200 truncate">Arch Studio</p>
              <p className="text-xs text-zinc-500 truncate">admin@archstudio.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
