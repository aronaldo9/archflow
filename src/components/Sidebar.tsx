"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/dashboard",
    label: "Panel",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: "/projects",
    label: "Proyectos",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    href: "/calendar",
    label: "Calendario",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: "/map",
    label: "Mapa",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col z-30">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-zinc-800">
        <svg viewBox="0 0 192 48" width="192" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sb-gold" x1="24" y1="38" x2="24" y2="4" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#78350f" />
              <stop offset="40%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#fde68a" />
            </linearGradient>
            <linearGradient id="sb-blue" x1="0" y1="0" x2="48" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#1e3a8a" />
              <stop offset="55%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#7dd3fc" />
            </linearGradient>
          </defs>

          {/* Outer arch */}
          <path d="M2 38 C2 8 46 8 46 38" stroke="url(#sb-gold)" strokeWidth="4.5" strokeLinecap="round"/>
          {/* Inner arch */}
          <path d="M8 38 C8 17 40 17 40 38" stroke="url(#sb-gold)" strokeWidth="2.5" strokeLinecap="round" opacity="0.72"/>

          {/* Wave 1 */}
          <path d="M0 40 C7 37 13 43.5 24 40 C35 36.5 41 43 48 40" stroke="url(#sb-blue)" strokeWidth="2" strokeLinecap="round"/>
          {/* Wave 2 */}
          <path d="M1 44.5 C8 42 14 47 24 44.5 C34 42 40 46.5 47 44.5" stroke="url(#sb-blue)" strokeWidth="1.3" strokeLinecap="round" opacity="0.5"/>

          {/* Wordmark */}
          <text x="58" y="26" fontFamily="system-ui,-apple-system,sans-serif" fontSize="21" fontWeight="700" letterSpacing="-0.4" fill="white">Arch</text>
          <text x="101" y="26" fontFamily="system-ui,-apple-system,sans-serif" fontSize="21" fontWeight="700" letterSpacing="-0.4" fill="#60a5fa">Flow</text>

          {/* Subtitle */}
          <text x="59" y="40" fontFamily="system-ui,-apple-system,sans-serif" fontSize="7.5" fontWeight="400" fill="#71717a" letterSpacing="1.8">ARQUITECTURA</text>
        </svg>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
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
  );
}
