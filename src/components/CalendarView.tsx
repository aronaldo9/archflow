"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface CalendarEvent {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  projectId: string;
  projectName: string;
  projectCode: string;
  projectStatus: string;
}

const STATUS_DOT: Record<string, string> = {
  planning:    "bg-blue-500",
  in_progress: "bg-amber-500",
  review:      "bg-violet-500",
  completed:   "bg-emerald-500",
  on_hold:     "bg-zinc-500",
};

const STATUS_TEXT: Record<string, string> = {
  planning:    "text-blue-400",
  in_progress: "text-amber-400",
  review:      "text-violet-400",
  completed:   "text-emerald-400",
  on_hold:     "text-zinc-400",
};

const MONTH_NAMES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DAY_NAMES = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];

export default function CalendarView({ events }: { events: CalendarEvent[] }) {
  const now = new Date();
  const [year, setYear]   = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const e of events) {
      const key = e.dueDate.slice(0, 10);
      (map[key] ??= []).push(e);
    }
    return map;
  }, [events]);

  const firstDow    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDow + 6) % 7; // Mon = 0

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const prev = () => { if (month === 0) { setYear((y) => y - 1); setMonth(11); } else setMonth((m) => m - 1); };
  const next = () => { if (month === 11) { setYear((y) => y + 1); setMonth(0); } else setMonth((m) => m + 1); };

  const in30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const upcoming = events
    .filter((e) => { const d = new Date(e.dueDate); return d >= now && d <= in30 && !e.completed; })
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 10);

  return (
    <div className="flex gap-6 items-start">
      {/* ── Calendar grid ── */}
      <div className="flex-1 min-w-0">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={prev}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-white font-semibold">
            {MONTH_NAMES[month]} <span className="text-zinc-400 font-normal">{year}</span>
          </h2>
          <button
            onClick={next}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAY_NAMES.map((d) => (
            <div key={d} className="text-center text-xs text-zinc-500 font-medium py-1.5">
              {d}
            </div>
          ))}
        </div>

        {/* Cells */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (!day) return <div key={i} className="h-24 rounded-lg" />;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayEvents = eventsByDate[dateStr] ?? [];
            const isToday = dateStr === todayStr;
            const isPast  = dateStr < todayStr;

            return (
              <div
                key={i}
                className={`h-24 rounded-lg p-1.5 border overflow-hidden flex flex-col ${
                  isToday
                    ? "border-amber-500/50 bg-amber-500/5"
                    : "border-zinc-700/30 bg-zinc-800/30 hover:bg-zinc-800/50"
                } transition-colors`}
              >
                <span
                  className={`text-xs font-medium mb-1 flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full ${
                    isToday ? "bg-amber-500 text-black font-bold" : isPast ? "text-zinc-600" : "text-zinc-400"
                  }`}
                >
                  {day}
                </span>
                <div className="space-y-0.5 overflow-hidden flex-1">
                  {dayEvents.slice(0, 3).map((ev) => (
                    <Link
                      key={ev.id}
                      href={`/projects/${ev.projectId}`}
                      className="flex items-center gap-1 group/ev"
                      title={`${ev.title} — ${ev.projectName}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${ev.completed ? "bg-zinc-600" : STATUS_DOT[ev.projectStatus] ?? "bg-zinc-500"}`} />
                      <span className={`text-xs truncate leading-tight group-hover/ev:underline ${ev.completed ? "text-zinc-600 line-through" : "text-zinc-300"}`}>
                        {ev.title}
                      </span>
                    </Link>
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="text-xs text-zinc-600">+{dayEvents.length - 3} más</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-zinc-700/30">
          {Object.entries({ planning: "Planificación", in_progress: "En progreso", review: "Revisión", completed: "Completado", on_hold: "En pausa" }).map(([k, v]) => (
            <span key={k} className="flex items-center gap-1.5 text-xs text-zinc-500">
              <span className={`w-2 h-2 rounded-full ${STATUS_DOT[k]}`} />
              {v}
            </span>
          ))}
        </div>
      </div>

      {/* ── Upcoming sidebar ── */}
      <div className="w-64 flex-shrink-0 space-y-4">
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4">
          <h3 className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-3">
            Próximos 30 días
          </h3>
          {upcoming.length === 0 ? (
            <p className="text-zinc-500 text-xs text-center py-4">Sin hitos próximos</p>
          ) : (
            <ul className="space-y-3">
              {upcoming.map((e) => {
                const d = new Date(e.dueDate);
                const diffDays = Math.ceil((d.getTime() - now.getTime()) / 86400000);
                return (
                  <li key={e.id}>
                    <Link href={`/projects/${e.projectId}`} className="group/up block">
                      <div className="flex items-start gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${STATUS_DOT[e.projectStatus] ?? "bg-zinc-500"}`} />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-white truncate group-hover/up:underline">{e.title}</p>
                          <p className="text-xs text-zinc-500 truncate">{e.projectCode}</p>
                        </div>
                        <span className={`text-xs flex-shrink-0 font-medium tabular-nums ${diffDays <= 7 ? "text-red-400" : "text-zinc-500"}`}>
                          {diffDays === 0 ? "Hoy" : diffDays === 1 ? "Mañana" : `${diffDays}d`}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Stats */}
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 space-y-3">
          <h3 className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Este mes</h3>
          {(() => {
            const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;
            const thisMonth = events.filter((e) => e.dueDate.startsWith(monthStr));
            const done = thisMonth.filter((e) => e.completed).length;
            return (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Hitos</span>
                  <span className="text-white font-medium">{thisMonth.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Completados</span>
                  <span className="text-emerald-400 font-medium">{done}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Pendientes</span>
                  <span className={`font-medium ${thisMonth.length - done > 0 ? "text-amber-400" : "text-zinc-400"}`}>
                    {thisMonth.length - done}
                  </span>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
