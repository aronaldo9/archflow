import React from "react";

type Accent = "zinc" | "amber" | "emerald" | "orange" | "blue" | "violet";

interface Props {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  accent?: Accent;
  /** Renders a small inline progress bar (0-100) below the value */
  progress?: number;
}

const accentStyles: Record<Accent, { icon: string; value: string }> = {
  zinc:    { icon: "bg-zinc-700 text-zinc-300",    value: "text-white" },
  amber:   { icon: "bg-amber-500/15 text-amber-400",  value: "text-amber-400" },
  emerald: { icon: "bg-emerald-500/15 text-emerald-400", value: "text-emerald-400" },
  orange:  { icon: "bg-orange-500/15 text-orange-400",  value: "text-orange-400" },
  blue:    { icon: "bg-blue-500/15 text-blue-400",   value: "text-white" },
  violet:  { icon: "bg-violet-500/15 text-violet-400",  value: "text-white" },
};

const progressTrack: Record<Accent, string> = {
  zinc:    "bg-zinc-300",
  amber:   "bg-amber-400",
  emerald: "bg-emerald-400",
  orange:  "bg-orange-400",
  blue:    "bg-blue-400",
  violet:  "bg-violet-400",
};

export default function StatsCard({
  label,
  value,
  sub,
  icon,
  accent = "zinc",
  progress,
}: Props) {
  const styles = accentStyles[accent];

  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-5 flex flex-col gap-3">
      {/* Top row: label + icon */}
      <div className="flex items-start justify-between">
        <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider leading-none">
          {label}
        </p>
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${styles.icon}`}>
          {icon}
        </span>
      </div>

      {/* Value */}
      <div>
        <p className={`text-3xl font-semibold leading-none ${styles.value}`}>
          {value}
        </p>

        {/* Optional inline progress bar */}
        {progress !== undefined && (
          <div className="mt-2.5 w-full bg-zinc-700/60 rounded-full h-1">
            <div
              className={`h-1 rounded-full transition-all ${progressTrack[accent]}`}
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        )}
      </div>

      {/* Sub text */}
      <p className="text-zinc-500 text-xs">{sub}</p>
    </div>
  );
}
