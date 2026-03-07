"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

interface Props {
  counts: Record<string, number>;
}

const FILTERS = [
  { key: "all",         label: "Todos" },
  { key: "in_progress", label: "En Progreso" },
  { key: "planning",    label: "Planificación" },
  { key: "review",      label: "Revisión" },
  { key: "completed",   label: "Completado" },
  { key: "on_hold",     label: "En Pausa" },
];

export default function ProjectFilters({ counts }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const status = searchParams.get("status") ?? "all";
  const q = searchParams.get("q") ?? "";

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value || value === "all") params.delete(key);
      else params.set(key, value);
      startTransition(() => router.replace(`/projects?${params.toString()}`));
    },
    [router, searchParams]
  );

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="search"
          placeholder="Buscar por nombre, código o cliente..."
          defaultValue={q}
          onChange={(e) => update("q", e.target.value)}
          className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
        />
      </div>

      {/* Pills */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => update("status", f.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              status === f.key
                ? "bg-zinc-700 text-white"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            {f.label}
            <span className="ml-1.5 text-xs opacity-60">{counts[f.key] ?? 0}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
