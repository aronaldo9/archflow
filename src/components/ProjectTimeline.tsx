"use client";

import { useState } from "react";

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate: Date | string;
}

interface Props {
  startDate: Date | string;
  endDate: Date | string;
  milestones: Milestone[];
}

function fmtShort(ts: number): string {
  return new Date(ts).toLocaleDateString("es-ES", { month: "short", year: "2-digit" });
}

function fmtFull(date: Date | string): string {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function pct(ts: number, start: number, duration: number): number {
  return Math.max(0, Math.min(100, ((ts - start) / duration) * 100));
}

export default function ProjectTimeline({ startDate, endDate, milestones }: Props) {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const duration = end - start;
  const today = Date.now();
  const todayInRange = today > start && today < end;

  const completedCount = milestones.filter((m) => m.completed).length;
  const progress =
    milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="w-full select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 text-xs text-zinc-500">
        <span>
          {fmtShort(start)} → {fmtShort(end)} · {completedCount}/{milestones.length} hitos completados
        </span>
        <span className="text-amber-400 font-medium">{progress}% completado</span>
      </div>

      {/* Timeline area — vertical padding leaves room for above/below labels */}
      <div className="relative px-3" style={{ paddingTop: "52px", paddingBottom: "52px" }}>
        {/* Bar track */}
        <div className="relative h-1.5 bg-zinc-700 rounded-full">
          {/* Progress fill */}
          {progress > 0 && (
            <div
              className="absolute inset-y-0 left-0 bg-amber-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          )}

          {/* Today line */}
          {todayInRange && (
            <div
              className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: `${pct(today, start, duration)}%` }}
            >
              <div className="w-px h-5 bg-zinc-500 opacity-70" />
              <span
                className="absolute top-full mt-1 text-[9px] text-zinc-500 whitespace-nowrap"
                style={{ transform: "translateX(-50%)" }}
              >
                Hoy
              </span>
            </div>
          )}

          {/* Milestone dots */}
          {milestones.map((m, i) => {
            const x = pct(new Date(m.dueDate).getTime(), start, duration);
            const above = i % 2 === 0;
            const isHovered = hoveredId === m.id;
            const dotColor = m.completed ? "#10b981" : "#71717a";
            const textColor = m.completed ? "#6ee7b7" : "#a1a1aa";
            const label = m.title.length > 20 ? m.title.slice(0, 19) + "…" : m.title;

            // Shift tooltip left/right near the edges so it doesn't overflow
            const tooltipAlign =
              x < 15 ? "left-0 -translate-x-0" :
              x > 85 ? "right-0 translate-x-0" :
              "left-1/2 -translate-x-1/2";

            return (
              <div
                key={m.id}
                className="absolute top-1/2 cursor-pointer"
                style={{ left: `${x}%`, transform: "translate(-50%, -50%)" }}
                onMouseEnter={() => setHoveredId(m.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Tooltip */}
                {isHovered && (
                  <div
                    className={`absolute bottom-full mb-3 z-50 w-48 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 shadow-2xl pointer-events-none ${tooltipAlign}`}
                  >
                    <p className="text-white text-xs font-semibold leading-snug mb-1.5">
                      {m.title}
                    </p>
                    <p className="text-zinc-400 text-[11px] mb-2">{fmtFull(m.dueDate)}</p>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                        m.completed ? "text-emerald-400" : "text-zinc-500"
                      }`}
                    >
                      {m.completed ? (
                        <>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          Completado
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Pendiente
                        </>
                      )}
                    </span>
                  </div>
                )}

                {/* Label above dot */}
                {above && (
                  <div className="absolute bottom-full mb-0.5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5">
                    <span
                      className="text-[10px] font-medium whitespace-nowrap leading-tight"
                      style={{ color: textColor }}
                    >
                      {label}
                    </span>
                    <span className="text-[9px] text-zinc-600 whitespace-nowrap leading-tight">
                      {fmtFull(m.dueDate)}
                    </span>
                    <div className="w-px h-3.5" style={{ backgroundColor: dotColor, opacity: 0.35 }} />
                  </div>
                )}

                {/* Dot */}
                <div
                  className="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-transform"
                  style={{
                    backgroundColor: m.completed ? "#064e3b" : "#18181b",
                    borderColor: dotColor,
                    transform: isHovered ? "scale(1.5)" : "scale(1)",
                  }}
                >
                  {m.completed && (
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                </div>

                {/* Label below dot */}
                {!above && (
                  <div className="absolute top-full mt-0.5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5">
                    <div className="w-px h-3.5" style={{ backgroundColor: dotColor, opacity: 0.35 }} />
                    <span
                      className="text-[10px] font-medium whitespace-nowrap leading-tight"
                      style={{ color: textColor }}
                    >
                      {label}
                    </span>
                    <span className="text-[9px] text-zinc-600 whitespace-nowrap leading-tight">
                      {fmtFull(m.dueDate)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Start / End date labels */}
        <div className="flex justify-between mt-2 text-[10px] text-zinc-600">
          <span>{fmtShort(start)}</span>
          <span>{fmtShort(end)}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 px-1 mt-1">
        <LegendItem color="bg-zinc-700" label="Duración del proyecto" />
        <LegendItem color="bg-amber-500" label={`Progreso (${progress}%)`} />
        <LegendItem color="bg-emerald-600" label="Hito completado" circle />
        <LegendItem color="bg-zinc-600 ring-1 ring-zinc-500" label="Hito pendiente" circle />
        {todayInRange && <LegendItem color="bg-zinc-500" dashed label="Hoy" />}
      </div>
    </div>
  );
}

function LegendItem({
  color,
  label,
  circle = false,
  dashed = false,
}: {
  color: string;
  label: string;
  circle?: boolean;
  dashed?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {dashed ? (
        <span className="w-5 h-px border-t-2 border-dashed border-zinc-500" />
      ) : (
        <span className={`w-2.5 h-2.5 flex-shrink-0 ${circle ? "rounded-full" : "rounded-sm"} ${color}`} />
      )}
      <span className="text-xs text-zinc-500">{label}</span>
    </div>
  );
}
